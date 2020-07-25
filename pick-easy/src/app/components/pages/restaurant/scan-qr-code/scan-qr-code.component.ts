import { Component, Inject, ViewChild, AfterViewInit } from "@angular/core";
import {
  QRCodeAchievementData,
  QRCodeRewardData,
} from "../../customer/qr-code/qr-code.component";
import { NOTYF } from "src/app/shared/utils/notyf.token";
import { Notyf } from "notyf";
import { CustomerService } from "src/app/shared/customer.service";
import { RestaurantService } from "src/app/shared/restaurant.service";
import {
  Restaurant,
  RestaurantAchievementLog,
  RestaurantRewardLog,
} from "src/app/shared/models/restaurant.model";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RedeemedRewardDialogComponent } from './redeemed-reward-dialog/redeemed-reward-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: "app-scan-qr-code",
  templateUrl: "./scan-qr-code.component.html",
  styleUrls: ["./scan-qr-code.component.css"],
})
export class ScanQrCodeComponent implements AfterViewInit {
  availableDevices: MediaDeviceInfo[];
  deviceSelect = "none";
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  nextUpdateAllowed = true;
  achievementLogDisplayedColumns: string[] = [
    "timeOfScan",
    "customerName",
    "achievement",
    "progress",
  ];
  rewardLogDisplayedColumns: string[] = [
    "timeOfScan",
    "customerName",
    "reward",
  ];
  restaurant: Restaurant;
  achievementLogDataSource: MatTableDataSource<RestaurantAchievementLog>;
  rewardLogDataSource: MatTableDataSource<RestaurantRewardLog>;

  @ViewChild("achievementLogSort") achievementLogSort: MatSort;
  @ViewChild("rewardLogSort") rewardLogSort: MatSort;

  constructor(
    private customerService: CustomerService,
    private restaurantService: RestaurantService,
    public dialog: MatDialog,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  ngAfterViewInit(): void {
    this.restaurantService
      .getOwnRestaurant()
      .toPromise()
      .then((restaurant) => {
        this.restaurant = restaurant;
        this.achievementLogDataSource = new MatTableDataSource(
          restaurant.log.achievements
        );
        this.achievementLogDataSource.sort = this.achievementLogSort;
        this.rewardLogDataSource = new MatTableDataSource(
          restaurant.log.rewards
        );
        this.rewardLogDataSource.sort = this.rewardLogSort;
      });
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.availableDevices = devices;
    this.hasDevices = devices && devices.length > 0;
    this.deviceSelect = devices[0]?.deviceId;
  }

  onCodeResult(scannedString: string) {
    if (!this.nextUpdateAllowed) return;

    let parsedObj: any;
    try {
      parsedObj = JSON.parse(scannedString);
    } catch (error) {
      return;
    }
    // Achievement QR Code
    if (
      parsedObj.restaurantId &&
      parsedObj.customerId &&
      parsedObj.restaurantAchievementId
    ) {
      let {
        customerId,
        restaurantId,
        restaurantAchievementId,
      }: QRCodeAchievementData = parsedObj;

      this.customerService
        .progressAchievement(customerId, restaurantId, restaurantAchievementId)
        .toPromise()
        .then(() => {
          this.notyf.success("Scanned successfully!");
          return this.restaurantService.getOwnRestaurant().toPromise();
        })
        .then((restaurant) => {
          this.restaurant = restaurant;
          this.achievementLogDataSource.data = restaurant.log.achievements;
        });

      this.nextUpdateAllowed = false;

      // Wait 5 seconds before allowing another scan
      setTimeout(() => {
        this.nextUpdateAllowed = true;
      }, 5000);
    } else if (
      parsedObj.restaurantId &&
      parsedObj.customerId &&
      parsedObj.customerRewardId
    ) {
      // Reward QR Code
      let {
        customerId,
        restaurantId,
        customerRewardId,
      }: QRCodeRewardData = parsedObj;

      this.customerService
        .redeemReward(customerId, restaurantId, customerRewardId)
        .toPromise()
        .then(() => {
          this.notyf.success("Scanned successfully!");
          return this.restaurantService.getOwnRestaurant().toPromise();
        })
        .then((restaurant) => {
          this.restaurant = restaurant;
          this.rewardLogDataSource.data = restaurant.log.rewards;
          this.openRedeemedRewardDialog(restaurant.log.rewards[restaurant.log.rewards.length - 1].reward);
        }).catch(() => {
          this.notyf.error("Scan failed! (May have already been redeemed)");
        });

      this.nextUpdateAllowed = false;

      // Wait 5 seconds before allowing another scan
      setTimeout(() => {
        this.nextUpdateAllowed = true;
      }, 5000);
    } else return;
  }

  onDeviceSelectChange(selected: string) {
    const device = this.availableDevices.find(
      (device) => device.deviceId === selected
    );
    this.currentDevice = device || null;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }

  openRedeemedRewardDialog(reward: string) {
    this.dialog.open(RedeemedRewardDialogComponent, {
      width: "600px",
      data: { reward },
      disableClose: true,
    });
  }
}

import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { NOTYF } from "./utils/notyf.token";
import { Notyf } from "notyf";

/* Ensures restaurant staff can't access customer routes */
@Injectable({ providedIn: "root" })
export class CustomerGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    @Inject(NOTYF) private notyf: Notyf
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authenticationService.currentUser.isRestaurantStaff) return true;

    this.router.navigate(["/"]);
    this.notyf.error("Unauthorized or forbidden access to this resource");

    return false;
  }
}

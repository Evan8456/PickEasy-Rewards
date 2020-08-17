# PickEasy Rewards

This project contains a loyalty system web app for a start-up called [PickEasy](https://www.pickeasy.ca/) that won 1st place in the 2020 Summer Software Engineering course (CSCC01) at UTSC.

## Features

- Mobile-friendly and simple UI
- Gamified and intuitive UX

**As a _restaurant_:**

- Configure gamified Achievements and Rewards that are tailored to the customers.
- Scan Achievement and Reward using QR Codes to allow customers to keep track of progress.

**As a _customer_:**

- Discover any of your favourite restaurants and check out its Achievements and Rewards.
- Activate and present Achievement QR Codes to restaurants to earn progression and Tickets.
- Spend Tickets to Level Up Teirs (Bronze - Diamond) to unlock better rewards.
- Spend Tickets to Roll a Random Reward based on your current teir.


## Link:
https://pick-easy.herokuapp.com/



## Run on Localhost:

1. Create a `.env` file in the pick-easy folder with the following fields:
	
	`JWT_SECRET=<insert value> `
	
	`S3_SECRET_ACCESS_KEY= <insert value>`
	
	`S3_ACCESS_KEY_ID=<insert value>`
	
	`S3_BUCKET_REGION=us-east-2`
	
	`S3_BUCKET_NAME=pick-easy`

2. Run command: `npm i`

3. Run command: `npm run dev`

### Made by: [Luke Zhang](https://github.com/Smawllie), Evan Ng, [Anthony Alaimo](https://github.com/AnthonyAlaimo), [Pravinthan Prabagaran](https://github.com/pravinthan), [Jeremy (Chi Jian) Hsu](https://github.com/Jer3myHsu)

![Alt text](pick-easy/assets/demo.png?raw=true "Demo")

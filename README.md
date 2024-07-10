# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

 *Note: You must deploy the backend Calculator Rest API before this Demo React App*

- Node.js (v18 or later)
- Yarn
- Docker

## Getting Started

### Running Locally

1. **Clone the repository:**

   ```sh

   git clone https://github.com/Raulalberto1/demo-react.git
   cd your-project

2. **Install dependencies::**

 npm install

3. **Create a .env file:**

 Create a file named .env in the frontend directory and add the following environment variable:

  REACT_APP_OPERATIONS_URL=http://localhost:8080 <---Backend URL

4. **Start the development server:**

 `npm start`

5. **Access the application:**

  Open your browser and navigate to http://localhost:3000.


### Running in Docker

1. **Clone the repository:**

   ```sh

   git clone https://github.com/Raulalberto1/demo-react.git
   cd your-project

2. **Create a docker-compose.yml file:**

 Ensure you have a docker-compose.yml file in the root directory with the following content

 version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_OPERATIONS_URL=http://localhost:8080 <---Backend URL
    networks:
      - mynetwork

networks:
  mynetwork:
    external: true

3. **Build and run the Docker container:**

 docker-compose build
 docker-compose up

4. **Access the application:**

  Open your browser and navigate to http://localhost:3000.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run eject`

## Calculator App

### Functional tests for APP Calculator:

The first step is to access on the login screen

Available users:

 - User 1
 user1
 password1
 balance:100.0
 Status Active

 - User 2
 user2
 password2
 balance:50.0
 Status Active

 - User 3
 user3
 password3
 balance:200.0
 Status Inactive

 - User 4
 user4
 password4
 balance:0.0
 Status Active

If a correct user is entered, it will log in and send you to the calculator screen, where appropriate it will indicate invalid credentials, blocked or not found.

## Calculator Screen

The view upon loading, obtains the available operations, as well as their transaction cost and the user's current balance.
If you do not have a balance, it will not allow any operation.
- Operation Sum:
The calculator waits for the entry of 2 numbers when you click Add, if you have a balance it allows the operation, in your case it indicates that you do not have available credit, then it updates the balance.

- Subtraction Operation
The calculator waits for the entry of 2 numbers, if it has a balance it allows the operation.

- Multiplication operation
The calculator waits for the entry of 2 numbers, if it has a balance it allows the operation.

- division operation
The calculator waits for the entry of 2 numbers, if the divisor is zero it indicates that the operation cannot be performed, if it has a balance it allows the operation.

- Operation Sqrt
The calculator waits for the entry of 1 number, if it is less than zero it does not allow the operation, if it has a balance it allows the operation.

- Operation Radom
The calculator does not need to enter numbers, if it has a balance it allows the operation.

- Record Grid
This table shows all operations successfully performed by the user, sorts them descendingly, can be sorted by fields, and allows deletion of records.
There is also pagination, showing by default 10 records, and a search field.
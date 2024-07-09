# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

You must deploy the backend Calculator Rest API before this Demo React App

- Node.js (v18 or later)
- Yarn
- Docker

## Getting Started

### Running Locally

1. **Clone the repository:**

   ```sh
   git clone https://github.com/your-repo/your-project.git
   cd your-project/frontend

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
   git clone https://github.com/your-repo/your-project.git
   cd your-project/frontend

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


# FitMatch Backend

This repository contains the backend code for the FitMatch application. FitMatch is a TFG which emulates a platform designed to callow users to track their workouts, allowing users to find the perfect match for their fitness goals.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)


## Features

- User authentication and authorization
- Profile management for trainers and users
- Matching algorithm to pair users with trainers
- Scheduling and booking sessions
- Payment processing
- Notification system for updates and reminders

## Technologies Used

- **TypeScript**: For type-safe JavaScript
- **Node.js**: JavaScript runtime for building scalable network applications
- **Express**: Web framework for Node.js
- **Prisma**: ORM for database interactions
- **JWT**: JSON Web Tokens for secure authentication
- **Jest**: Testing framework for JavaScript

## Installation

To get a local copy up and running, follow these simple steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/cberdejo/FitMatch_backend.git
    ```

2. Navigate to the project directory:
    ```sh
    cd FitMatch_backend
    ```

3. Install dependencies:
    ```sh
    npm install
    ```

4. Set up environment variables:
    Create a `.env` file in the root directory and add the necessary environment variables as specified in the [Environment Variables](#environment-variables) section.

5. Run database migrations:
    ```sh
    npx prisma migrate dev
    ```

6. Start the development server:
    ```sh
    npm run dev
    ```

## Usage

### Running Tests

To run the tests, use the following command:
```sh
npm run test  
```
## Environment Variables
The following environment variables are required to run the application:

Variable ->	Description
```sh
PORT	-> Refers to the port on which the backend will be accessible. Recommended value is 3000.
JWT_SECRET ->	A secret key used to encrypt JWT tokens. A strong, compact password is recommended, which can be generated online.
DATABASE_URL ->	The URL for connecting to the database. It should have the following structure: mysql://user:password@localhost:port/fitmatch. Use localhost for local databases, typically on port 3306.
HASH_SECRET ->	A secret key used to encrypt data with SHA-256. A strong, compact password is recommended.
EMAIL	-> The email address used to send emails to users.
EMAIL_PASSWORD ->	The app password for the email account, usually found in the security settings of the email account.
FRONTEND_URL -> The URL of the frontend. If running locally, it is likely http://localhost:4200/.
MINUTOS_EXPIRACION_TOKEN_VERIFICACION ->	Defines the duration of a user session in minutes. Recommended value is 60 for one hour.
CLOUDINARY_API_KEY ->	Obtained from logging into Cloudinary.
CLOUDINARY_CLOUD_NAME	-> Obtained from logging into Cloudinary.
CLOUDINARY_API_SECRET ->	Obtained from logging into Cloudinary.
MINUTOS_BLOQUEO	-> The duration for which an account is locked after repeated failed login attempts. Recommended value is between five minutes and one hour.
INTENTOS_BLOQUEO -> The number of failed login attempts before an account is locked. Recommended value is between five and ten.
MINUTOS_CONTAR_BLOQUEO ->The time window for counting failed login attempts. If this time passes, the counter resets. Recommended value is less
```

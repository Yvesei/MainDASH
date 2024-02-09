# Project Name

MainDASH - A web application for creating and managing tasks.

## Project Structure

The project is structured into two main folders:

client - Contains the Vue.js frontend code.
server - Contains the Node.js and Express backend code.

## Prerequisites

Make sure you have the following software installed on your machine:

Node.js\
NPM\
MySQL

## Getting Started

To run the project locally, follow these steps:

#### 1. Clone the repository

```bash
git clone https://github.com/Yvesei/MainDASH.git

cd MainDASH
```

#### 2. Install Dependencies

Navigate to the client and server folders and install the required dependencies.

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

#### 3. Configure the Environment Variables

In the server folder, create a .env file and provide the necessary environment variables. You can use this .env file as a reference.

```bash
DATABASE_URL="mysql://root:@localhost:3306/blog"

JWT_KEY=f2b11d8bbcfe4156be5faca2873b1cd7a20fedb5b0a40748b72a8f47451cfbd8
```

- you can replace the database url with yours if you happened to have it running on another port number.

#### 4. Set Up the Database

Before running the project, you need to set up the database and run migrations.

Create the Database
Create a new database in your chosen database management system.

Run Migrations
In the server folder, run the following command to apply migrations using Prisma:

```bash
npx prisma migrate dev
```

This command will create the necessary tables and schema in your database.

#### Seed Data

- you can head to the server folder and type in terminal

```bash
node seeds/seed.js
```

#### 5. Run the Development Servers

In separate terminal windows, start the development servers for the client and server.

#### Start the client server

```bash
cd client
npm start
Start the server
```

```bash
cd server
npm start
```

### 5. Access the Application

Open your web browser and visit http://localhost:8080/ to access the application or local_IP:8080.

## LOGIN

you can use the credentials below :
_email_ : admin
_password_ : admin

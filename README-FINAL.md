# Storefront backend (products-api)
The purpose of this file is to document the storefront backend project. It contains the following informations:

- How to install and configure the project
- How to setup and configure the database
- How run tests and lunch application

## Installation
To install the project, you must follow these steps:

1. Configure the environment
2. Run docker-compose to lunch the database system
3. Install project dependencies (node dependencies)
4. Run the tests and lunch the application

### 1. Configure the environment
To configure the application and setup the database you need to configure the environment.
It  consists of adding  a **.env** inside the root folder of the application.  
By default there is a **.env.example** file in the project directory. 
It contains a sample environment configuration for the project.
You can copy it and rename it to **.env** and provide your configuration values.
The following table lists the important variables that must be present in the env file.

| **Environment variable** | **Purpose**                                                  | **Type of content**                       |
|--------------------------|--------------------------------------------------------------|-------------------------------------------|
| **ENV**                  | Configure the environment the application will be running in | Possible values are **prod** and **test** |
| **TOKEN_SECRET**         | The secret key used to sign JWT tokens                       | Any long string                           |
| **SALT**                 | Addition for password encryption                             | Any long string                           |
| **ROUNDS**               | Encryption strengthning rounds                               | **An integer value (Example: 10)**        |
| **POSTGRES_USER**        | PostgreSQL database user name                                | String value                              |
| **POSTGRES_PASSWORD**    | PostgreSQL database password                                 | String value                              |
| **POSTGRES_DB**          | PostgreSQL production database name                          | String value                              |
| **POSTGRES_DB_TEST**     | PostgreSQL test database name                                | String value                              |


### 2. Run docker-compose
This task assumes you have docker and docker-compose installed. If not follow these links to install [docker](https://docs.docker.com/get-docker/) and [docker-compose](https://docs.docker.com/compose/install/).
Once you have docker and docked compose installed, you can start the database server with the following command:

```bash
docker-compose up -d 
```

Depending on your operating system, you can have to add **sudo** to run the command with super user privileges. 

### 3. Install project dependencies
To install project dependencies you can run the following commands depending on your package manager.
```bash
npm install
```
or 
```bash 
yarn
```

### 4. Running tests
:warning: **Note**: Running tests means you are in test mode. It simply means the the **ENV** key in the **.env** file must contain **ENV=test**

To run the test suites, run the following command: 
```bash
npm run test
```
Don't mind creating the test database by hand. The test script can do the following if the **.env** file is well configured:
1. Create the test database
2. Run all tests 
3. Cleanup the test database if everything went on succesfully.

### 5. Lunching the application
To succesfully lunch the application, you need edit the .env file and change the ENV key back to prod. 
You can now lunch the application by running:

```bash
npm run start
```
**If everything went on succesfully, the application will start on port 3000**.

You can now access it typing: http://localhost:3000

## Running environment infos

| Element          | Value                 |
|------------------|-----------------------|
| Application port | 3000                  |
| Application URL  | http://localhost:3000 |

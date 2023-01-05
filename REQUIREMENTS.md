# API Requirements
This file contains the Restful API specification. It helps having an overview of the API and gives the data shapes of tables and models in use. 

## API Endpoints
To facilitate API testing, there is a postman exported collection associated with the project.
Download it and import it into your postman. The changable zone in the requests are: 
* The url (which contains variable your can update to match your environment)
* The body of the requests
* The collection authentication JWT.

The following elements gives a link to download the collection and the link to a small video of how to import an test some aspects.
- [Storefront collection JSON file for Postman testing](src/docs/collections/storefront_postman_collection.json)
- [Postman collection testing sample video](src/docs/videos/explication_video.mp4)


#### Registration and authentication

| VERB | PATH          | DESCRIPTION                       | AUTHENTICATION |
|------|---------------|-----------------------------------|----------------|
| POST | /register     | Register a new user in the system | NONE           |
| POST | /authenticate | Connect to the system             | NONE           |

#### Products

| VERB   | PATH          | DESCRIPTION                     | AUTHENTICATION |
|--------|---------------|---------------------------------|----------------|
| GET    | /products     | Product index. List of products | NONE           |
| GET    | /products/:id | Product details                 | NONE           |
| POST   | /products     | Add a new product to catalog    | JWT            |
| PUT    | /products/:id | Update a product in catalog     | JWT            |
| DELETE | /products/:id | Delete a product in catalog     | JWT            |

#### Users

| VERB   | PATH       | DESCRIPTION               | AUTHENTICATION |
|--------|------------|---------------------------|----------------|
| GET    | /users     | User index. List of users | JWT            |
| GET    | /users/:id | User details              | JWT            |
| POST   | /users     | Create a new user         | JWT            |
| PUT    | /users/:id | Update user information   | JWT            |
| DELETE | /users/:id | Delete a user             | JWT            |

#### Orders

| VERB   | PATH                      | DESCRIPTION                            | AUTHENTICATION |
|--------|---------------------------|----------------------------------------|----------------|
| GET    | /orders                   | Order index. List of orders            | NONE           |
| GET    | /orders/:id               | Get order details                      | NONE           |
| POST   | /orders                   | Create an order                        | NONE           |
| PUT    | /orders/:id               | Update an order                        | NONE           |
| DELETE | /orders/:id               | Delete an order                        | NONE           |
| GET    | /orders/:id/products      | Get products in a order                | NONE           |
| GET    | /orders/:id/products/:pid | Get an ordered product details         | NONE           |
| POST   | /orders/:id/products      | Add a product and quantity to an order | NONE           |
| PUT    | /orders/:id/products/:pid | Update a product line in an order      | NONE           |
| DELETE | /orders/:id/products/:pid | Delete a product line from an order    | NONE           |

#### Orders of a user 

| VERB | PATH                       | DESCRIPTION                    | AUTHENTICATION |
|------|----------------------------|--------------------------------|----------------|
| GET  | /current-user-order/:id    | Current active order of a user | JWT            |
| GET  | /completed-user-orders/:id | Completed orders of a user     | JWT            |

## Data Shapes
#### Product

| Column | Type    | Nullable | Description                           |
|--------|---------|----------|---------------------------------------|
| id     | SERIAL  | NO       | Unique identifier of a product record |
| name   | VARCHAR | NO       | Product name                          |
| price  | INTEGER | NO       | Cost of the product                   |

#### User

| Column    | Type    | Nullable | Description                        |
|-----------|---------|----------|------------------------------------|
| id        | SERIAL  | NO       | Unique identifier of a user record |
| username  | VARCHAR | NO       | Username to authenticate user      |
| password  | VARCHAR | NO       | User encrypted password with salt  |
| firstName | VARCHAR | NO       | User firtname                      |
| lastName  | VARCHAR | NO       | User lastname                      |

#### Orders

| Column     | Type    | Nullable | Description                                               |
|------------|---------|----------|-----------------------------------------------------------|
| id         | SERIAL  | NO       | Unique identifier of order records                        |
| user_id    | INTEGER | NO       | Reference of user primary key                             |
| status     | VARCHAR | NO       | Order status (Allowed values are "active" and "complete") |
| order_date | DATE    | NO       | Date of the order                                         |

#### Order products

| Column     | Type    | Nullable | Description                                  |
|------------|---------|----------|----------------------------------------------|
| id         | SERIAL  | NO       | Unique identifier of an ordered product      |
| product_id | INTEGER | NO       | Reference of product primary key             |
| order_id   | INTEGER | NO       | Reference of order primary key               |
| quantity   | INTEGER | NO       | Ordered quantity of the product in the order |



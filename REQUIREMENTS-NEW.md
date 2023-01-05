# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
[Storefront collection JSON file](src/docs/collections/storefront_postman_collection.json)

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
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(200),
    password VARCHAR(255)
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id),
    status VARCHAR(50),
    order_date DATE
);

CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    order_id INTEGER REFERENCES orders(id),
    quantity DECIMAL
);

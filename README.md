# REST-API-for-Ecommerce-using-nodejs
Nodejs eCommerce Shopping API that allows API consumers to interact with the application, behind the scene it uses Nodejs, Express and PostgreSQL

## Dependecies
[NodeJs](https://nodejs.org/en/) - A JavaScript runtime environment\
[Express](https://expressjs.com/) - A NodeJs framework\
[PostgreSQL](https://www.postgresql.org/) - A SQL database

## Setup and run
to setup this project, run the following commands on your terminal

1. to clone the project
```bash
https://github.com/ShivNakil/REST-API-for-Ecommerce-using-nodejs.git
```
2. navigate to the project directory
```bash
cd REST-API-for-Ecommerce-using-nodejs
```
3. install neccesary packages, modules
```bash
npm install
```
4. to run the project
```bash
npm start
```
5. using POSTMAN you can use this default url of
```bash
http://localhost:3000
```
I recommend that you use [POSTMAN](https://www.postman.com/) for testing this ecommerce api or you can hook it up to your front-end application like [Angular](https://angular.io/).

## Author
[ShivNakil](https://github.com/ShivNakil)


## Endpoints:

#### Register User:

    Method: POST
    URL: http://localhost:3000/api/register
    Body: JSON with the email and password fields
    Expected Output: A message confirming the user registration

#### Login User:

    Method: POST
    URL: http://localhost:3000/api/login
    Body: JSON with the email and password fields
    Expected Output: A message confirming successful login along with a token.

#### Get Categories:

    Method: GET
    URL: http://localhost:3000/api/categories
    Headers: Include Authorization with the token from login
    Expected Output: A list of categories

#### Get All Products:

    Method: GET
    URL: http://localhost:3000/api/products
    Headers: Include Authorization with the token from login
    Expected Output: A list of all products

#### Get Products by Category:

    Method: GET
    URL: http://localhost:3000/api/products/1 (replace 1 with a category ID)
    Headers: Include Authorization with the token from login
    Expected Output: A list of products in the specified category

#### Add Product to Cart:

    Method: POST
    URL: http://localhost:3000/api/cart/add
    Headers: Include Authorization with the token from login
    Body: JSON with the productId and quantity fields
    Expected Output: A message confirming the product addition to the cart

#### View Cart:

    Method: GET
    URL: http://localhost:3000/api/cart
    Headers: Include Authorization with the token from login
    Expected Output: The user's current cart contents

#### Remove Product from Cart:

    Method: DELETE
    URL: http://localhost:3000/api/cart/remove/1 (replace 1 with the cart item ID)
    Headers: Include Authorization with the token from login
    Expected Output: A message confirming the cart item removal

#### Place an Order:

    Method: POST
    URL: http://localhost:3000/api/order/place
    Headers: Include Authorization with the token from login
    Body: JSON with the userId and items fields
    Expected Output: A message confirming the order placement

#### Get Order Details:

    Method: GET
    URL: http://localhost:3000/api/order/details/1 (replace 1 with an order ID)
    Headers: Include Authorization with the token from login
    Expected Output: Details of the specified order


Files in 'required files' folder can be used to configure POSTMAN and also to create database files in PostgreSQL


<!-- This API has been made for a small scale e commerce businesses. -->

<!-- ### Buyer Related: -->

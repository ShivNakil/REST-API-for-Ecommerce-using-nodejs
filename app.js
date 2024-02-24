// Importing required packages and modules
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Setting up express app
const app = express();
const port = 3000;

// Using body-parser middleware
app.use(bodyParser.json());

// Setting up PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "your_database_name",
    password: "your_password",
    port: 5432,
});

// Function to run SQL queries
async function runQuery(query, values) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, values);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

// JWT secret key
const secretKey = 'your_secret_key';

// Middleware to verify JWT token
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.user = user;
        next();
    });
}

// POST endpoint to register a new user
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if email is already registered
        const query = 'SELECT COUNT(*) FROM users WHERE email = $1';
        const values = [email];
        const result = await runQuery(query, values);
        if (result[0].count > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Insert new user into database
        const insertQuery = 'INSERT INTO users (email, password) VALUES ($1, $2)';
        const insertValues = [email, password];
        await runQuery(insertQuery, insertValues);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

// POST endpoint to login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if credentials are valid
    const query = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const values = [email, password];
    const users = await runQuery(query, values);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ user: users[0].id }, secretKey);
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// GET endpoint to fetch categories
app.get('/api/categories', async (req, res) => {
    try {
        const query = 'SELECT * FROM categories';
        const categories = await runQuery(query);
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// GET endpoint to fetch products by category
app.get('/api/products/:categoryId', verifyToken, async (req, res) => {
    const { categoryId } = req.params;
    try {
        const query = 'SELECT * FROM products WHERE categoryId = $1';
        const values = [categoryId];
        const products = await runQuery(query, values);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// POST endpoint to add a product to the cart
app.post('/api/cart/add', async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const query = 'INSERT INTO cart (productId, quantity) VALUES ($1, $2)';
        const values = [productId, quantity];
        await runQuery(query, values);
        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
});

// GET endpoint to fetch items in the cart
app.get('/api/cart', async (req, res) => {
    try {
        const query = 'SELECT * FROM cart';
        const cartItems = await runQuery(query);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart items', error: error.message });
    }
});

// DELETE endpoint to remove a product from the cart
app.delete('/api/cart/remove/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;
    try {
        const query = 'DELETE FROM cart WHERE id = $1';
        const values = [cartItemId];
        await runQuery(query, values);
        res.json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
});

// POST endpoint to place an order
app.post('/api/order/place', async (req, res) => {
    const { userId, items } = req.body;
    try {
        const query = 'INSERT INTO orders (userId, items, date) VALUES ($1, $2, CURRENT_TIMESTAMP)';
        const values = [userId, items];
        await runQuery(query, values);
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error: error.message });
    }
});

// GET endpoint to fetch order history
app.get('/api/order/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const query = 'SELECT * FROM orders WHERE userId = $1';
        const values = [userId];
        const orders = await runQuery(query, values);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order history', error: error.message });
    }
});

// GET endpoint to fetch all products
app.get('/api/products', async (req, res) => {
    try {
        const query = 'SELECT * FROM products';
        const products = await runQuery(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong' });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

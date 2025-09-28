const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data files
const POSTS_FILE = path.join(__dirname, 'data', 'posts.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');
const ADMINS_FILE = path.join(__dirname, 'data', 'admins.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Helper functions
function readData(file) {
    try {
        if (!fs.existsSync(file)) {
            fs.writeFileSync(file, JSON.stringify([]));
        }
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        console.error('Error reading data:', error);
        return [];
    }
}

function writeData(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing data:', error);
    }
}

// Routes

// Posts
app.get('/api/posts', (req, res) => {
    const posts = readData(POSTS_FILE);
    res.json(posts);
});

app.post('/api/posts', (req, res) => {
    const posts = readData(POSTS_FILE);
    const newPost = { id: Date.now().toString(), ...req.body };
    posts.push(newPost);
    writeData(POSTS_FILE, posts);
    res.json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const posts = readData(POSTS_FILE);
    const index = posts.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...req.body };
        writeData(POSTS_FILE, posts);
        res.json(posts[index]);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

app.delete('/api/posts/:id', (req, res) => {
    const posts = readData(POSTS_FILE);
    const filtered = posts.filter(p => p.id !== req.params.id);
    writeData(POSTS_FILE, filtered);
    res.json({ success: true });
});

// Users
app.get('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const users = readData(USERS_FILE);
    const existingUser = users.find(u => u.id === req.body.id);
    if (!existingUser) {
        users.push(req.body);
        writeData(USERS_FILE, users);
    }
    res.json(req.body);
});

app.get('/api/users/:id', (req, res) => {
    const users = readData(USERS_FILE);
    const user = users.find(u => u.id === req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Orders
app.get('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    res.json(orders);
});

app.post('/api/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const newOrder = { id: Date.now().toString(), ...req.body };
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    res.json(newOrder);
});

app.put('/api/orders/:id', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...req.body };
        writeData(ORDERS_FILE, orders);
        res.json(orders[index]);
    } else {
        res.status(404).json({ error: 'Order not found' });
    }
});

app.get('/api/orders/user/:userId', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
});

// Admins
app.get('/api/admins', (req, res) => {
    const admins = readData(ADMINS_FILE);
    res.json(admins);
});

app.post('/api/admins', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const existingAdmin = admins.find(a => a.username === req.body.username);
    if (!existingAdmin) {
        admins.push(req.body);
        writeData(ADMINS_FILE, admins);
    }
    res.json(req.body);
});

app.put('/api/admins/:username', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const index = admins.findIndex(a => a.username === req.params.username);
    if (index !== -1) {
        admins[index] = { ...admins[index], ...req.body };
        writeData(ADMINS_FILE, admins);
        res.json(admins[index]);
    } else {
        res.status(404).json({ error: 'Admin not found' });
    }
});

app.delete('/api/admins/:username', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const filtered = admins.filter(a => a.username !== req.params.username);
    writeData(ADMINS_FILE, filtered);
    res.json({ success: true });
});

// Initialize default admin
const admins = readData(ADMINS_FILE);
if (admins.length === 0) {
    admins.push({ username: '@mama_brik', permissions: { canAddProducts: true, canAddAdmins: true, canManageOrders: true } });
    writeData(ADMINS_FILE, admins);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
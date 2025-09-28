const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

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

// Initialize data
function initializeData() {
    const posts = readData(POSTS_FILE);
    if (posts.length === 0) {
        const initialPosts = [
            {id: '1', title: 'Джинсы', price: 5000, description: 'Синего цвета, прямые', photos: ['https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans+1', 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans+2', 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans+3'], condition: 8.5, size: 'M'},
            {id: '2', title: 'Куртка', price: 12000, description: 'Зеленого цвета, теплая', photos: ['https://via.placeholder.com/300x300/00FF00/000000?text=Jacket+1', 'https://via.placeholder.com/300x300/00FF00/000000?text=Jacket+2'], condition: 9.0, size: 'L'},
            {id: '3', title: 'Джинсы 2', price: 5000, description: 'Синего цвета, прямые', photos: ['https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans2+1', 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans2+2'], condition: 7.2, size: 'S'},
            {id: '4', title: 'Куртка 8', price: 122, description: 'Зеленого цвета, теплая', photos: ['https://via.placeholder.com/300x300/00FF00/000000?text=Jacket8'], condition: 6.8, size: 'XL'},
            {id: '5', title: 'Джинсы 3', price: 5000, description: 'Синего цвета, прямые', photos: ['https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans3+1', 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans3+2', 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans3+3'], condition: 8.9, size: 'M'},
            {id: '6', title: 'Куртка 7', price: 600, description: 'Зеленого цвета, теплая', photos: ['https://via.placeholder.com/300x300/00FF00/000000?text=Jacket7+1', 'https://via.placeholder.com/300x300/00FF00/000000?text=Jacket7+2'], condition: 5.5, size: 'M'},
            {id: '7', title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые', photos: ['https://via.placeholder.com/300x300/0000FF/FFFFFF?text=Jeans4'], condition: 9.2, size: 'L'},
            {id: '8', title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая', photos: ['https://via.placeholder.com/300x300/00FF00/000000?text=Jacket5+1', 'https://via.placeholder.com/300x300/00FF00/000000?text=Jacket5+2', 'https://via.placeholder.com/300x300/00FF00/000000?text=Jacket5+3'], condition: 7.7, size: 'S'},
        ];
        writeData(POSTS_FILE, initialPosts);
    }

    const admins = readData(ADMINS_FILE);
    if (admins.length === 0) {
        const initialAdmins = [
            {username: '@mama_brik', permissions: ['add_post', 'manage_orders', 'manage_admins']},
        ];
        writeData(ADMINS_FILE, initialAdmins);
    }
}

// Routes for Posts
app.get('/posts', (req, res) => {
    const posts = readData(POSTS_FILE);
    res.json(posts);
});

app.post('/posts', (req, res) => {
    const posts = readData(POSTS_FILE);
    const newPost = { ...req.body, id: Date.now().toString() };
    posts.push(newPost);
    writeData(POSTS_FILE, posts);
    res.json(newPost);
});

app.delete('/posts/:id', (req, res) => {
    const posts = readData(POSTS_FILE);
    const filteredPosts = posts.filter(p => p.id !== req.params.id);
    writeData(POSTS_FILE, filteredPosts);
    res.json({ message: 'Post deleted' });
});

// Routes for Users
app.get('/users', (req, res) => {
    const users = readData(USERS_FILE);
    res.json(users);
});

app.post('/users', (req, res) => {
    const users = readData(USERS_FILE);
    const existingUser = users.find(u => u.id === req.body.id);
    if (!existingUser) {
        users.push(req.body);
        writeData(USERS_FILE, users);
    }
    res.json(req.body);
});

// Routes for Orders
app.get('/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const newOrder = { ...req.body, id: Date.now().toString() };
    orders.push(newOrder);
    writeData(ORDERS_FILE, orders);
    res.json(newOrder);
});

app.put('/orders/:id', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index !== -1) {
        orders[index] = { ...orders[index], ...req.body };
        writeData(ORDERS_FILE, orders);
        res.json(orders[index]);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
});

app.get('/orders/user/:userId', (req, res) => {
    const orders = readData(ORDERS_FILE);
    const userOrders = orders.filter(o => o.userId === req.params.userId);
    res.json(userOrders);
});

// Routes for Admins
app.get('/admins', (req, res) => {
    const admins = readData(ADMINS_FILE);
    res.json(admins);
});

app.post('/admins', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const existingAdmin = admins.find(a => a.username === req.body.username);
    if (!existingAdmin) {
        admins.push(req.body);
        writeData(ADMINS_FILE, admins);
    }
    res.json(req.body);
});

app.put('/admins/:username', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const index = admins.findIndex(a => a.username === req.params.username);
    if (index !== -1) {
        admins[index] = { ...admins[index], ...req.body };
        writeData(ADMINS_FILE, admins);
        res.json(admins[index]);
    } else {
        res.status(404).json({ message: 'Admin not found' });
    }
});

app.delete('/admins/:username', (req, res) => {
    const admins = readData(ADMINS_FILE);
    const filteredAdmins = admins.filter(a => a.username !== req.params.username);
    writeData(ADMINS_FILE, filteredAdmins);
    res.json({ message: 'Admin deleted' });
});

// Start server
initializeData();
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
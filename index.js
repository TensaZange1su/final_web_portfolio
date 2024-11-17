const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Task = require('./models/task');
const User = require('./models/user');
const auth = require('./middleware/auth');
const sendEmail = require('./mailer');
const roleAuth = require('./middleware/roleAuth'); // Import the middleware
const Portfolio = require('./models/portfolio');
const multer = require('multer');


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost/27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// User registration route
app.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();

        // Send welcome email after registration
        const emailSubject = "Welcome to Almas' Portfolio";
        const emailText = `Hello ${user.username},\n\nThank you for registration!`;
        await sendEmail(user.email, emailSubject, emailText);

        res.status(201).json({ message: 'User registered' });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('User found:', user);  // Debug log

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            // Increment failed login attempts
            const updatedUser = await User.findOneAndUpdate(
                { username },
                { $inc: { failedLoginAttempts: 1 } },
                { new: true }
            );

            console.log('After failed login attempt:', updatedUser);

            // Check if failed login attempts >= 3, send email
            if (updatedUser.failedLoginAttempts >= 3) {
                const emailSubject = 'Failed Login Attempt Alert';
                const emailText = `Dear ${updatedUser.username},\n\nThere have been 3 failed login attempts on your account. Please check if this was you or reset your password for security purposes.`;
                await sendEmail(updatedUser.email, emailSubject, emailText);
            }

            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Reset failed login attempts on successful login
        user.failedLoginAttempts = 0;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }
});

// Fetch tasks for the logged-in user
app.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user._id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get all portfolio items for the logged-in user
app.get('/portfolio', auth, async (req, res) => {
    try {
        const items = await Portfolio.find({ user: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio items' });
    }
});

// Add a new portfolio item
app.post('/portfolio', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const images = req.files.map(file => file.path); // Assuming you use multer for file uploads

        const newPortfolioItem = new Portfolio({
            title,
            description,
            images,
            user: req.user._id,
        });

        await newPortfolioItem.save();
        res.status(201).json(newPortfolioItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add portfolio item' });
    }
});

// Delete a portfolio item
app.delete('/portfolio/:id', auth, async (req, res) => {
    try {
        const item = await Portfolio.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!item) return res.status(404).json({ error: 'Portfolio item not found' });
        res.json({ message: 'Portfolio item deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete portfolio item' });
    }
});

// Update a portfolio item
app.put('/portfolio/:id', auth, async (req, res) => {
    try {
        const { title, description } = req.body;
        const item = await Portfolio.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { title, description, updatedAt: Date.now() },
            { new: true }
        );

        if (!item) return res.status(404).json({ error: 'Portfolio item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update portfolio item' });
    }
});
// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Папка для сохранения изображений
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Уникальное имя файла
    },
});

const upload = multer({ storage });

// Middleware for img download
app.post('/portfolio', auth, upload.array('images', 5), async (req, res) => {
    try {
        const { title, description } = req.body;
        const images = req.files.map(file => `/uploads/${file.filename}`);

        const newPortfolioItem = new Portfolio({
            title,
            description,
            images,
            user: req.user._id,
        });

        await newPortfolioItem.save();
        res.status(201).json(newPortfolioItem);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add portfolio item' });
    }
});

// Create a new task
app.post('/tasks', auth, async (req, res) => {
    const task = new Task({ name: req.body.name, user: req.user._id });
    try {
        const newTask = await task.save();

        // Send task creation notification email
        const emailSubject = 'New Task Created';
        const emailText = `Hello ${req.user.username},\n\nA new task has been created: ${newTask.name}.`;
        await sendEmail(req.user.email, emailSubject, emailText);

        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update an existing task
app.put('/tasks/:id', auth, async (req, res) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    task.name = req.body.name || task.name;
    task.status = req.body.status || task.status;
    const updatedTask = await task.save();

    // Send task update notification email
    const emailSubject = 'Task Updated';
    const emailText = `Hello ${req.user.username},\n\nYour task '${task.name}' has been updated.`;
    await sendEmail(req.user.email, emailSubject, emailText);

    res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', auth, async (req, res) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
});

app.post('/admin-route', roleAuth(['admin']), (req, res) => {
    // Only admins can access this route
    res.json({ message: 'Admin access granted' });
});

app.get('/editor-route', roleAuth(['admin', 'editor']), (req, res) => {
    // Admins and editors can access this route
    res.json({ message: 'Editor access granted' });
});

// Serve the HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/register.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'register.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/tasks.html', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tasks.html')));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
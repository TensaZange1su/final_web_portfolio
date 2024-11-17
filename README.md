# final_web_portfolio
Portfolio and Task Manager
Project Description
This is a full-stack web application for managing tasks and portfolio items. The platform supports user authentication, role-based access, and CRUD operations for tasks and portfolio items. It also integrates MongoDB for data storage and includes a responsive front-end design for a seamless user experience.

Features
Authentication and Authorization
User registration with:
First name, last name, age, gender, and username.
Password hashing with bcrypt.
Email verification via Nodemailer.
User login with support for JWT-based authentication.
Role-based access control (admin and regular users).
Task Management
Create, view, update, and delete tasks.
Task completion status tracking.
Portfolio Management
Add portfolio items with title, description, and images.
View portfolio items in a gallery-style layout.
Update and delete portfolio items.
Image upload functionality powered by multer.
Navigation Bar
Unified navigation bar for switching between Tasks, Portfolio, and Profile.
Responsive design.
Database
MongoDB for storing users, tasks, and portfolio items.
Secure and scalable database structure.
API Integration
RESTful APIs for managing tasks and portfolio items.
Middleware for user authentication and role authorization.
Tech Stack
Front-End
HTML, CSS, JavaScript
Responsive design with CSS flexbox and grid
Back-End
Node.js and Express.js
JWT for authentication
Multer for file uploads
Nodemailer for email notifications
Database
MongoDB with Mongoose ODM
Installation
1. Clone the repository
bash
git clone https://github.com/your-username/portfolio-task-manager.git
cd portfolio-task-manager
2. Install dependencies
bash
npm install
3. Set up environment variables
Create a .env file in the root directory and add the following:

makefile

PORT=3000
MONGO_URI=mongodb://localhost:27017/portfolio_task_manager
JWT_SECRET=your_jwt_secret
EMAIL_USER=almas.kuratov3@mail.ru
EMAIL_PASS=xxxxxxxxxxxxx
4. Start the server
bash
node index.js
The server will start at http://localhost:3000.

File Structure
bash
.
├── models/
│   ├── task.js         # Task schema
│   ├── portfolio.js    # Portfolio schema
│   ├── user.js         # User schema
├── public/
│   ├── styles.css      # Front-end styles
│   ├── script.js       # Front-end logic
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── portfolio.js    # Portfolio routes
│   ├── tasks.js        # Task routes
├── uploads/            # Uploaded images
├── index.js            # Main server file
├── package.json        # Dependencies and scripts
├── README.md           # Project documentation
└── .env                # Environment variables
API Endpoints
Authentication
POST /register - Register a new user.
POST /login - User login.
Tasks
GET /tasks - Retrieve all tasks for the logged-in user.
POST /tasks - Add a new task.
PUT /tasks/:id - Update a task.
DELETE /tasks/:id - Delete a task.
Portfolio
GET /portfolio - Retrieve all portfolio items for the logged-in user.
POST /portfolio - Add a new portfolio item (with image upload).
PUT /portfolio/:id - Update a portfolio item.
DELETE /portfolio/:id - Delete a portfolio item.
Usage
1. Register a New User
Visit the /register page and fill in the registration form.

2. Login
Use the /login page to access your account.

3. Manage Tasks
Navigate to the "Tasks" tab.
Add, update, or delete tasks.
4. Manage Portfolio
Navigate to the "Portfolio" tab.
Add new items with title, description, and images.
View, update, or delete portfolio items.


If you have any issues, please contact [1almas.kuratov1@gmail.com].

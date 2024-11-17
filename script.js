const registerBtn = document.getElementById('registerBtn');
const loginBtn = document.getElementById('loginBtn');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksDiv = document.getElementById('tasks');
const taskInput = document.getElementById('taskInput');
const adminPanel = document.getElementById('adminPanel');  // Example element for admin

if (registerBtn) {
    registerBtn.addEventListener('click', async () => {
        const firstName = document.getElementById('registerFirstName').value;
        const lastName = document.getElementById('registerLastName').value;
        const age = document.getElementById('registerAge').value;
        const gender = document.getElementById('registerGender').value;
        const email = document.getElementById('registerEmail').value;
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, age, gender, email, username, password })
        });

        if (response.ok) {
            alert('Registration successful! Redirecting to login page.');
            window.location.href = '/login.html';
        } else {
            alert('Registration failed');
        }
    });
}

if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        console.log("Login button clicked"); // Log when the button is clicked

        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        console.log("Username:", username, "Password:", password); // Log the values from the form

        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        console.log("Login response:", data); // Log the server's response

        if (response.ok) {  // Only proceed if the response is okay
            if (data.token) {
                localStorage.setItem('token', data.token);
                window.location.href = '/tasks.html';
            } else {
                alert('Login failed: Invalid credentials');
            }
        } else {
            if (data.message) {
                alert(`Login failed: ${data.message}`);  // Show specific error message
            } else {
                alert('Login failed: Unknown error');
            }
        }
    });
}


function getToken() {
    return localStorage.getItem('token');
}

function checkUserRole() {
    const token = getToken();
    if (token) {
        const decodedToken = jwt_decode(token);  // Decode the token to get role info
        const userRole = decodedToken.role;

        // Example: Show admin panel only to users with 'admin' role
        if (userRole === 'admin') {
            if (adminPanel) adminPanel.style.display = 'block'; // Show admin panel
        } else {
            if (adminPanel) adminPanel.style.display = 'none'; // Hide admin panel
        }
    }
}

async function fetchTasks() {
    const response = await fetch('/tasks', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const tasks = await response.json();

    tasksDiv.innerHTML = '';
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.innerHTML = `
            <span>${task.name}</span>
            <span>
                <button onclick="deleteTask('${task._id}')">Delete</button>
                <button onclick="toggleStatus('${task._id}', '${task.status}')">
                    ${task.status === 'pending' ? 'Mark Complete' : 'Mark Pending'}
                </button>
            </span>
        `;
        tasksDiv.appendChild(taskDiv);
    });
}

if (addTaskBtn) {
    addTaskBtn.addEventListener('click', async () => {
        const taskName = taskInput.value;
        if (taskName.trim()) {
            await fetch('/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ name: taskName })
            });
            taskInput.value = '';
            fetchTasks();
        }
    });
}

async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    fetchTasks();
}

async function toggleStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'pending' ? 'complete' : 'pending';
    await fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

if (window.location.pathname === '/tasks.html') {
    checkUserRole(); // Check user role when loading the tasks page
    fetchTasks();
}
document.addEventListener("DOMContentLoaded", () => {
    const token = getToken();
    if (token) {
        const user = jwt_decode(token);
        const navbarLinks = document.querySelector(".navbar-links");

        if (user.role === "admin") {
            const adminLink = document.createElement("li");
            adminLink.innerHTML = '<a href="/admin.html">Admin Panel</a>';
            navbarLinks.appendChild(adminLink);
        }
    }
});
// Function to switch between sections
function showSection(section) {
    const tasksSection = document.getElementById('tasksSection');
    const portfolioSection = document.getElementById('portfolioSection');

    if (section === 'tasks') {
        tasksSection.style.display = 'block';
        portfolioSection.style.display = 'none';
    } else if (section === 'portfolio') {
        tasksSection.style.display = 'none';
        portfolioSection.style.display = 'block';
    }
}

// Task functionality


if (addTaskBtn) {
    addTaskBtn.addEventListener('click', async () => {
        const taskName = document.getElementById('taskInput').value;
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ name: taskName })
        });

        if (response.ok) {
            alert('Task added successfully');
            fetchTasks();
        } else {
            alert('Failed to add task');
        }
    });
}

async function fetchTasks() {
    const response = await fetch('/tasks', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const tasks = await response.json();

    tasksDiv.innerHTML = '';
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.innerHTML = `
            <span>${task.name}</span>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        tasksDiv.appendChild(taskDiv);
    });
}

async function deleteTask(taskId) {
    await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    fetchTasks();
}

// Portfolio functionality
const addPortfolioBtn = document.getElementById('addPortfolioBtn');
const portfolioItemsDiv = document.getElementById('portfolioItems');

if (addPortfolioBtn) {
    addPortfolioBtn.addEventListener('click', async () => {
        const title = document.getElementById('portfolioTitle').value;
        const description = document.getElementById('portfolioDescription').value;
        const images = document.getElementById('portfolioImages').files;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        for (let i = 0; i < images.length; i++) {
            formData.append('images', images[i]);
        }

        const response = await fetch('/portfolio', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: formData
        });

        if (response.ok) {
            alert('Portfolio item added successfully');
            fetchPortfolioItems();
        } else {
            alert('Failed to add portfolio item');
        }
    });
}

async function fetchPortfolioItems() {
    const response = await fetch('/portfolio', {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const portfolioItems = await response.json();

    portfolioItemsDiv.innerHTML = '';
    portfolioItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('portfolio-item');
        itemDiv.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="portfolio-images">
                ${item.images.map(image => `<img src="${image}" alt="${item.title}">`).join('')}
            </div>
            <button onclick="deletePortfolioItem('${item._id}')">Delete</button>
        `;
        portfolioItemsDiv.appendChild(itemDiv);
    });
}

async function deletePortfolioItem(itemId) {
    await fetch(`/portfolio/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    fetchPortfolioItems();
}

// Initial fetch
if (window.location.pathname === '/portfolio.html') {
    fetchTasks();
    fetchPortfolioItems();
}

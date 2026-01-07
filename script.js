// API Configuration
const API_BASE = 'https://algeasy-backend.vercel.app/api';

// App State
let currentUser = null;
let token = null;
let currentProblem = null;

// DOM Elements
const pages = {
    landing: document.getElementById('landingPage'),
    login: document.getElementById('loginPage'),
    signup: document.getElementById('signupPage'),
    practice: document.getElementById('practicePage'),
    profile: document.getElementById('profilePage')
};

// Dashboard Elements
const loggedOutView = document.getElementById('loggedOutView');
const loggedInView = document.getElementById('loggedInView');
const dashboardUserName = document.getElementById('dashboardUserName');
const dashboardPracticeBtn = document.getElementById('dashboardPracticeBtn');
const dashboardProfileBtn = document.getElementById('dashboardProfileBtn');
const recentActivity = document.getElementById('recentActivity');

// Navigation Elements
const homeLink = document.getElementById('homeLink');
const practiceLink = document.getElementById('practiceLink');
const profileLink = document.getElementById('profileLink');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

// Auth Elements
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');

// Practice Elements
const topicSelect = document.getElementById('topicSelect');
const problemText = document.getElementById('problemText');
const answerInput = document.getElementById('answerInput');
const submitAnswer = document.getElementById('submitAnswer');
const feedback = document.getElementById('feedback');

// Profile Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userGrade = document.getElementById('userGrade');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadUserFromStorage();
    setupEventListeners();
    showPage('landing');
});

// Event Listeners
function setupEventListeners() {
    // Navigation
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('landing');
    });
    
    practiceLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser) {
            showPage('practice');
            generateProblem();
        } else {
            showPage('login');
        }
    });
    
    profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('profile');
        updateProfile();
    });
    
    loginBtn.addEventListener('click', () => showPage('login'));
    logoutBtn.addEventListener('click', logout);
    
    // Auth
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('signup');
    });
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });
    
    // Practice
    topicSelect.addEventListener('change', generateProblem);
    submitAnswer.addEventListener('click', checkAnswer);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
    
    // Hero buttons
    document.getElementById('getStartedBtn').addEventListener('click', () => {
        if (currentUser) {
            showPage('practice');
            generateProblem();
        } else {
            showPage('signup');
        }
    });
    
    document.getElementById('learnMoreBtn').addEventListener('click', () => {
        alert('Algeasy helps Year 8-10 students master algebra through interactive practice problems. Sign up to get started!');
    });
    
    // Dashboard buttons
    if (dashboardPracticeBtn) {
        dashboardPracticeBtn.addEventListener('click', () => {
            showPage('practice');
            generateProblem();
        });
    }
    
    if (dashboardProfileBtn) {
        dashboardProfileBtn.addEventListener('click', () => {
            showPage('profile');
            updateProfile();
        });
    }
}

// Page Navigation
function showPage(pageName) {
    Object.values(pages).forEach(page => page.classList.remove('active'));
    pages[pageName].classList.add('active');
    
    // Update navigation
    updateNavigation();
}

function updateNavigation() {
    if (currentUser) {
        loginBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        profileLink.classList.remove('hidden');
        
        // Show dashboard view, hide landing view
        loggedOutView.classList.add('hidden');
        loggedInView.classList.remove('hidden');
        
        // Update dashboard content
        updateDashboard();
    } else {
        loginBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        profileLink.classList.add('hidden');
        
        // Show landing view, hide dashboard view
        loggedOutView.classList.remove('hidden');
        loggedInView.classList.add('hidden');
    }
}

function updateDashboard() {
    if (!currentUser) return;
    
    // Update user info
    dashboardUserName.textContent = currentUser.name;
    
    // Update recent activity
    updateRecentActivity();
}


function updateRecentActivity() {
    // Show simple welcome message
    recentActivity.innerHTML = '<p>Welcome back! Ready to practice some algebra problems?</p>';
}

// Authentication
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            token = data.token;
            localStorage.setItem('algeasyCurrentUser', JSON.stringify(currentUser));
            localStorage.setItem('algeasyToken', token);
            
            showPage('practice');
            generateProblem();
            loginForm.reset();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const grade = document.getElementById('signupGrade').value;
    
    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, grade })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            token = data.token;
            localStorage.setItem('algeasyCurrentUser', JSON.stringify(currentUser));
            localStorage.setItem('algeasyToken', token);
            
            showPage('practice');
            generateProblem();
            signupForm.reset();
        } else {
            alert(data.error || 'Signup failed');
        }
    } catch (error) {
        alert('Network error. Please try again.');
    }
}

function logout() {
    currentUser = null;
    token = null;
    localStorage.removeItem('algeasyCurrentUser');
    localStorage.removeItem('algeasyToken');
    showPage('landing');
}

function loadUserFromStorage() {
    const userData = localStorage.getItem('algeasyCurrentUser');
    const tokenData = localStorage.getItem('algeasyToken');
    
    if (userData && tokenData) {
        currentUser = JSON.parse(userData);
        token = tokenData;
    }
}

// Problem Generation
function generateProblem() {
    const topic = topicSelect.value;
    let problem = {};
    
    switch (topic) {
        case 'linear-equations':
            problem = generateLinearEquation();
            break;
        case 'quadratic-equations':
            problem = generateQuadraticEquation();
            break;
        case 'inequalities':
            problem = generateInequality();
            break;
        case 'systems':
            problem = generateSystemOfEquations();
            break;
        default:
            problem = generateLinearEquation();
    }
    
    currentProblem = problem;
    problemText.textContent = problem.question;
    answerInput.value = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    answerInput.focus();
}

function generateLinearEquation() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const x = Math.floor(Math.random() * 10) - 5;
    const c = a * x + b;
    
    return {
        question: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} = ${c}`,
        answer: x.toString(),
        type: 'linear-equation'
    };
}

function generateQuadraticEquation() {
    const x1 = Math.floor(Math.random() * 10) - 5;
    const x2 = Math.floor(Math.random() * 10) - 5;
    
    const b = -(x1 + x2);
    const c = x1 * x2;
    
    const solutions = [x1, x2].sort((a, b) => a - b);
    
    return {
        question: `Solve for x: x² ${b >= 0 ? '+' : ''} ${b}x ${c >= 0 ? '+' : ''} ${c} = 0`,
        answer: solutions.join(', '),
        type: 'quadratic-equation'
    };
}

function generateInequality() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20) - 10;
    const x = Math.floor(Math.random() * 10) - 5;
    const c = a * x + b;
    const operator = ['<', '>', '≤', '≥'][Math.floor(Math.random() * 4)];
    
    let answer;
    switch (operator) {
        case '<':
            answer = `x < ${x}`;
            break;
        case '>':
            answer = `x > ${x}`;
            break;
        case '≤':
            answer = `x ≤ ${x}`;
            break;
        case '≥':
            answer = `x ≥ ${x}`;
            break;
    }
    
    return {
        question: `Solve for x: ${a}x ${b >= 0 ? '+' : ''} ${b} ${operator} ${c}`,
        answer: answer,
        type: 'inequality'
    };
}

function generateSystemOfEquations() {
    const x = Math.floor(Math.random() * 10) - 5;
    const y = Math.floor(Math.random() * 10) - 5;
    
    const a1 = Math.floor(Math.random() * 5) + 1;
    const b1 = Math.floor(Math.random() * 5) + 1;
    const c1 = a1 * x + b1 * y;
    
    const a2 = Math.floor(Math.random() * 5) + 1;
    const b2 = Math.floor(Math.random() * 5) + 1;
    const c2 = a2 * x + b2 * y;
    
    return {
        question: `Solve the system:\n${a1}x ${b1 >= 0 ? '+' : ''} ${b1}y = ${c1}\n${a2}x ${b2 >= 0 ? '+' : ''} ${b2}y = ${c2}`,
        answer: `(${x}, ${y})`,
        type: 'system'
    };
}

// Answer Checking
function checkAnswer() {
    if (!currentProblem || !answerInput.value.trim()) return;
    
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentProblem.answer.toLowerCase();
    
    if (userAnswer === correctAnswer) {
        feedback.textContent = 'Correct! Well done! 🎉';
        feedback.className = 'feedback correct';
        
        setTimeout(() => {
            generateProblem();
        }, 2000);
    } else {
        feedback.textContent = `Incorrect. The correct answer is: ${currentProblem.answer}`;
        feedback.className = 'feedback incorrect';
        
        setTimeout(() => {
            generateProblem();
        }, 3000);
    }
}


// Profile
function updateProfile() {
    if (!currentUser) return;
    
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    userGrade.textContent = `Grade: Year ${currentUser.grade}`;
}

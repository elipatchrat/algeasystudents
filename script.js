// API Configuration
const API_BASE = 'https://algeasy-backend.vercel.app/api';

// App State
let currentUser = null;
let token = null;
let currentProblem = null;
let stats = {
    correct: 0,
    attempted: 0,
    streak: 0,
    totalSolved: 0
};

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
const dashboardTotalSolved = document.getElementById('dashboardTotalSolved');
const dashboardAccuracy = document.getElementById('dashboardAccuracy');
const dashboardStreak = document.getElementById('dashboardStreak');
const dashboardPracticeBtn = document.getElementById('dashboardPracticeBtn');
const dashboardProfileBtn = document.getElementById('dashboardProfileBtn');
const dashboardMiniAchievements = document.getElementById('dashboardMiniAchievements');
const dashboardAchievementsText = document.getElementById('dashboardAchievementsText');
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
const correctCount = document.getElementById('correctCount');
const attemptedCount = document.getElementById('attemptedCount');
const streakCount = document.getElementById('streakCount');

// Profile Elements
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const userGrade = document.getElementById('userGrade');
const totalSolved = document.getElementById('totalSolved');
const accuracyRate = document.getElementById('accuracyRate');
const currentStreak = document.getElementById('currentStreak');

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
        alert('Algeasy helps Year 8-10 students master algebra through interactive practice problems, progress tracking, and achievements. Sign up to get started!');
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
    
    // Update stats
    dashboardTotalSolved.textContent = stats.totalSolved;
    const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
    dashboardAccuracy.textContent = `${accuracy}%`;
    dashboardStreak.textContent = stats.streak;
    
    // Update achievements
    updateMiniAchievements();
    
    // Update recent activity
    updateRecentActivity();
}

function updateMiniAchievements() {
    dashboardMiniAchievements.innerHTML = '';
    
    const achievements = [
        { icon: '🎯', name: 'First Steps', required: 10 },
        { icon: '🌟', name: 'Rising Star', required: 50 },
        { icon: '🏆', name: 'Algebra Master', required: 100 },
        { icon: '🔥', name: 'On Fire', required: 10, isStreak: true }
    ];
    
    achievements.forEach(achievement => {
        const div = document.createElement('div');
        div.className = 'mini-achievement';
        div.title = achievement.name;
        
        let unlocked = false;
        if (achievement.isStreak) {
            unlocked = stats.streak >= achievement.required;
        } else {
            unlocked = stats.totalSolved >= achievement.required;
        }
        
        if (unlocked) {
            div.classList.add('unlocked');
        }
        
        div.textContent = achievement.icon;
        dashboardMiniAchievements.appendChild(div);
    });
    
    // Update achievements text
    const unlockedCount = achievements.filter(a => {
        if (a.isStreak) return stats.streak >= a.required;
        return stats.totalSolved >= a.required;
    }).length;
    
    if (unlockedCount === 0) {
        dashboardAchievementsText.textContent = 'Start solving problems to unlock achievements!';
    } else if (unlockedCount < achievements.length) {
        dashboardAchievementsText.textContent = `Great progress! ${unlockedCount}/${achievements.length} achievements unlocked.`;
    } else {
        dashboardAchievementsText.textContent = 'Amazing! All achievements unlocked! 🎉';
    }
}

function updateRecentActivity() {
    // This would normally fetch from backend, but for now show placeholder
    if (stats.totalSolved === 0) {
        recentActivity.innerHTML = '<p>No recent activity yet. Start practicing to see your progress!</p>';
    } else {
        const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
        recentActivity.innerHTML = `
            <div class="activity-item">
                <strong>Today:</strong> Solved ${stats.totalSolved} problems with ${accuracy}% accuracy 🎯
            </div>
            <div class="activity-item">
                <strong>Current Streak:</strong> ${stats.streak} problems in a row 🔥
            </div>
        `;
    }
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
            
            stats = currentUser.stats;
            updateStatsDisplay();
            
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
            
            stats = currentUser.stats;
            updateStatsDisplay();
            
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
        stats = currentUser.stats || { correct: 0, attempted: 0, streak: 0, totalSolved: 0 };
        updateStatsDisplay();
    }
}

async function saveUserStats() {
    if (currentUser && token) {
        try {
            const response = await fetch(`${API_BASE}/user/stats`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ stats })
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                localStorage.setItem('algeasyCurrentUser', JSON.stringify(currentUser));
            }
        } catch (error) {
            console.error('Failed to save stats:', error);
        }
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
    
    stats.attempted++;
    
    if (userAnswer === correctAnswer) {
        stats.correct++;
        stats.streak++;
        stats.totalSolved++;
        
        feedback.textContent = 'Correct! Well done! 🎉';
        feedback.className = 'feedback correct';
        
        setTimeout(() => {
            generateProblem();
        }, 2000);
    } else {
        stats.streak = 0;
        feedback.textContent = `Incorrect. The correct answer is: ${currentProblem.answer}`;
        feedback.className = 'feedback incorrect';
        
        setTimeout(() => {
            generateProblem();
        }, 3000);
    }
    
    updateStatsDisplay();
    saveUserStats();
    checkAchievements();
}

function updateStatsDisplay() {
    correctCount.textContent = stats.correct;
    attemptedCount.textContent = stats.attempted;
    streakCount.textContent = stats.streak;
}

// Profile
function updateProfile() {
    if (!currentUser) return;
    
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    userGrade.textContent = `Grade: Year ${currentUser.grade}`;
    
    totalSolved.textContent = stats.totalSolved;
    
    const accuracy = stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0;
    accuracyRate.textContent = `${accuracy}%`;
    
    currentStreak.textContent = stats.streak;
    
    updateAchievements();
}

function updateAchievements() {
    const achievements = document.querySelectorAll('.achievement');
    
    if (stats.totalSolved >= 10) {
        achievements[0].classList.remove('locked');
        achievements[0].classList.add('unlocked');
    }
    
    if (stats.totalSolved >= 50) {
        achievements[1].classList.remove('locked');
        achievements[1].classList.add('unlocked');
    }
    
    if (stats.totalSolved >= 100) {
        achievements[2].classList.remove('locked');
        achievements[2].classList.add('unlocked');
    }
    
    if (stats.streak >= 10) {
        achievements[3].classList.remove('locked');
        achievements[3].classList.add('unlocked');
    }
}

function checkAchievements() {
    if (stats.totalSolved === 10) {
        showAchievementNotification('First Steps', 'Solved 10 problems!');
    } else if (stats.totalSolved === 50) {
        showAchievementNotification('Rising Star', 'Solved 50 problems!');
    } else if (stats.totalSolved === 100) {
        showAchievementNotification('Algebra Master', 'Solved 100 problems!');
    } else if (stats.streak === 10) {
        showAchievementNotification('On Fire', 'Got 10 in a row correct!');
    }
}

function showAchievementNotification(title, description) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 0.25rem;">🏆 ${title}</div>
        <div style="font-size: 0.875rem;">${description}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

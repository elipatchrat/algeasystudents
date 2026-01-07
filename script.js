// Basic app functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Algeasy app loaded!');
    
    // Simple page navigation
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.id.replace('Link', 'Page');
            
            pages.forEach(page => page.classList.remove('active'));
            const targetPage = document.getElementById(targetId);
            if (targetPage) {
                targetPage.classList.add('active');
            }
        });
    });
    
    // Basic button interactions
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            alert('Welcome to Algeasy! Sign up to get started with algebra practice.');
        });
    }
});

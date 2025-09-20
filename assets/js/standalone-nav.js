// Standalone Navigation System - Independent of theme's main.js
document.addEventListener('DOMContentLoaded', function() {
    
    // Create a completely new navigation element
    const createStandaloneNav = () => {
        // Remove any existing nav elements that might be interfering
        const existingNav = document.getElementById('nav');
        if (existingNav) {
            existingNav.style.display = 'none';
        }
        
        // Create new navigation HTML
        const navHTML = `
            <nav id="standalone-nav" class="standalone-navigation">
                <ul class="nav-links">
                    <li><a href="../home/" class="nav-link ${window.location.pathname.includes('/home') || window.location.pathname === '/' ? 'active' : ''}">
                        <i class="fa fa-home"></i> Home
                    </a></li>
                    <li><a href="../certifications/" class="nav-link ${window.location.pathname.includes('/certifications') ? 'active' : ''}">
                        <i class="fa fa-certificate"></i> Certifications
                    </a></li>
                    <li><a href="../projects/" class="nav-link ${window.location.pathname.includes('/projects') ? 'active' : ''}">
                        <i class="fa fa-project-diagram"></i> Projects
                    </a></li>
                </ul>
            </nav>
        `;
        
        // Insert the new navigation at the beginning of the body
        document.body.insertAdjacentHTML('afterbegin', navHTML);
        
        // Add smooth scrolling for same-page links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    };
    
    // Initialize the standalone navigation
    createStandaloneNav();
    
    // Ensure navigation stays visible on scroll
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('standalone-nav');
        if (nav) {
            // Always keep navigation visible
            nav.style.transform = 'translateY(0)';
            nav.style.opacity = '1';
            nav.style.visibility = 'visible';
            nav.style.display = 'flex';
        }
    });
    
    // Force navigation to be visible every 100ms (failsafe)
    setInterval(() => {
        const nav = document.getElementById('standalone-nav');
        if (nav) {
            nav.style.transform = 'translateY(0)';
            nav.style.opacity = '1';
            nav.style.visibility = 'visible';
            nav.style.display = 'flex';
        }
    }, 100);
});

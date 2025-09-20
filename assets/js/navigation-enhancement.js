// Enhanced Navigation with Smart Scroll Behavior
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.getElementById('nav');
    let lastScrollY = window.scrollY;
    let scrollThreshold = 120; // require more scroll before any hide
    let isScrolling = false;
    let minDelta = 15; // ignore micro scrolls to prevent flicker
    let lastToggleY = window.scrollY; // hysteresis to avoid rapid toggling
    
    // Ensure nav is always visible
    const ensureNavVisible = () => {
        nav.classList.remove('nav-hidden');
        nav.classList.add('nav-visible');
        // Hard-enforce visibility against any theme overrides
        nav.style.transform = 'none';
        nav.style.opacity = '1';
        nav.style.visibility = 'visible';
        nav.style.display = 'flex';
    };
    
    // Set nav as visible immediately
    ensureNavVisible();

    // On some breakpoints, the theme moves nav content into #navPanel.
    // Restore it back into #nav to keep links visible at all times.
    const restoreNavContent = () => {
        if (!nav) return;
        const panelInner = document.querySelector('#navPanel > nav');
        const hasLinks = nav.querySelector('.links');
        const hasIcons = nav.querySelector('.icons');
        if ((!hasLinks || hasLinks.children.length === 0 || !hasIcons) && panelInner) {
            // Move everything back from the panel into #nav
            const children = Array.from(panelInner.children);
            children.forEach(child => nav.appendChild(child));
        }
    };

    // Keep nav visible and content restored during scroll/resize/orientation changes
    const keepNav = () => {
        restoreNavContent();
        ensureNavVisible();
    };
    keepNav();
    ['scroll', 'resize', 'orientationchange'].forEach(evt => {
        window.addEventListener(evt, keepNav, { passive: true });
    });
    
    // Disable original scroll hide/show logic
    
    // Create and update scroll progress bar
    const createScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);
        
        const updateProgress = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (window.scrollY / scrollHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        };
        
        window.addEventListener('scroll', updateProgress);
        updateProgress();
    };
    
    createScrollProgress();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Set aria-current on current page link for accessibility
    const setAriaCurrent = () => {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        const allLinks = document.querySelectorAll('#nav .links a');
        allLinks.forEach(a => a.removeAttribute('aria-current'));
        const candidates = [
            { file: 'index.html', selector: 'a[href$="/home"], a[href$="index.html"]' },
            { file: 'generic.html', selector: 'a[href$="/certifications"], a[href$="generic.html"]' },
            { file: 'elements.html', selector: 'a[href$="/projects"], a[href$="elements.html"]' }
        ];
        const match = candidates.find(c => c.file === path) || (path === '' ? candidates[0] : null);
        if (match) {
            const el = document.querySelector(`#nav .links ${match.selector}`);
            if (el) el.setAttribute('aria-current', 'page');
        }
    };
    setAriaCurrent();
    
    // Enhanced hover effects for navigation links
    const navLinks = document.querySelectorAll('#nav .links a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.parentElement.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });
    
    // Add animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate skill bars
                if (entry.target.classList.contains('skill-item')) {
                    const skillBar = entry.target.querySelector('.skill-level');
                    if (skillBar) {
                        const width = skillBar.style.width;
                        skillBar.style.width = '0';
                        setTimeout(() => {
                            skillBar.style.width = width;
                        }, 100);
                    }
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.certification-card, .project-card, .timeline-item, .skill-item, .stat-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Project filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.dataset.filter;
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Mobile menu toggle (if needed)
    const createMobileMenuToggle = () => {
        if (window.innerWidth <= 736) {
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fa fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.style.cssText = `
                position: fixed;
                top: 15px;
                right: 15px;
                z-index: 10001;
                background: rgba(78, 84, 200, 0.9);
                border: none;
                color: white;
                padding: 10px 15px;
                border-radius: 8px;
                cursor: pointer;
                display: none;
            `;
            
            // Show on mobile only if needed
            if (window.innerWidth <= 480) {
                menuToggle.style.display = 'block';
            }
            
            document.body.appendChild(menuToggle);
            // Ensure the links list has an id for aria-controls
            const linksList = nav.querySelector('.links');
            if (linksList && !linksList.id) linksList.id = 'primary-links';
            menuToggle.setAttribute('aria-controls', 'primary-links');
            
            menuToggle.addEventListener('click', () => {
                nav.classList.toggle('mobile-open');
                const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', String(!expanded));
            });
        }
    };
    
    // Initialize mobile menu on load and resize
    window.addEventListener('resize', createMobileMenuToggle);
    createMobileMenuToggle();
    
    // Enhance experience section toggle
    const toggleButtons = document.querySelectorAll('.view-toggle .toggle-btn');
    const timelineSection = document.querySelector('.timeline-section');
    
    if (toggleButtons.length > 0 && timelineSection) {
        toggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                
                toggleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (view === 'list') {
                    timelineSection.classList.add('list-view');
                } else {
                    timelineSection.classList.remove('list-view');
                }
                
                localStorage.setItem('experienceView', view);
            });
        });
        
        // Restore saved view preference
        const savedView = localStorage.getItem('experienceView');
        if (savedView) {
            const targetBtn = document.querySelector(`.toggle-btn[data-view="${savedView}"]`);
            if (targetBtn) targetBtn.click();
        }
    }
});

// Preloader animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove preloader if exists
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 100);
    }
});

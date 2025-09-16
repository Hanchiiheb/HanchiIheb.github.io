// Enhanced JavaScript for Portfolio (2025-06 update)
// ----------------------------------------------------
(() => {
  document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------- */
    /* Sticky glass-morph navigation                      */
    /* -------------------------------------------------- */
    const nav = document.getElementById('nav');
    const stickyHandler = () => {
      if (window.scrollY > 80) nav.classList.add('sticky');
      else nav.classList.remove('sticky');
    };
    stickyHandler();
    window.addEventListener('scroll', stickyHandler);

    /* -------------------------------------------------- */
    /* Light theme only - theme toggle removed           */
    /* -------------------------------------------------- */
  
    // Set light theme permanently
    document.documentElement.setAttribute('data-theme', 'light');

    /* -------------------------------------------------- */
    /* Back-to-top rocket button                           */
    /* -------------------------------------------------- */
    const backBtn = document.createElement('button');
    backBtn.id = 'backToTop';
    backBtn.innerHTML = '<i class="fa fa-rocket"></i>';
    document.body.appendChild(backBtn);

    const backBtnToggle = () => {
      if (window.scrollY > 600) backBtn.classList.add('show');
      else backBtn.classList.remove('show');
    };
    backBtnToggle();
    window.addEventListener('scroll', backBtnToggle);

    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* -------------------------------------------------- */
    /* Scroll-reveal animations & skill bar fill          */
    /* -------------------------------------------------- */
    // Elements to reveal on scroll
    const revealSelectors = [
      '.timeline-item',
      '.project-card',
      '.certification-card',
      '.skill-item'
    ].join(',');

    const revealElements = document.querySelectorAll(revealSelectors);

    // Prepare skill bars for animation
    revealElements.forEach((el) => {
      if (el.classList.contains('skill-item')) {
        const bar = el.querySelector('.skill-level');
        if (bar && !bar.dataset.level) {
          bar.dataset.level = bar.style.width;
          bar.style.width = '0';
        }
      }
      el.classList.add('hidden');
    });

    const io = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('visible');
            el.classList.remove('hidden');

            // Animate skill bar
            if (el.classList.contains('skill-item')) {
              const bar = el.querySelector('.skill-level');
              if (bar && bar.dataset.level) {
                setTimeout(() => {
                  bar.style.width = bar.dataset.level;
                }, 100);
              }
            }

            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.2 }
    );

    revealElements.forEach((el) => io.observe(el));

    /* -------------------------------------------------- */
    /* Timeline item slide-in animation                   */
    /* -------------------------------------------------- */
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, idx) => {
      item.style.opacity = '0';
      item.style.transform = idx % 2 === 0 ? 'translateX(-60px)' : 'translateX(60px)';
      io.observe(item); // already handled above
    });

    /* -------------------------------------------------- */
    /* AJAX contact form with toast feedback              */
    /* -------------------------------------------------- */
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(contactForm);
        const name = fd.get('name').trim();
        const email = fd.get('email').trim();
        const message = fd.get('message').trim();

        if (!name || !email || !message) {
          showToast('Please complete all fields.', 'error');
          return;
        }

        try {
          // NOTE: Replace URL with actual endpoint or use Formspree.
          const resp = await fetch('https://formspree.io/f/mwkgbnvy', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: fd
          });

          if (resp.ok) {
            contactForm.reset();
            showToast('Message sent successfully!', 'success');
          } else {
            showToast('Failed to send. Try again later.', 'error');
          }
        } catch (err) {
          showToast('Network error. Check your connection.', 'error');
        }
      });
    }

    /* -------------------------------------------------- */
    /* Toast helper                                       */
    /* -------------------------------------------------- */
    function showToast(msg, type = 'info') {
      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.textContent = msg;
      document.body.appendChild(toast);
      // Trigger animation
      requestAnimationFrame(() => toast.classList.add('show'));
      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
      }, 4000);
    }

    /* -------------------------------------------------- */
    /* Enhanced Timeline Animation and Scroll Effects     */
    /* -------------------------------------------------- */
    const allTimelineItems = document.querySelectorAll('.timeline-item');
    const timelineSection = document.querySelector('.timeline-section');
    
    // Enhanced intersection observer for timeline animations
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          
          // Add stagger effect for timeline items
          const timelineItems = entry.target.querySelectorAll('.timeline-item');
          timelineItems.forEach((item, index) => {
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, index * 200);
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    
    if (timelineSection) {
      timelineObserver.observe(timelineSection);
    }
    
    // Enhanced smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Timeline content hover effects enhancement
    allTimelineItems.forEach(item => {
      const content = item.querySelector('.timeline-content');
      if (content) {
        content.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-8px) scale(1.02)';
          this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        content.addEventListener('mouseleave', function() {
          this.style.transform = '';
          this.style.boxShadow = '';
        });
      }
    });
    
    // Scroll progress indicator for timeline
    const createScrollProgress = () => {
      const progressBar = document.createElement('div');
      progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4e54c8, #8f94fb);
        z-index: 9999;
        transition: width 0.1s ease;
      `;
      document.body.appendChild(progressBar);
      
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrollPercent + '%';
      });
    };
    
    createScrollProgress();

    /* -------------------------------------------------- */
    /* Experience view toggle + expand/collapse           */
    /* -------------------------------------------------- */
    (function initExperienceUI() {
      const section = document.querySelector('.timeline-section');
      const toggleContainer = document.querySelector('.view-toggle');
      
      // View toggle (Timeline <-> List)
      if (section && toggleContainer) {
        const buttons = toggleContainer.querySelectorAll('.toggle-btn');
        const applyView = (view) => {
          if (view === 'list') section.classList.add('list-view');
          else section.classList.remove('list-view');
          localStorage.setItem('experienceView', view);
          buttons.forEach(btn => {
            const isActive = btn.dataset.view === view;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
          });
        };
        
        buttons.forEach(btn => {
          btn.addEventListener('click', () => applyView(btn.dataset.view));
        });
        
        // Restore saved preference (default to list)
        const saved = localStorage.getItem('experienceView');
        applyView(saved || 'list');
      }
      
      // Expand/collapse long bullet lists
      const lists = document.querySelectorAll('.timeline-content .experience-list');
      lists.forEach(list => {
        const items = Array.from(list.children).filter(el => el.tagName.toLowerCase() === 'li');
        if (items.length > 2 && !list.classList.contains('no-collapse')) {
          list.classList.add('collapsed');
          const btn = document.createElement('button');
          btn.className = 'expand-btn';
          btn.type = 'button';
          btn.textContent = 'Show more';
          btn.setAttribute('aria-expanded', 'false');
          list.after(btn);
          btn.addEventListener('click', () => {
            const isCollapsed = list.classList.toggle('collapsed');
            btn.textContent = isCollapsed ? 'Show more' : 'Show less';
            btn.setAttribute('aria-expanded', String(!isCollapsed));
          });
        }
      });
    })();

    /* -------------------------------------------------- */
    /* Deprecate old scroll-to-top anchor if present      */
    /* -------------------------------------------------- */
    const oldBtn = document.getElementById('scrollToTop');
    if (oldBtn) oldBtn.style.display = 'none';
  });
})();

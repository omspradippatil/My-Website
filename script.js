// Initialize particles.js for entire website background - WHITE PARTICLES
function initFullSiteParticles() {
    particlesJS("particles-js-full", {
        particles: {
            number: { 
                value: 100, 
                density: { 
                    enable: true, 
                    value_area: 800 
                } 
            },
            color: { 
                value: "#ffffff"
            },
            shape: { 
                type: "circle"
            },
            opacity: { 
                value: 0.6, 
                random: true, 
                anim: { 
                    enable: true, 
                    speed: 1, 
                    opacity_min: 0.2, 
                    sync: false 
                } 
            },
            size: { 
                value: 3, 
                random: true, 
                anim: { 
                    enable: true, 
                    speed: 2, 
                    size_min: 0.1, 
                    sync: false 
                } 
            },
            line_linked: { 
                enable: true, 
                distance: 150, 
                color: "#ffffff", 
                opacity: 0.5, 
                width: 1 
            },
            move: { 
                enable: true, 
                speed: 2, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "out", 
                bounce: false,
                attract: { 
                    enable: false, 
                    rotateX: 600, 
                    rotateY: 1200 
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { 
                    enable: true, 
                    mode: "grab" 
                },
                onclick: { 
                    enable: true, 
                    mode: "push" 
                },
                resize: true
            },
            modes: {
                grab: { 
                    distance: 140, 
                    line_linked: { 
                        opacity: 1 
                    } 
                },
                push: { 
                    particles_nb: 4 
                }
            }
        },
        retina_detect: true
    });
}

// Initialize particles.js for header only
function initParticles() {
    particlesJS("particles-js", {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.2, sync: false } },
            size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
            line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.5, width: 1 },
            move: { 
                enable: true, 
                speed: 2, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "out", 
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 1 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// Initialize GSAP animations - Fast 1 second animations
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // Header content animation - 1 second
    gsap.to("header .content", {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
    });
    
    // Section animations with ScrollTrigger - 1 second
    gsap.utils.toArray("section").forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 30 }, 
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });
    
    // Nav links stagger animation - faster
    gsap.from("nav a", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out",
        delay: 0.3
    });
    
    // Skills animation - 1 second
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        
        gsap.fromTo(bar, 
            { width: 0 }, 
            {
                width: progress + "%",
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: bar,
                    start: "top 90%",
                    toggleActions: "play none none reset"
                }
            }
        );
    });
    
    // Contact items animation - faster stagger
    gsap.utils.toArray(".contact-item").forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, y: 20, scale: 0.95 },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                delay: i * 0.08,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: "#contact",
                    start: "top 75%"
                }
            }
        );
    });
    
    // Button hover animations - quick response
    const buttons = document.querySelectorAll('.button, .btn-modern');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            gsap.to(button, { scale: 1.05, duration: 0.2, ease: "power2.out" });
        });
        
        button.addEventListener('mouseleave', (e) => {
            gsap.to(button, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
        
        // Magnetic effect - faster
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.2,
                ease: "power2.out"
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, { x: 0, y: 0, duration: 0.3, ease: "elastic.out(1, 0.5)" });
        });
    });
    
    // Social links animation - faster
    gsap.utils.toArray(".social-link").forEach((link, i) => {
        gsap.from(link, {
            opacity: 0,
            scale: 0,
            duration: 0.4,
            delay: i * 0.05,
            ease: "back.out(1.5)",
            scrollTrigger: {
                trigger: "footer",
                start: "top 90%"
            }
        });
    });
}

// Handle scroll progress bar
function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
}

// Dark mode toggle with faster animations
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    const icon = toggle.querySelector('i');
    const body = document.body;
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else if (savedTheme === 'light') {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
    
    // Toggle theme on click with faster animation
    toggle.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
            
            gsap.to("body", { 
                backgroundColor: "#0f172a", 
                duration: 0.3, 
                ease: "power2.inOut" 
            });
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
            
            gsap.to("body", { 
                backgroundColor: "#667eea", 
                duration: 0.3, 
                ease: "power2.inOut" 
            });
        }
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                body.classList.add('dark-mode');
                body.classList.remove('light-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}

// Enhanced modal functionality - faster animations
function setupModal() {
    const cvButton = document.getElementById('cvButton');
    const modal = document.getElementById('cvModal');
    const closeBtn = document.getElementById('closeModal');
    
    cvButton.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'flex';
        gsap.to(modal, { opacity: 1, duration: 0.2 });
        gsap.fromTo('.modal-content', 
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.5)" }
        );
    });
    
    const closeModal = () => {
        gsap.to('.modal-content', { 
            scale: 0.9, 
            opacity: 0, 
            duration: 0.2, 
            ease: "power2.in" 
        });
        gsap.to(modal, { 
            opacity: 0, 
            duration: 0.2,
            onComplete: () => { modal.style.display = 'none'; }
        });
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
}

// Smooth scrolling for anchor links - FIXED
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Add nav scroll effect
function handleNavScroll() {
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// Enhanced animations for mobile
function initMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce particle count on mobile for full site
        if (typeof particlesJS !== 'undefined') {
            particlesJS("particles-js-full", {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 1.5, direction: "none", random: true, out_mode: "out" }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: false },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                },
                retina_detect: true
            });
            
            // Header particles for mobile
            particlesJS("particles-js", {
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: "#ffffff" },
                    shape: { type: "circle" },
                    opacity: { value: 0.5, random: true },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.3, width: 1 },
                    move: { enable: true, speed: 1.5, direction: "none", random: true, out_mode: "out" }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: { enable: false },
                        onclick: { enable: true, mode: "push" },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }
}

// Add ripple effect to buttons
function addRippleEffect() {
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    const buttons = document.querySelectorAll('.button, .btn-modern, .social-link');
    
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

// Add parallax effect to header
function addParallaxEffect() {
    const header = document.querySelector('header');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallax = scrolled * 0.5;
                header.style.transform = `translateY(${parallax}px)`;
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add floating animation to contact icons - faster
function addFloatingAnimation() {
    const icons = document.querySelectorAll('.contact-icon');
    icons.forEach((icon, index) => {
        gsap.to(icon, {
            y: -8,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
            delay: index * 0.15
        });
    });
}

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
}

// Add cursor trail effect (optional - for desktop)
function addCursorTrail() {
    if (window.innerWidth > 768) {
        const coords = { x: 0, y: 0 };
        const circles = document.querySelectorAll('.circle');
        
        if (circles.length === 0) {
            // Create cursor trail circles
            for (let i = 0; i < 20; i++) {
                const circle = document.createElement('div');
                circle.className = 'circle';
                circle.style.cssText = `
                    position: fixed;
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--accent));
                    pointer-events: none;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s;
                `;
                document.body.appendChild(circle);
            }
        }
        
        const allCircles = document.querySelectorAll('.circle');
        
        allCircles.forEach((circle, index) => {
            circle.x = 0;
            circle.y = 0;
        });
        
        window.addEventListener('mousemove', (e) => {
            coords.x = e.clientX;
            coords.y = e.clientY;
        });
        
        function animateCircles() {
            let x = coords.x;
            let y = coords.y;
            
            allCircles.forEach((circle, index) => {
                circle.style.left = x - 5 + 'px';
                circle.style.top = y - 5 + 'px';
                circle.style.opacity = (20 - index) / 20;
                circle.style.transform = `scale(${(20 - index) / 20})`;
                
                circle.x = x;
                circle.y = y;
                
                const nextCircle = allCircles[index + 1] || allCircles[0];
                x += (nextCircle.x - x) * 0.3;
                y += (nextCircle.y - y) * 0.3;
            });
            
            requestAnimationFrame(animateCircles);
        }
        
        animateCircles();
    }
}

// Add active section highlighting in nav
function addActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize full site particles first
    initFullSiteParticles();
    
    // Initialize header particles
    initParticles();
    
    // Initialize animations
    initAnimations();
    
    // Setup other functionality
    setupThemeToggle();
    setupModal();
    setupSmoothScroll();
    handleNavScroll();
    initMobileOptimizations();
    addRippleEffect();
    addParallaxEffect();
    addActiveNavHighlight();
    
    // Add floating animation after sections are visible - faster
    setTimeout(addFloatingAnimation, 100);
    
    // Lazy load images
    lazyLoadImages();
    
    // Add scroll event listeners
    window.addEventListener('scroll', updateProgressBar);
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initMobileOptimizations();
        }, 250);
    });
    
    // Preload images for better performance
    const images = document.querySelectorAll('img:not([data-src])');
    images.forEach(img => {
        if (img.src) {
            const newImg = new Image();
            newImg.src = img.src;
        }
    });
    
    // Add loading animation - faster
    gsap.to('body', {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
    });
    
    // Console message for developers
    console.log('%c👋 Welcome to my portfolio!', 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%c💼 Interested in working together? Let\'s connect!', 'color: #764ba2; font-size: 14px;');
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is not visible
        gsap.globalTimeline.pause();
    } else {
        // Resume animations when tab becomes visible
        gsap.globalTimeline.resume();
    }
});

// Service Worker registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

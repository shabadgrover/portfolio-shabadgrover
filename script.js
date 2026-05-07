document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    /* --- Typewriter Effect --- */
    const typingRole = document.getElementById('typing-role');
    const roles = ["Computer Science Undergrad", "Aspiring Data Analyst", "Driven ML Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingRole.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingRole.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    if (typingRole) type();

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* --- Mobile Menu Toggle --- */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });



    /* --- Scroll Reveal Animations --- */
    const revealElements = document.querySelectorAll('.revealing');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // If the element has a specific index or is part of a list (like timeline, skills, projects)
                // we can add a small CSS sequence delay
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1, // Trigger slightly earlier for smoother feel
        rootMargin: "0px 0px -80px 0px"
    });

    // Add staggered delays dynamically to grid items
    const sectionsWithGrids = document.querySelectorAll('.skills-grid, .projects-grid, .timeline');
    sectionsWithGrids.forEach(container => {
        const revealingChildren = container.querySelectorAll('.revealing');
        revealingChildren.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.15}s`;
        });
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* --- Project Filtering --- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // small timeout to allow display:block to apply before animating opacity
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300); // match timeout with css transition
                }
            });
        });
    });

    /* --- Active Navigation Link Update on Scroll --- */
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    /* --- Smooth Scroll for Buttons --- */
    const viewWorkBtn = document.querySelector('a[href="#projects"]');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    /* --- Projects Toggle (See More/Less) --- */
    const seeMoreBtn = document.getElementById('see-more-btn');
    const seeLessBtn = document.getElementById('see-less-btn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');

    if (seeMoreBtn && seeLessBtn) {
        seeMoreBtn.addEventListener('click', () => {
            hiddenProjects.forEach(project => {
                project.style.display = 'block';
                setTimeout(() => project.classList.add('active'), 10);
            });
            seeMoreBtn.style.display = 'none';
            seeLessBtn.style.display = 'flex';
        });

        seeLessBtn.addEventListener('click', () => {
            hiddenProjects.forEach(project => {
                project.style.display = 'none';
                project.classList.remove('active');
            });
            seeLessBtn.style.display = 'none';
            seeMoreBtn.style.display = 'flex';

            // Scroll back to projects section
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* --- New Contact Logic (GSAP & EmailJS) --- */

    // 1. GSAP Entrance Animation
    if (window.gsap && window.ScrollTrigger) {
        gsap.from("#contact-hub", {
            y: 60,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: "#contact-hub",
                start: "top 85%",
            }
        });

        // 2. Magnetic Buttons
        const magneticBtns = document.querySelectorAll('.social-magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.4,
                    y: y * 0.4,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // 3. EmailJS Submission
    const SERVICE_ID = "service_gnso5ld";
    const TEMPLATE_ID = "template_lzg67tr";
    const PUBLIC_KEY = "TFYV4mBQPN8ougjvm";

    if (window.emailjs) {
        window.emailjs.init({ publicKey: PUBLIC_KEY });
    }

    const newContactForm = document.getElementById('contact-form-new');
    if (newContactForm) {
        newContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById('contact-submit');
            const btnText = submitBtn.querySelector('.btn-text');
            const statusContainer = document.getElementById('status-container');
            const successEl = document.getElementById('status-success');
            const errorEl = document.getElementById('status-error');

            const originalText = btnText.textContent;

            // Loading state
            btnText.textContent = "Transmitting...";
            submitBtn.disabled = true;

            const formData = {
                from_name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                title: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value,
            };

            try {
                await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);

                // Success
                btnText.textContent = "Success!";
                successEl.classList.remove('hidden');
                errorEl.classList.add('hidden');
                statusContainer.classList.add('show');

                newContactForm.reset();

                setTimeout(() => {
                    statusContainer.classList.remove('show');
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }, 4000);

            } catch (err) {
                console.error("EmailJS Error:", err);

                // Error
                btnText.textContent = "Failed";
                errorEl.classList.remove('hidden');
                successEl.classList.add('hidden');
                statusContainer.classList.add('show');

                setTimeout(() => {
                    statusContainer.classList.remove('show');
                    btnText.textContent = originalText;
                    submitBtn.disabled = false;
                }, 4000);
            }
        });
    }

    /* --- Canvas Starfield Animation --- */
    const initStarfield = () => {
        const canvas = document.getElementById('starfield');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let mouse = { x: -9999, y: -9999 };
        const REPULSE_RADIUS = 130;
        const REPULSE_STRENGTH = 3.5;
        const STAR_COUNT = 240;
        const starColors = ['rgba(255,255,255,', 'rgba(0,210,190,', 'rgba(180,240,235,'];

        class Star {
            constructor() { this.reset(true); }

            reset(randomY = false) {
                this.x = Math.random() * canvas.width;
                this.y = randomY ? Math.random() * canvas.height : canvas.height + Math.random() * 20;
                this.size = Math.random() * 1.8 + 0.3;
                this.speed = Math.random() * 0.45 + 0.15;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.twinkleSpeed = Math.random() * 0.008 + 0.003;
                this.twinkleOffset = Math.random() * Math.PI * 2;
                this.color = starColors[Math.floor(Math.random() * starColors.length)];
                this.vx = 0;
                this.vy = 0;
            }

            update(time) {
                const twinkle = Math.sin(time * this.twinkleSpeed * 1000 + this.twinkleOffset);
                this.currentOpacity = Math.max(0, Math.min(1, this.opacity + twinkle * 0.15));

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < REPULSE_RADIUS && dist > 0) {
                    const force = (REPULSE_RADIUS - dist) / REPULSE_RADIUS;
                    this.vx += (dx / dist) * force * REPULSE_STRENGTH;
                    this.vy += (dy / dist) * force * REPULSE_STRENGTH;
                }

                this.vx *= 0.88;
                this.vy *= 0.88;
                this.x += this.vx;
                this.y -= this.speed + Math.max(0, -this.vy);

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < -5) this.reset(false);
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${this.currentOpacity})`;
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        const stars = Array.from({ length: STAR_COUNT }, () => new Star());

        const animate = (time) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(s => { s.update(time); s.draw(); });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };

    initStarfield();

});

document.addEventListener('DOMContentLoaded', () => {

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

    /* --- Contact Form Handling (EmailJS) --- */
    // Initialize EmailJS (Replace 'YOUR_PUBLIC_KEY' with your actual key from EmailJS dashboard)
    (function() {
        emailjs.init({
          publicKey: "YOUR_PUBLIC_KEY",
        });
    })();

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;
            
            // Collect Form Data
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Send via EmailJS (Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs)
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
                .then(() => {
                    // Success state
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.backgroundColor = '#27c93f';
                    submitBtn.style.borderColor = '#27c93f';
                    
                    // Reset form
                    const senderName = document.getElementById('name').value;
                    contactForm.reset();

                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'form-success-msg';
                    successMsg.innerHTML = `
                        <div style="margin-top: 20px; padding: 15px; background: rgba(39, 201, 63, 0.1); border: 1px solid #27c93f; border-radius: 8px; text-align: center; animation: fadeIn 0.5s ease forwards;">
                            <h4 style="color: #27c93f; margin-bottom: 5px;">Thank you, ${senderName || 'there'}!</h4>
                            <p style="font-size: 0.9rem;">Your message has been sent successfully. I'll get back to you soon.</p>
                        </div>
                    `;
                    contactForm.appendChild(successMsg);

                    // Revert button after 4 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.borderColor = '';
                        submitBtn.disabled = false;
                        if (successMsg) successMsg.remove();
                    }, 4000);
                }, (error) => {
                    console.error('FAILED...', error);
                    submitBtn.innerHTML = '<i class="fas fa-times"></i> Error Sending';
                    submitBtn.style.backgroundColor = '#ff5f56';
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                    }, 3000);
                });
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

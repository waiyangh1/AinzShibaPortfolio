/*===== MENU SHOW =====*/
const showMenu = (toggleId, navId) => {
    const toggle = document.getElementById(toggleId),
        nav = document.getElementById(navId)

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('show')
            // Change icon
            const icon = toggle.querySelector('i')
            if (nav.classList.contains('show')) {
                icon.classList.remove('bx-menu')
                icon.classList.add('bx-x')
            } else {
                icon.classList.remove('bx-x')
                icon.classList.add('bx-menu')
            }
        })
    }
}
showMenu('nav-toggle', 'nav-menu')

/*===== REMOVE MENU MOBILE =====*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    const toggle = document.getElementById('nav-toggle')
    const icon = toggle.querySelector('i')

    navMenu.classList.remove('show')
    icon.classList.remove('bx-x')
    icon.classList.add('bx-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*===== SCROLL SECTIONS ACTIVE LINK =====*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () => {
    const scrollDown = window.scrollY
    const headerHeight = document.querySelector('.l-header').offsetHeight

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - headerHeight - 100,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            if (sectionsClass) {
                sectionsClass.classList.add('active-link')
            }
        } else {
            if (sectionsClass) {
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1000,
    delay: 200,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    reset: false
});

// Hero content
sr.reveal('.hero__data', {
    delay: 300,
    origin: 'bottom'
});

// Devlog section
sr.reveal('.devlog__main', {
    delay: 200,
    origin: 'bottom',
    distance: '50px'
});

// Projects
sr.reveal('.project-card', {
    interval: 200,
    origin: 'bottom',
    distance: '50px'
});

// Skills
sr.reveal('.skill-category', {
    interval: 150,
    origin: 'bottom',
    distance: '40px'
});

sr.reveal('.skills__philosophy', {
    delay: 300,
    origin: 'bottom',
    distance: '50px'
});

// About section
sr.reveal('.about__intro', {
    origin: 'left',
    distance: '80px'
});

sr.reveal('.about__approach', {
    origin: 'left',
    distance: '80px',
    delay: 200
});

sr.reveal('.about__current', {
    origin: 'left',
    distance: '80px',
    delay: 400
});

sr.reveal('.about__links', {
    origin: 'right',
    distance: '80px'
});

// Contact form
sr.reveal('.contact__info', {
    origin: 'left',
    distance: '80px'
});

sr.reveal('.contact__form', {
    origin: 'right',
    distance: '80px',
    delay: 200
});

/*===== 3D CAROUSEL =====*/
function init3DCarousel() {
    const carousel = document.querySelector('.carousel-3d');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-btn--prev');
    const nextBtn = document.querySelector('.carousel-btn--next');
    const dots = document.querySelectorAll('.carousel-dot');
    const watchGameplayBtns = document.querySelectorAll('.watch-gameplay-btn');

    if (!carousel || carouselItems.length === 0) return;

    let currentIndex = 0;
    const totalItems = carouselItems.length;

    // Initialize carousel positions
    updateCarousel();

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
            updateDots();
            playNavSound();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
            updateDots();
            playNavSound();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            if (currentIndex !== index) {
                currentIndex = index;
                updateCarousel();
                updateDots();
                playNavSound();
            }
        });
    });

    // Watch Gameplay button functionality
    watchGameplayBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const videoUrl = this.getAttribute('data-video');

            // Create video modal
            const videoModal = document.createElement('div');
            videoModal.className = 'video-modal';
            videoModal.innerHTML = `
                <div class="video-modal__content">
                    <span class="video-modal__close">&times;</span>
                    <video controls autoplay style="width: 100%; max-height: 80vh;">
                        <source src="${videoUrl}" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <p class="video-caption">Gameplay demonstration - Video will play once</p>
                </div>
            `;

            document.body.appendChild(videoModal);
            document.body.style.overflow = 'hidden';

            // Close modal functionality
            const closeBtn = videoModal.querySelector('.video-modal__close');
            closeBtn.addEventListener('click', () => {
                const video = videoModal.querySelector('video');
                video.pause();
                document.body.removeChild(videoModal);
                document.body.style.overflow = 'auto';
            });

            videoModal.addEventListener('click', (e) => {
                if (e.target === videoModal) {
                    const video = videoModal.querySelector('video');
                    video.pause();
                    document.body.removeChild(videoModal);
                    document.body.style.overflow = 'auto';
                }
            });

            // Remove modal when video ends
            const video = videoModal.querySelector('video');
            video.addEventListener('ended', () => {
                setTimeout(() => {
                    videoModal.style.opacity = '0';
                    setTimeout(() => {
                        if (videoModal.parentNode) {
                            document.body.removeChild(videoModal);
                            document.body.style.overflow = 'auto';
                        }
                    }, 300);
                }, 1000);
            });
        });
    });

    function updateCarousel() {
        carouselItems.forEach((item, index) => {
            // Remove all classes
            item.classList.remove('active', 'prev', 'next', 'hidden', 'hidden-right');

            // Calculate relative position
            let position = (index - currentIndex + totalItems) % totalItems;

            // Assign classes based on position
            if (position === 0) {
                item.classList.add('active');
            } else if (position === 1) {
                item.classList.add('next');
            } else if (position === totalItems - 1) {
                item.classList.add('prev');
            } else if (position === 2) {
                item.classList.add('hidden-right');
            } else if (position === totalItems - 2) {
                item.classList.add('hidden');
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0.2';
            }
        });
    }

    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function playNavSound() {
        // Optional: Add a subtle navigation sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 440;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported or user blocked it
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
            updateDots();
            playNavSound();
        } else if (e.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
            updateDots();
            playNavSound();
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                currentIndex = (currentIndex + 1) % totalItems;
            } else {
                // Swipe right - previous
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            }
            updateCarousel();
            updateDots();
            playNavSound();
        }
    }

    // Auto-rotate carousel (pauses on hover)
    let autoRotateInterval = null;

    function startAutoRotate() {
        autoRotateInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
            updateDots();
        }, 5000); // Rotate every 5 seconds
    }

    function stopAutoRotate() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }

    // Start auto-rotate
    startAutoRotate();

    // Pause auto-rotate on hover
    carousel.addEventListener('mouseenter', stopAutoRotate);
    carousel.addEventListener('touchstart', stopAutoRotate);

    // Resume auto-rotate when not interacting
    carousel.addEventListener('mouseleave', () => {
        if (!autoRotateInterval) {
            startAutoRotate();
        }
    });

    // Card click to navigate
    carouselItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            if (!item.classList.contains('active')) {
                currentIndex = index;
                updateCarousel();
                updateDots();
                playNavSound();
            }
        });
    });

    // Initialize
    updateDots();

    // Adjust carousel positioning for better visibility
    setTimeout(() => {
        adjustCarouselSpacing();
    }, 100);
}

function adjustCarouselSpacing() {
    // Ensure carousel has proper spacing
    const container = document.querySelector('.carousel-3d-container');
    const activeCard = document.querySelector('.carousel-item.active');

    if (container && activeCard) {
        const cardHeight = activeCard.offsetHeight;
        container.style.minHeight = cardHeight + 100 + 'px';
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D carousel
    init3DCarousel();

    // Adjust on window resize
    window.addEventListener('resize', () => {
        setTimeout(adjustCarouselSpacing, 100);
    });

    // Remove scroll arrow
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.style.display = 'none';
    }
});

/*===== PARALLAX EFFECT =====*/
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

/*===== FORM SUBMISSION =====*/
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const subject = contactForm.querySelector('#subject').value;
        const message = contactForm.querySelector('#message').value;
        const checkbox = contactForm.querySelector('input[type="checkbox"]').checked;

        // Simple validation
        if (!name || !email || !subject || !message || !checkbox) {
            alert('Please fill in all required fields and accept the terms');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="bx bx-loader-circle bx-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate API call (replace with real API endpoint)
        setTimeout(() => {
            alert('Thank you for your message! I\'ll get back to you within 24 hours.');
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

/*===== LAZY LOAD IMAGES =====*/
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // Load the image
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
                imageObserver.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    lazyImages.forEach(img => imageObserver.observe(img));
});

/*===== SMOOTH SCROLL FOR ANCHOR LINKS =====*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerHeight = document.querySelector('.l-header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*===== COPYRIGHT YEAR UPDATE =====*/
const currentYear = new Date().getFullYear();
const yearElement = document.querySelector('.footer__copy');
if (yearElement) {
    yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
}

/*===== GLITCH EFFECT ON HOVER =====*/
document.addEventListener('DOMContentLoaded', function () {
    const glitchTitles = document.querySelectorAll('.section-title--glitch');

    glitchTitles.forEach(title => {
        title.addEventListener('mouseenter', () => {
            title.classList.add('glitch-active');
            setTimeout(() => {
                title.classList.remove('glitch-active');
            }, 500);
        });
    });

    // Stats counter animation
    const stats = document.querySelectorAll('.stat h3');
    const statValues = [5, 16, 4, 1];
    const statSuffixes = ['+', 'ms', '+', '+'];

    if (stats.length === 4) {
        stats.forEach((stat, index) => {
            const targetValue = statValues[index];
            const suffix = statSuffixes[index];

            let currentValue = 0;
            const increment = targetValue / 50;

            const updateCounter = () => {
                if (currentValue < targetValue) {
                    currentValue += increment;
                    stat.textContent = Math.floor(currentValue) + suffix;
                    setTimeout(updateCounter, 30);
                } else {
                    stat.textContent = targetValue + suffix;
                }
            };

            // Start counter when in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(stat);
                }
            }, { threshold: 0.5 });

            observer.observe(stat);
        });
    }
});

/*===== PROJECT CARD HOVER EFFECTS =====*/
document.addEventListener('DOMContentLoaded', function () {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 255, 0.5)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
    });

    // Status badge color effects
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function () {
            if (this.classList.contains('status--completed')) {
                this.style.boxShadow = '0 0 15px rgba(0, 255, 100, 0.7)';
            } else if (this.classList.contains('status--prototype')) {
                this.style.boxShadow = '0 0 15px rgba(255, 200, 0, 0.7)';
            }
        });

        badge.addEventListener('mouseleave', function () {
            this.style.boxShadow = 'none';
        });
    });

    // Project tag hover effects
    const projectTags = document.querySelectorAll('.project-tag');
    projectTags.forEach(tag => {
        tag.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        tag.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // System item hover effects
    const systemItems = document.querySelectorAll('.system-item-highlight');
    systemItems.forEach(item => {
        item.addEventListener('mouseenter', function () {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 255, 255, 0.3)';
        });

        item.addEventListener('mouseleave', function () {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });

    // Team member hover effects
    const teamMembers = document.querySelectorAll('.team-member-highlight');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(255, 0, 150, 0.08)';
        });

        member.addEventListener('mouseleave', function () {
            this.style.backgroundColor = '';
        });
    });
});

/*===== FORM VALIDATION =====*/
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/*===== PAGE LOAD ANIMATION =====*/
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class for animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // GIF Gallery Modal functionality
    const gifLinks = document.querySelectorAll('.gif-gallery-link');

    gifLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Get project name from the nearest project card
            const projectCard = this.closest('.project-card') || this.closest('.devlog__main');
            let projectName = 'Gameplay Showcase';

            if (projectCard) {
                const titleElement = projectCard.querySelector('.project-card__title') ||
                    projectCard.querySelector('.devlog__title');
                if (titleElement) {
                    projectName = titleElement.textContent;
                }
            }

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'gif-modal';
            modal.style.display = 'flex';

            // Determine which GIF to show based on the project
            let gifSrc = 'assets/gifs/racing-mechanics-breakdown.gif';
            if (this.href.includes('neon-drift')) {
                gifSrc = 'assets/gifs/neon-drift-gameplay.gif';
            } else if (this.href.includes('combat-system')) {
                gifSrc = 'assets/gifs/combat-system-demo.gif';
            } else if (this.href.includes('ui-system')) {
                gifSrc = 'assets/gifs/ui-system-demo.gif';
            }

            modal.innerHTML = `
                <div class="gif-modal__content">
                    <span class="gif-modal__close">&times;</span>
                    <h3 class="gif-modal__title">${projectName} - Gameplay Showcase</h3>
                    <div class="gif-modal__gallery">
                        <img src="${gifSrc}" alt="${projectName} Gameplay">
                        <img src="assets/gifs/gameplay-details.gif" alt="Additional Gameplay Details">
                        <img src="assets/gifs/mechanics-breakdown.gif" alt="Mechanics Breakdown">
                    </div>
                    <p class="video-caption">Click on GIFs to view larger versions. All gameplay systems are fully interactive.</p>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Close modal functionality
            const closeBtn = modal.querySelector('.gif-modal__close');
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.removeChild(modal);
                document.body.style.overflow = 'auto';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.removeChild(modal);
                    document.body.style.overflow = 'auto';
                }
            });

            // Add click to enlarge for GIFs
            const gifImages = modal.querySelectorAll('.gif-modal__gallery img');
            gifImages.forEach(img => {
                img.addEventListener('click', () => {
                    img.style.transform = img.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)';
                    img.style.transition = 'transform 0.3s ease';
                });
            });
        });
    });
});

/*===== VIDEO PLAYBACK CONTROLS =====*/
document.addEventListener('DOMContentLoaded', function () {
    const videoLinks = document.querySelectorAll('a[href$=".mp4"], a[href$=".webm"]');

    videoLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            if (!this.getAttribute('target')) {
                e.preventDefault();

                // Create video modal
                const videoModal = document.createElement('div');
                videoModal.className = 'video-modal';
                videoModal.innerHTML = `
                    <div class="video-modal__content">
                        <span class="video-modal__close">&times;</span>
                        <video controls autoplay style="width: 100%; max-height: 80vh;">
                            <source src="${this.href}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <p class="video-caption">${this.textContent || 'Gameplay demonstration'}</p>
                    </div>
                `;

                document.body.appendChild(videoModal);
                document.body.style.overflow = 'hidden';

                // Close modal functionality
                const closeBtn = videoModal.querySelector('.video-modal__close');
                closeBtn.addEventListener('click', () => {
                    const video = videoModal.querySelector('video');
                    video.pause();
                    document.body.removeChild(videoModal);
                    document.body.style.overflow = 'auto';
                });

                videoModal.addEventListener('click', (e) => {
                    if (e.target === videoModal) {
                        const video = videoModal.querySelector('video');
                        video.pause();
                        document.body.removeChild(videoModal);
                        document.body.style.overflow = 'auto';
                    }
                });
            }
        });
    });
});

/*===== ANIMATE SYSTEM ITEMS ON SCROLL =====*/
document.addEventListener('DOMContentLoaded', function () {
    const systemItems = document.querySelectorAll('.system-item-highlight');

    const systemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    systemItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        systemObserver.observe(item);
    });
});

/*===== TEAM MEMBERS ANIMATION =====*/
document.addEventListener('DOMContentLoaded', function () {
    const teamMembers = document.querySelectorAll('.team-member-highlight');

    const teamObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.2 });

    teamMembers.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        teamObserver.observe(member);
    });
});

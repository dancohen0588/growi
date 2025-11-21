/* =============================================
   GROWI - Page d'accueil JavaScript
   Animations au scroll et interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================================
    // INTERSECTION OBSERVER POUR LES ANIMATIONS
    // =============================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Éléments à animer au scroll
    const elementsToAnimate = document.querySelectorAll(
        '.step-card, .feature-card, .testimonial-card, .pro-feature, .hero-content, .preview-text, .section-title'
    );
    
    elementsToAnimate.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
    
    
    // =============================================
    // MENU MOBILE
    // =============================================
    
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    let isMenuOpen = false;
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            
            // Animation du burger
            const spans = mobileToggle.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'rotate(0) translate(0, 0)';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'rotate(0) translate(0, 0)';
            }
            
            // Affichage du menu
            if (isMenuOpen) {
                navMenu.style.display = 'flex';
                navMenu.style.flexDirection = 'column';
                navMenu.style.position = 'absolute';
                navMenu.style.top = '70px';
                navMenu.style.left = '0';
                navMenu.style.right = '0';
                navMenu.style.background = 'rgba(255, 255, 255, 0.98)';
                navMenu.style.padding = '20px';
                navMenu.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
                navMenu.style.borderRadius = '0 0 12px 12px';
                navMenu.style.gap = '15px';
            } else {
                navMenu.style.display = 'none';
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    mobileToggle.click();
                }
            });
        });
    }
    
    
    // =============================================
    // SMOOTH SCROLL POUR LES ANCRES
    // =============================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Compenser le header fixe
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // =============================================
    // EFFET PARALLAXE LÉGER SUR LE HERO
    // =============================================
    
    const heroBackground = document.querySelector('.hero-background');
    const phoneImage = document.querySelector('.phone-mockup');
    
    if (heroBackground || phoneImage) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            const ratePhone = scrolled * 0.1;
            
            if (heroBackground) {
                heroBackground.style.transform = `translate3d(0, ${rate}px, 0)`;
            }
            
            if (phoneImage && scrolled < window.innerHeight) {
                phoneImage.style.transform = `translate3d(0, ${ratePhone}px, 0)`;
            }
        });
    }
    
    
    // =============================================
    // ANIMATION DES COMPTEURS (SI AJOUTÉS)
    // =============================================
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.innerHTML = current.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Observer pour les compteurs
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const endValue = parseInt(counter.getAttribute('data-count'));
                animateValue(counter, 0, endValue, 2000);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.7 });
    
    document.querySelectorAll('[data-count]').forEach(counter => {
        counterObserver.observe(counter);
    });
    
    
    // =============================================
    // GESTION DES BOUTONS CTA
    // =============================================
    
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Animation de clic
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            const buttonText = this.textContent.trim();
            
            // Actions selon le type de bouton
            if (buttonText.includes('Télécharger')) {
                // Logique pour téléchargement (à adapter selon les besoins)
                console.log('Redirection vers app store...');
                // window.open('https://apps.apple.com/...', '_blank');
            } else if (buttonText.includes('Essayer')) {
                // Logique pour essai gratuit
                console.log('Redirection vers inscription...');
                // window.open('/signup', '_blank');
            } else if (buttonText.includes('Pro')) {
                // Logique pour version Pro
                console.log('Redirection vers Growi Pro...');
                // window.open('/pro', '_blank');
            }
        });
        
        // Effet hover amélioré
        button.addEventListener('mouseenter', function() {
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 8px 25px rgba(180, 221, 127, 0.5)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (this.classList.contains('primary')) {
                this.style.boxShadow = '0 4px 15px rgba(180, 221, 127, 0.3)';
            }
        });
    });
    
    
    // =============================================
    // HEADER AVEC CHANGEMENT D'APPARENCE AU SCROLL
    // =============================================
    
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
            header.style.boxShadow = 'none';
        }
        
        // Auto-hide header en mobile lors du scroll down
        if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    
    // =============================================
    // LAZY LOADING DES IMAGES
    // =============================================
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    
    // =============================================
    // ANALYTICS ET TRACKING (placeholder)
    // =============================================
    
    function trackEvent(action, category, label) {
        // Intégration Google Analytics ou autre
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
    
    // Track des interactions importantes
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('click', 'CTA', this.textContent.trim());
        });
    });
    
    // Track du scroll jusqu'au footer
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('scroll', 'engagement', 'reached_footer');
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        footerObserver.observe(footer);
    }
    
    
    // =============================================
    // PRÉCHARGEMENT DES IMAGES IMPORTANTES
    // =============================================
    
    const criticalImages = [
        'https://images.unsplash.com/photo-1556075798-4825dfaaf498',
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    
    // =============================================
    // GESTION DES ERREURS
    // =============================================
    
    window.addEventListener('error', function(e) {
        console.error('Erreur JavaScript:', e.error);
        // Optionnel: envoyer l'erreur à un service de monitoring
    });
    
    
    // =============================================
    // OPTIMISATIONS PERFORMANCE
    // =============================================
    
    // Debounce pour les events de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Application du debounce sur le scroll
    const debouncedScroll = debounce(function() {
        // Logique de scroll optimisée si nécessaire
    }, 16); // ~60fps
    
    window.addEventListener('scroll', debouncedScroll);
    
    
    console.log('🌱 Growi website loaded successfully!');
});


// =============================================
// SERVICE WORKER POUR LA PERFORMANCE (optionnel)
// =============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
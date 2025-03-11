// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Пропускаем, если это не якорь
        if (targetId === '#') return;
        
        e.preventDefault();
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Закрываем мобильное меню при клике на пункт меню
            if (window.innerWidth <= 768 && nav.classList.contains('active')) {
                toggleMobileMenu();
            }
            
            // Плавно прокручиваем к целевому элементу
            const headerHeight = header.offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            window.scrollTo({
                top: targetPosition - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    });
});

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav ul li a');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const navDots = document.querySelectorAll('.nav-dot');
    
    // Переменные состояния
    let currentSlide = 0;
    const maxSlide = reviewCards.length - 1;
    const isMobile = window.innerWidth <= 768;
    
    // Функция переключения мобильного меню
    function toggleMobileMenu() {
        nav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        const icon = mobileMenuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    
    // Обработчик клика по кнопке мобильного меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            toggleMobileMenu();
        });
    }
    
    // Закрываем мобильное меню при клике по ссылке меню
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768 && nav.classList.contains('active')) {
                setTimeout(() => {
                    toggleMobileMenu();
                }, 50);
            }
        });
    });
    
    // Закрываем мобильное меню при клике вне меню
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768 && 
            nav.classList.contains('active') && 
            !nav.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            toggleMobileMenu();
        }
    });
    
    // Добавляем класс при прокрутке
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Функция обновления отображения слайдера отзывов
    function updateReviewsDisplay() {
        if (window.innerWidth <= 768) {
            // На мобильных - показываем только активный слайд
            reviewCards.forEach((card, index) => {
                if (index === currentSlide) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
            
            // Обновляем навигационные точки
            navDots.forEach((dot, index) => {
                if (index === currentSlide) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        } else {
            // На десктопе показываем все отзывы
            reviewCards.forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            });
        }
    }
    
    // Кнопка предыдущего слайда
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide === 0) {
                currentSlide = maxSlide;
            } else {
                currentSlide--;
            }
            updateReviewsDisplay();
        });
    }
    
    // Кнопка следующего слайда
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide === maxSlide) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateReviewsDisplay();
        });
    }
    
    // Клик по навигационным точкам
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateReviewsDisplay();
        });
    });
    
    // Функция проверки видимости элемента во viewport
    function isInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Анимация элементов при прокрутке
    const animateElements = () => {
        const elementsToAnimate = [
            ...document.querySelectorAll('.feature-card'),
            ...document.querySelectorAll('.review-card'),
            ...document.querySelectorAll('.hero-content'),
            ...document.querySelectorAll('.phone-mockup'),
            ...document.querySelectorAll('.extra-feature-item')
        ];
        
        elementsToAnimate.forEach((el, index) => {
            if (isInViewport(el)) {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, 100 * Math.min(index, 5)); // Ограничиваем задержку для большого количества элементов
            }
        });
    };
    
    // Обработка свайпов на тач-устройствах
    const setupTouchEvents = () => {
        const reviewsSlider = document.querySelector('.reviews-slider');
        
        if (!reviewsSlider) return;
        
        let startX, moveX;
        
        reviewsSlider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, {passive: true});
        
        reviewsSlider.addEventListener('touchmove', function(e) {
            moveX = e.touches[0].clientX;
        }, {passive: true});
        
        reviewsSlider.addEventListener('touchend', function() {
            if (!moveX) return;
            
            const diff = startX - moveX;
            const threshold = 50; // Минимальное смещение для регистрации свайпа
            
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Свайп влево - следующий слайд
                    if (currentSlide < maxSlide) {
                        currentSlide++;
                    } else {
                        currentSlide = 0;
                    }
                } else {
                    // Свайп вправо - предыдущий слайд
                    if (currentSlide > 0) {
                        currentSlide--;
                    } else {
                        currentSlide = maxSlide;
                    }
                }
                updateReviewsDisplay();
            }
            
            startX = null;
            moveX = null;
        }, {passive: true});
    };
    
    // Обработка изменения размера окна
    window.addEventListener('resize', function() {
        updateReviewsDisplay();
    });
    
    // Инициализация
    function init() {
        // Добавляем стили для анимации
        const style = document.createElement('style');
        style.textContent = `
            .hero-content, .phone-mockup, .feature-card, .review-card, .extra-feature-item {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            @media (max-width: 768px) {
                .hero-content, .phone-mockup, .feature-card, .review-card, .extra-feature-item {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                
                nav.active {
                    display: block !important;
                    animation: slideDown 0.3s ease-in-out forwards;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }
        `;
        document.head.appendChild(style);
        
        // Устанавливаем начальное состояние слайдера
        updateReviewsDisplay();
        
        // Инициализируем обработку касаний
        setupTouchEvents();
        
        // Устанавливаем обработчик анимации при скролле
        window.addEventListener('scroll', animateElements);
        
        // Запускаем анимацию для видимых элементов
        setTimeout(animateElements, 100);
        
        // Фиксим 300ms задержку на тач-устройствах
        document.addEventListener('touchstart', function() {}, {passive: true});
    }
    
    // Запускаем инициализацию
    init();
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    const reviewCards = document.querySelectorAll('.review-card');
    const extraFeatures = document.querySelectorAll('.extra-feature-item');
    const heroContent = document.querySelector('.hero-content');
    const phoneImage = document.querySelector('.phone-mockup');
    
    // Function to check if element is in viewport
    function isInViewport(element, offset = 100) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to handle scroll animation
    function handleScrollAnimation() {
        // Animate hero content on load
        if (heroContent) {
            setTimeout(() => {
                heroContent.classList.add('animate-in');
            }, 200);
        }
        
        // Animate phone mockup on load
        if (phoneImage) {
            setTimeout(() => {
                phoneImage.classList.add('animate-in');
            }, 500);
        }
        
        // Animate feature cards on scroll
        featureCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 150 * index);
            }
        });
        
        // Animate extra features
        extraFeatures.forEach((item, index) => {
            if (isInViewport(item)) {
                setTimeout(() => {
                    item.classList.add('animate-in');
                }, 100 * index);
            }
        });
        
        // Animate review cards
        reviewCards.forEach((card, index) => {
            if (isInViewport(card)) {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, 150 * index);
            }
        });
    }
    
    // Check on initial load
    handleScrollAnimation();
    
    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);
});

// Add CSS class for animation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .hero-content, .phone-mockup, .feature-card, .review-card, .extra-feature-item {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .hero-content.animate-in, .phone-mockup.animate-in, 
        .feature-card.animate-in, .review-card.animate-in, 
        .extra-feature-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .phone-mockup {
            transition-delay: 0.3s;
        }
        
        @media (max-width: 768px) {
            .hero-content, .phone-mockup, .feature-card, .review-card, .extra-feature-item {
                transition: opacity 0.4s ease, transform 0.4s ease;
            }
        }
        
        .success-message {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
            text-align: center;
        }
        
        nav.active {
            display: block !important;
            width: 100%;
            position: absolute;
            top: 70px;
            left: 0;
            background-color: white;
            text-align: center;
            padding: 20px 0;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            z-index: 999;
            animation: fadeInDown 0.3s ease forwards;
        }
        
        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        nav.active ul {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
            padding: 0;
            margin: 0;
        }
        
        nav.active ul li {
            margin: 10px 0;
            width: 100%;
            padding: 0 20px;
        }
        
        nav.active ul li a {
            display: block;
            padding: 8px 0;
            width: 100%;
        }
        
        .mobile-menu-toggle.active {
            color: var(--medium-green);
        }
        
        @media (max-width: 576px) {
            .btn {
                width: 100%;
                max-width: 280px;
                margin: 0 auto;
            }
            
            .download-buttons .btn {
                margin-bottom: 10px;
            }
            
            .section-header h2::after {
                width: 40px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Trigger CSS animations if scrolled to element already when page loads
    setTimeout(function() {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
}); 
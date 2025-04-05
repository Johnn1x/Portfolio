document.addEventListener('DOMContentLoaded', () => {
    // Theme selection with weighted probabilities
    const randomValue = Math.random();
    let selectedTheme;

    if (randomValue < 0.8) {
        selectedTheme = 'theme1'; // 80%
    } else if (randomValue < 0.9) {
        selectedTheme = 'theme2'; // 10%
    } else {
        selectedTheme = 'theme5'; // 10%
    }

    document.body.className = selectedTheme;

    // Parallax for theme 1
    if (selectedTheme === 'theme1') {
        let lastX = 0, lastY = 0;
        const parallaxIntensity = 15; // Reduced intensity for smoother movement
        
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * parallaxIntensity;
            const y = (e.clientY / window.innerHeight - 0.5) * parallaxIntensity;
            
            // Smoothing the movement
            const smoothX = lastX + (x - lastX) * 0.1;
            const smoothY = lastY + (y - lastY) * 0.1;
            
            document.body.style.backgroundPosition = `calc(50% + ${smoothX}px) calc(50% + ${smoothY}px)`;
            lastX = smoothX;
            lastY = smoothY;
        });
    }

    // Space dust for theme 5
    if (selectedTheme === 'theme5') {
        const canvas = document.getElementById('gridCanvas');
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = document.body.scrollHeight; // Use full document height for scrolling
        canvas.width = width;
        canvas.height = height;

        const particles = [];
        const particleCount = Math.floor(width / 8); // Adjusted count based on width
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5) * 0.2,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.4 + 0.1
            });
        }

        function animateDust() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.x += p.speedX;
                p.y += p.speedY;

                // Wrap around edges for continuous movement
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animateDust);
        }

        animateDust();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = window.innerWidth;
                height = document.body.scrollHeight;
                canvas.width = width;
                canvas.height = height;
                
                // Adjust particles for new dimensions
                particles.forEach(p => {
                    p.x = (p.x / canvas.width) * width;
                    p.y = (p.y / canvas.height) * height;
                });
            }, 100);
        });

        // Make sure body has proper scrolling
        document.body.style.overflow = 'auto';
    }

    // Add fade-in animation for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        // Staggered animation
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * (index + 1));
        
        // Добавляем атрибут data-text для имени студии
        const studioName = document.querySelector('.studio-name');
        if (studioName) {
            studioName.setAttribute('data-text', studioName.textContent);
        }
        
        // Добавляем 3D эффект карточкам при движении мыши
        card.addEventListener('mousemove', handleCardMouseMove);
        card.addEventListener('mouseleave', handleCardMouseLeave);
        card.addEventListener('mouseenter', handleCardMouseEnter);
        card.addEventListener('touchstart', handleCardTouchStart, { passive: true });
        card.addEventListener('touchmove', handleCardTouchMove, { passive: true });
        card.addEventListener('touchend', handleCardTouchEnd, { passive: true });
    });
    
    // Управление 3D эффектом карточек
    function handleCardMouseMove(e) {
        if (window.matchMedia('(hover: hover)').matches) {
            const card = e.currentTarget;
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Рассчитываем смещение от центра в процентах
            const percentX = (mouseX - centerX) / (rect.width / 2);
            const percentY = (mouseY - centerY) / (rect.height / 2);
            
            // Изменяем и уменьшаем наклон до 6 градусов максимум
            const tiltX = -percentY * 6; // Вертикальное движение
            const tiltY = percentX * 6;  // Горизонтальное движение - исправляем направление
            
            // Применяем наклон и эффект глубины только к карточке
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // Убираем движение внутренних элементов
            /*
            if (icon) icon.style.transform = `translateZ(30px) translateX(${percentX * 8}px) translateY(${percentY * 8}px)`;
            if (title) title.style.transform = `translateZ(25px) translateX(${percentX * 6}px) translateY(${percentY * 6}px)`;
            if (desc) desc.style.transform = `translateZ(15px) translateX(${percentX * 3}px) translateY(${percentY * 3}px)`;
            if (footer) footer.style.transform = `translateZ(20px) translateX(${percentX * 5}px) translateY(${percentY * 5}px)`;
            */
        }
    }
    
    function handleCardMouseLeave(e) {
        if (window.matchMedia('(hover: hover)').matches) {
            const card = e.currentTarget;
            
            // Возвращаем карточку в исходное положение
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.backgroundImage = 'none';
            
            // Плавный возврат в исходное положение
            card.style.transition = 'all 0.5s ease-out';
        }
    }
    
    function handleCardMouseEnter(e) {
        if (window.matchMedia('(hover: hover)').matches) {
            const card = e.currentTarget;
            
            // Отключаем transition для плавного движения за курсором
            card.style.transition = 'background-image 0.5s ease-out';
            
            const icon = card.querySelector('.project-icon');
            const title = card.querySelector('.project-title');
            const desc = card.querySelector('.project-description');
            const footer = card.querySelector('.project-footer');
            
            if (icon) icon.style.transition = 'transform 0.2s ease-out';
            if (title) title.style.transition = 'transform 0.2s ease-out';
            if (desc) desc.style.transition = 'transform 0.2s ease-out';
            if (footer) footer.style.transition = 'transform 0.2s ease-out';
        }
    }
    
    // Поддержка Touch устройств
    let initialTouchX, initialTouchY;
    
    function handleCardTouchStart(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            initialTouchX = touch.clientX;
            initialTouchY = touch.clientY;
            
            const card = e.currentTarget;
            card.style.transition = 'transform 0.2s ease-out';
        }
    }
    
    function handleCardTouchMove(e) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            const deltaX = touchX - initialTouchX;
            const deltaY = touchY - initialTouchY;
            
            // Ограничиваем угол наклона и исправляем направление
            const tiltX = Math.min(Math.max(-deltaY * 0.03, -4), 4); // Уменьшаем интенсивность
            const tiltY = Math.min(Math.max(deltaX * 0.03, -4), 4);  // Исправляем направление и уменьшаем
            
            const card = e.currentTarget;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
        }
    }
    
    function handleCardTouchEnd(e) {
        const card = e.currentTarget;
        
        // Плавно возвращаем карточку в исходное положение
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    }

    // Add 3D press effect to project cards
    projectCards.forEach(card => {
        let isPressed = false;
        
        card.addEventListener('mousedown', () => {
            isPressed = true;
            card.classList.add('pressed');
        });
        
        card.addEventListener('mouseup', () => {
            isPressed = false;
            card.classList.remove('pressed');
        });
        
        card.addEventListener('mouseleave', () => {
            if (isPressed) {
                isPressed = false;
                card.classList.remove('pressed');
            }
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.telegram-btn, .project-link');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
                if (this.href) window.open(this.href, '_blank');
            }, 600);
        });
    });

    console.log(`Johnn1x site loaded with ${selectedTheme}`);

    // Автоматическое определение языка
    function detectUserLanguage() {
        // Получаем язык браузера пользователя
        const userLang = navigator.language || navigator.userLanguage;
        const userLangLower = userLang.toLowerCase();
        
        // Список кодов для русскоговорящих стран и регионов
        const russianSpeakingCodes = ['ru', 'ru-ru', 'ru-by', 'ru-kz', 'be', 'be-by', 'kk-kz', 'uk-ua'];
        
        // Проверяем, если язык пользователя входит в список или начинается с 'ru-'
        if (russianSpeakingCodes.includes(userLangLower) || userLangLower.startsWith('ru-')) {
            return 'ru';
        } else {
            return 'en';
        }
    }
    
    // Устанавливаем язык при загрузке страницы
    const userPreferredLanguage = detectUserLanguage();
    const langText = document.querySelector('.lang-text');
    
    if (userPreferredLanguage === 'ru') {
        document.body.classList.add('ru');
        langText.textContent = 'EN';
    } else {
        document.body.classList.add('en');
        langText.textContent = 'RU';
    }
    
    // Остальной код функциональности переключателя языка
    const langToggle = document.getElementById('langToggle');
    
    langToggle.addEventListener('click', () => {
        // Переключаем класс body для смены языка
        if (document.body.classList.contains('en')) {
            document.body.classList.remove('en');
            document.body.classList.add('ru');
            langText.textContent = 'EN';
        } else {
            document.body.classList.remove('ru');
            document.body.classList.add('en');
            langText.textContent = 'RU';
        }
        
        // Добавляем анимацию для плавного перехода
        const textElements = document.querySelectorAll('.lang-ru, .lang-en');
        textElements.forEach(el => {
            el.style.transition = 'opacity 0.3s ease';
            el.style.opacity = '0';
            
            setTimeout(() => {
                el.style.opacity = '1';
            }, 300);
        });
    });
}); 
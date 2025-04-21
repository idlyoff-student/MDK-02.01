// Дождемся полной загрузки документа
document.addEventListener('DOMContentLoaded', function() {
  // Мобильное меню
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
      
      // Предотвращаем прокрутку страницы, когда меню открыто
      if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  // Закрытие мобильного меню при клике на ссылку
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Плавная прокрутка для якорных ссылок
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Проверяем, что у ссылки есть якорь, отличный от "#"
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

  // Анимация при прокрутке с улучшенным обнаружением
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Отложенная анимация для последовательного появления элементов
  document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
    setTimeout(() => {
      observer.observe(el);
    }, index * 100); // Небольшая задержка для каждого следующего элемента
  });

  // Валидация формы
  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    // Обработка отправки формы
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      
      // Проверка имени
      if (!validateField(nameInput, 'Пожалуйста, введите ваше имя')) {
        isValid = false;
      }
      
      // Проверка email
      if (emailInput.value.trim() === '') {
        showError(emailInput, 'Пожалуйста, введите ваш email');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, 'Пожалуйста, введите корректный email');
        isValid = false;
      } else {
        removeError(emailInput);
      }
      
      // Проверка сообщения
      if (!validateField(messageInput, 'Пожалуйста, введите ваше сообщение')) {
        isValid = false;
      }
      
      if (isValid) {
        // Здесь будет отправка формы
        showSuccessMessage(contactForm);
      }
    });
    
    // Валидация в реальном времени при вводе текста
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        if (input.id === 'email' && input.value.trim() !== '') {
          if (!isValidEmail(input.value)) {
            showError(input, 'Пожалуйста, введите корректный email');
          } else {
            removeError(input);
          }
        } else if (input.value.trim() !== '') {
          removeError(input);
        }
      });
    });
  }
  
  // Инициализация аккордеона для FAQ
  initAccordion();
});

// Функция проверки email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Проверка поля ввода
function validateField(input, errorMessage) {
  if (input.value.trim() === '') {
    showError(input, errorMessage);
    return false;
  } else {
    removeError(input);
    return true;
  }
}

// Показ ошибки
function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.classList.add('error');
  
  let errorElement = formGroup.querySelector('.error-message');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  
  // Анимация для подсветки ошибки
  input.style.animation = 'shake 0.5s';
  setTimeout(() => {
    input.style.animation = '';
  }, 500);
}

// Удаление ошибки
function removeError(input) {
  const formGroup = input.parentElement;
  formGroup.classList.remove('error');
  
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

// Показ сообщения об успешной отправке
function showSuccessMessage(form) {
  // Сохраняем высоту формы для плавного перехода
  const formHeight = form.offsetHeight;
  form.style.height = `${formHeight}px`;
  
  // Очищаем содержимое формы
  const originalContent = form.innerHTML;
  form.innerHTML = '';
  
  // Создаем элемент сообщения
  const successMessage = document.createElement('div');
  successMessage.className = 'success-message';
  successMessage.innerHTML = `
    <i class="fas fa-check-circle"></i>
    <h3>Спасибо!</h3>
    <p>Ваше сообщение успешно отправлено. Мы свяжемся с вами в ближайшее время.</p>
    <button type="button" class="btn btn-reset">Отправить еще одно сообщение</button>
  `;
  
  // Добавляем сообщение в форму
  form.appendChild(successMessage);
  
  // Настраиваем высоту формы
  setTimeout(() => {
    form.style.height = 'auto';
  }, 300);
  
  // Обработка кнопки сброса формы
  const resetButton = successMessage.querySelector('.btn-reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      form.innerHTML = originalContent;
      
      // Повторно назначаем обработчики событий для новой формы
      const newForm = document.querySelector('.contact-form');
      if (newForm) {
        newForm.addEventListener('submit', function(e) {
          e.preventDefault();
          // Здесь повторная валидация
        });
      }
    });
  }
}

// Инициализация аккордеона для FAQ
function initAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  
  if (accordionItems.length === 0) {
    return; // Выходим, если аккордеон не найден на странице
  }
  
  // Сначала устанавливаем высоту всех элементов в 0
  accordionItems.forEach(item => {
    const content = item.querySelector('.accordion-content');
    if (content) {
      content.style.maxHeight = '0px';
    }
  });
  
  // Добавляем обработчики событий для заголовков
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const content = accordionItem.querySelector('.accordion-content');
      const icon = header.querySelector('.accordion-icon');
      
      // Закрываем все остальные аккордеоны
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== accordionItem && item.classList.contains('active')) {
          item.classList.remove('active');
          const itemContent = item.querySelector('.accordion-content');
          itemContent.style.maxHeight = '0px';
          const itemIcon = item.querySelector('.accordion-icon');
          itemIcon.textContent = '+';
        }
      });
      
      // Открываем/закрываем текущий аккордеон
      accordionItem.classList.toggle('active');
      
      if (accordionItem.classList.contains('active')) {
        // Устанавливаем максимальную высоту для плавной анимации
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.textContent = '−'; // Используем символ минуса (длинное тире)
      } else {
        content.style.maxHeight = '0px';
        icon.textContent = '+';
      }
    });
  });
  
  // По умолчанию открываем первый элемент аккордеона, если он есть
  const firstAccordionItem = document.querySelector('.accordion-item');
  if (firstAccordionItem) {
    setTimeout(() => {
      firstAccordionItem.querySelector('.accordion-header').click();
    }, 500);
  }
} 
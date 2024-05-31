let currentSlide = 0;

document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentSlide);
    setInterval(nextSlide, 5000); // Автоматическая смена слайдов каждые 5 секунд
    // Инициализация вкладок моделей
    const tabs = document.querySelectorAll('.model-tabs .tab');
    const modelItems = document.querySelectorAll('.model-content .model-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Удаляем класс active у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            // Удаляем класс active у всех элементов контента
            modelItems.forEach(item => item.classList.remove('active'));

            // Добавляем класс active к выбранной вкладке
            tab.classList.add('active');
            // Добавляем класс active к соответствующему элементу контента
            const targetId = tab.dataset.tab;
            document.getElementById(targetId).classList.add('active');
        });
    });
});

function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if (idx === currentSlide) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Функция для анимации скроллинга
function scrollAnimation() {
    const sections = document.querySelectorAll('.choose-car, .care-for-car');

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Проверяем, находится ли секция в зоне видимости
        if (rect.top <= windowHeight * 0.8) {
            section.style.opacity = 1;
            section.style.transform = 'translateY(0)';
        }
    });
}

// Вызываем функцию при скроллинге
window.addEventListener('scroll', scrollAnimation);
window.addEventListener('load', function() {
    setModelSectionHeight();
});

// Функция для установки высоты секции .models равной высоте окна просмотра
function setModelSectionHeight() {
    const modelSection = document.querySelector('.models');
    modelSection.style.height = window.innerHeight + 'px';
}
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.model-tabs .tab');
    const tabContents = document.querySelectorAll('.model-content .model-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const activeModel = this.getAttribute('data-model'); // Use 'data-model'
            
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');

            const activeContent = document.getElementById(activeModel); // Use getElementById
            activeContent.classList.add('active'); 
        });
    });
});
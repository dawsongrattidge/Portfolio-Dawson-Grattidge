

const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelectorAll('.nav__link')

AOS.init();

navToggle.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        targetSection.scrollIntoView({ behavior: 'smooth' });
        document.body.classList.remove('nav-open');
    });
});

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const parallaxElements = document.querySelectorAll('.parallax');

    parallaxElements.forEach(element => {
        const offset = scrolled * 0.2;
        element.style.transform = `translateY(${offset}px)`;
    });
});


const themeSwitcher = document.getElementById('checkbox');

themeSwitcher.addEventListener('change', function() {
    let currentTheme = document.documentElement.getAttribute('data-theme');
    if (this.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
});

// Check for saved theme in local storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeSwitcher.checked = true;
    }
}




const images = document.querySelectorAll('.lazy-load');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

images.forEach(img => observer.observe(img));

/* --- Slideshow Logic --- */
const slideImages = [
    { img: '/img/placeHolderImg.jpeg', title: 'NVTC', desc: 'Nakuru Vocation Training Center.' },
    { img: '/img/placeHolderImg2.jpeg', title: 'NVTC', desc: 'Nakuru Vocation Training Center.' },
    { img: '/img/placeHolderImg4.jpeg', title: 'NVTC', desc: 'Nakuru Vocation Training Center.' }
];

const slideImageElement = document.querySelector('.slide-image');
const slideTextElement = document.querySelector('.slide-text');
const dots = document.querySelectorAll('.slide-dot');
let currentSlideIndex = 0;
let slideInterval;

function showSlide(index) {
    // Update image background
    slideImageElement.style.backgroundImage = `url('${slideImages[index].img}')`;
    
    // Update text content
    slideTextElement.innerHTML = `
        <small style="letter-spacing: 3px;">SERIES 0${index + 1}</small>
        <h2>${slideImages[index].title}</h2>
        <p>${slideImages[index].desc}</p>
        <button class="slide-btn" onclick="openLightbox('${slideImages[index].img}')">View Project</button>
    `;

    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    
    currentSlideIndex = index;
}

function currentSlide(index) {
    showSlide(index);
    resetTimer();
}

function nextSlide() {
    let next = (currentSlideIndex + 1) % slideImages.length;
    showSlide(next);
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Initialize slideshow
showSlide(0);
resetTimer();

/* --- Lightbox Logic --- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
}

function openCustomLightbox(src) {
    openLightbox(src);
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

// Close lightbox on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const ring = document.getElementById('ring');
    const cards = document.querySelectorAll('.card');
    const nextBtn = document.getElementById('nextBtn');

    const totalCards = cards.length;
    const theta = 360 / totalCards; 
    
    let currentIndex = 0;

    // Function to get the current radius from CSS variables
    // This ensures JS and CSS stay in sync when screen size changes
    function getCurrentRadius() {
        const rootStyles = getComputedStyle(document.documentElement);
        // Remove the 'px' from the string and convert to number
        return parseInt(rootStyles.getPropertyValue('--radius').trim(), 10);
    }

    function initCarousel() {
        const radius = getCurrentRadius();

        cards.forEach((card, index) => {
            const angle = theta * index;
            // Apply the 3D transformation using the dynamic radius
            card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });
        
        updateRingRotation();
    }

    function updateRingRotation() {
        const angle = currentIndex * -theta;
        ring.style.transform = `rotateY(${angle}deg)`;
    }

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateRingRotation();
    });

    // Initialize on load
    initCarousel();

    // Re-initialize if the window is resized (e.g., rotating a phone)
    // This recalculates the radius so cards don't break apart.
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initCarousel();
        }, 250); // Debounce to prevent lag while dragging window
    });
});
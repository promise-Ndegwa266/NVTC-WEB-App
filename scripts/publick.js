document.addEventListener('DOMContentLoaded', function() {

// ---------- NAVBAR TOGGLE (Mobile) ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', function() {
    this.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// ---------- NAVBAR SCROLL EFFECT ----------
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
        lastScroll = currentScroll;
    });

// ---------- ACTIVE NAV LINK (scroll spy) ----------
const sections = document.querySelectorAll('section[id]');
const navLinkItems = navLinks.querySelectorAll('a:not(.nav-cta)');

window.addEventListener('scroll', function() {
    let current = '';
    sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
        if (window.pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinkItems.forEach(link => {
    link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

            // ---------- BACK TO TOP ----------
            const backToTop = document.getElementById('backToTop');
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 400) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });
            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            

            function showToast() {
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 5000);
            }

            // ---------- LEAFLET MAP ----------
            // Coordinates for Nakuru, Kenya (approximate centre)
            const lat = -0.3031;
            const lng = 36.0800;

            const map = L.map('map').setView([lat, lng], 14);

            // OpenStreetMap tiles (free, no API key)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
            }).addTo(map);

            // Custom marker
            const redIcon = L.divIcon({
                className: 'custom-marker',
                html: `<div style="background:#0a6b3c; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 16px rgba(10,107,60,0.4); border:3px solid white;">
                        <i class="fas fa-graduation-cap" style="color:white; font-size:20px;"></i>
                    </div>`,
                iconSize: [44, 44],
                iconAnchor: [22, 44],
                popupAnchor: [0, -44],
            });

            // Add marker with popup
            const marker = L.marker([lat, lng], { icon: redIcon })
                .addTo(map)
                .bindPopup(`
                        <strong style="font-size:1.1rem;">Nakuru VTC</strong><br>
                        P.O. Box 3973-20100, Nakuru<br>
                        <i class="fas fa-phone" style="color:#0a6b3c;"></i> 0702 474 169
                    `);

            // Open popup by default
            marker.openPopup();

            // ---------- SMOOTH SCROLL FOR NAV LINKS (fallback) ----------
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        const offsetTop = targetEl.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    }
                });
            });

        });
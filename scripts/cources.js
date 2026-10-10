document.addEventListener('DOMContentLoaded', function() {

            // ---------- NAVBAR TOGGLE (Mobile) ----------
            const hamburger = document.getElementById('hamburger');
            const navLinks = document.getElementById('navLinks');

            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('open');
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('open');
                });
            });

            // ---------- NAVBAR SCROLL ----------
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 60) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
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

            // ---------- FILTER / TAB SYSTEM ----------
            const filterTabs = document.querySelectorAll('.filter-tab');
            const courseCards = document.querySelectorAll('.course-card');
            const noResults = document.getElementById('noResults');
            const coursesGrid = document.getElementById('coursesGrid');

            let activeFilter = 'all';

            function filterCourses(filter) {
                let visibleCount = 0;

                courseCards.forEach(card => {
                    const cardType = card.dataset.type || '';
                    const cardLevel = card.dataset.level || '';

                    let show = false;

                    if (filter === 'all') {
                        show = true;
                    } else if (filter === 'nita') {
                        show = cardType === 'nita';
                    } else if (filter === 'knec') {
                        show = cardType === 'knec';
                    } else if (filter === 'level1') {
                        show = cardLevel.includes('level1');
                    } else if (filter === 'level2') {
                        show = cardLevel.includes('level2');
                    } else if (filter === 'level3') {
                        show = cardLevel.includes('level3');
                    }

                    if (show) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Show/hide no results message
                if (visibleCount === 0) {
                    noResults.style.display = 'block';
                } else {
                    noResults.style.display = 'none';
                }

                // Update active tab
                filterTabs.forEach(tab => {
                    tab.classList.remove('active');
                    if (tab.dataset.filter === filter) {
                        tab.classList.add('active');
                    }
                });

                activeFilter = filter;
            }

            // Add click event to tabs
            filterTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const filter = this.dataset.filter;
                    filterCourses(filter);
                    showToast('Showing: ' + this.textContent.trim());
                });
            });

            
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');

            function showToast(message) {
                toastMessage.textContent = message;
                toast.querySelector('i').className = 'fas fa-check-circle';
                toast.style.background = 'var(--primary-dark)';
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(() => {
                    toast.classList.remove('show');
                }, 2500);
            }

            // ---------- SMOOTH SCROLL ----------
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

           
            filterCourses('all');

           
            setTimeout(() => {
                showToast( courseCards.length + ' courses available — all fully sponsored!');
            }, 800);

        });
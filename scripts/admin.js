
// ============================================================
        //  NAVIGATION: show/hide sections, update active state, title
        // ============================================================
        const sectionMap = {
            'dashboard': { title: 'Dashboard', section: 'section-dashboard' },
            'candidates': { title: 'Candidate s Exam', section: 'section-candidates' },
            'students': { title: 'Add Students', section: 'section-students' },
            'monitor': { title: 'Monitor Vote', section: 'section-monitor' },
            'results': { title: 'Results', section: 'section-results' },
            'messages': { title: "Message's / Inbox", section: 'section-messages' },
            'formsubmits': { title: "Form's Submited Online", section: 'data-form-notification' },
            'studentenrolld':{title:"Students Enrolled", section: 'Students-admided'},
            'domitry':{title:"Students Dorm request's", section: 'Students-Dorms'},
            'differ':{title:"Students Differ request's", section: 'Students-Differ'},
            'memo':{title:"Memo", section: 'Memo'},
            'admin':{title:"Admin Profile", section: 'Admin'},
        };

        const pageTitle = document.getElementById('pageTitle');

        function navigateTo(sectionKey) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(el => {
                el.classList.remove('visible');
            });

            // Show target
            const target = document.getElementById(sectionMap[sectionKey].section);
            if (target) {
                target.classList.add('visible');
            }

            // Update title
            const title = sectionMap[sectionKey].title;
            pageTitle.innerHTML = title + ' <small>Nakuru VTC</small>';

            // Update sidebar active state
            document.querySelectorAll('.sidebar-nav .nav-item').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.section === sectionKey) {
                    btn.classList.add('active');
                }
            });

            // Close mobile menu
            const checkbox = document.getElementById('menu-toggle-checkbox');
            if (checkbox && window.innerWidth <= 768) {
                checkbox.checked = false;
            }
        }


        // ============================================================
        //  Close mobile menu on overlay click
        // ============================================================
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.addEventListener('click', function() {
                const checkbox = document.getElementById('menu-toggle-checkbox');
                if (checkbox) checkbox.checked = false;
            });
        }

        // ============================================================
        //  Close mobile menu on Escape key
        // ============================================================
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const checkbox = document.getElementById('menu-toggle-checkbox');
                if (checkbox && checkbox.checked) {
                    checkbox.checked = false;
                }
            }
        });

        // ============================================================
        //  Close mobile menu on window resize to desktop
        // ============================================================
        window.addEventListener('resize', function() {
            const checkbox = document.getElementById('menu-toggle-checkbox');
            if (checkbox && window.innerWidth > 768) {
                checkbox.checked = false;
            }
        });

        // ============================================================
        //  Touch feedback for interactive elements
        // ============================================================
        document.querySelectorAll('.sidebar-nav .nav-item, .quick-card, .result-card, .stat-card, .logout-btn').forEach(el => {
            el.addEventListener('touchstart', function() {
                this.style.transition = 'transform 0.1s ease';
            }, { passive: true });
        });
        

        /* ============================================================
        DORM BOOKING FILTER
        ============================================================ */
        function filterDormRequests(status, button) {
            const rows = document.querySelectorAll('.dorm-row');
            const tabs = document.querySelectorAll('.dorm-filter-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            if (button) button.classList.add('active');

            let visibleCount = 0;
            rows.forEach(row => {
                const rowStatus = row.getAttribute('data-status');
                if (status === 'all' || rowStatus === status) {
                    row.style.display = '';
                    visibleCount++;
                } else {
                    row.style.display = 'none';
                }
            });

            const emptyState = document.querySelector('.dorm-empty-state');
            if (emptyState) {
                emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        /* ============================================================
        MEMO FILTER
        ============================================================ */
        function filterMemos(type, button) {
            const cards = document.querySelectorAll('.memo-card');
            const tabs = document.querySelectorAll('.memo-filter-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            if (button) button.classList.add('active');

            let visibleCount = 0;
            cards.forEach(card => {
                const owner = card.getAttribute('data-owner');
                const priority = card.getAttribute('data-priority');

                let show = false;
                if (type === 'all') show = true;
                else if (type === 'inbox') show = owner === 'inbox';
                else if (type === 'sent') show = owner === 'sent';
                else if (type === 'urgent') show = priority === 'Urgent';

                card.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });

            // Show empty state if no cards visible
            const emptyState = document.querySelector('.memo-empty-state');
            if (emptyState) {
                emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
            }
        }

        // ============================================================
        //  IMAGE UPLOAD FOR THE PROFILE
        // ============================================================
        document.addEventListener('DOMContentLoaded', function () {

        // ===== COVER IMAGE UPLOAD =====
        const coverSection = document.querySelector('.profile-cover');
        const coverImg = coverSection.querySelector('img');
        const coverInput = coverSection.querySelector('input[type="file"]');

        coverInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file (JPG, PNG, etc.).');
                this.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large. Maximum size is 5MB.');
                this.value = '';
                return;
            }

            // Preview the uploaded cover image
            const reader = new FileReader();
            reader.onload = function (event) {
                coverImg.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        // ===== PROFILE PICTURE UPLOAD =====
        const avatarWrapper = document.querySelector('.profile-avatar-wrapper');
        const avatarImg = avatarWrapper.querySelector('.profile-avatar-large img');
        const avatarInput = avatarWrapper.querySelector('input[type="file"]');

        avatarInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please upload a valid image file (JPG, PNG, etc.).');
                this.value = '';
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File too large. Maximum size is 5MB.');
                this.value = '';
                return;
            }

            // Preview the uploaded profile picture
            const reader = new FileReader();
            reader.onload = function (event) {
                avatarImg.src = event.target.result;

                // Optional: also update the small header avatar if it exists
                const headerAvatar = document.querySelector('.dash-header .user-info .avatar img');
                if (headerAvatar) {
                    headerAvatar.src = event.target.result;
                }
            };
            reader.readAsDataURL(file);
        });

    });
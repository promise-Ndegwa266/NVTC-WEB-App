document.addEventListener('DOMContentLoaded', function () {

      /* ==========================================
         1. SIDEBAR TOGGLE (Mobile)
         ========================================== */
      const sidebar = document.getElementById('sidebar');
      const sidebarOverlay = document.getElementById('sidebarOverlay');
      const menuToggle = document.getElementById('menuToggle');
      const sidebarClose = document.getElementById('sidebarClose');

      function openSidebar() {
        sidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      function closeSidebar() {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }

      if (menuToggle) menuToggle.addEventListener('click', openSidebar);
      if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
      if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeSidebar();
      });

      /* ==========================================
         2. MAIN SECTION SWITCHING
         ========================================== */
      const navButtons = document.querySelectorAll('.nav-btn-optio');
      const sections = document.querySelectorAll('.dashboard-section');
      const pageTitle = document.getElementById('pageTitle');

      const pageTitles = {
        dashboard: 'Dashboard',
        results: 'Exam Results',
        dorm: 'Dormitory Booking',
        vote: 'Student Elections',
        enroll: 'Exam Enrollment',
        defer: 'Defer Request',
        profile: 'My Profile'
      };

      function showSection(sectionId) {
        sections.forEach(function (section) {
          section.classList.remove('active');
        });

        const target = document.getElementById('section-' + sectionId);
        if (target) target.classList.add('active');

        navButtons.forEach(function (btn) {
          btn.classList.toggle('active', btn.dataset.section === sectionId);
        });

        if (pageTitle) {
          pageTitle.textContent = pageTitles[sectionId] || 'Dashboard';
        }

        closeSidebar();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      navButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          showSection(this.dataset.section);
        });
      });

      document.querySelectorAll('.action-tile[data-goto]').forEach(function (tile) {
        tile.addEventListener('click', function (e) {
          e.preventDefault();
          showSection(this.dataset.goto);
        });
      });

      showSection('dashboard');

      /* ==========================================
         3. PROFILE TABS
         ========================================== */
      const profileTabs = document.querySelectorAll('.profile-tab');
      const tabContents = document.querySelectorAll('.profile-tab-content');

      profileTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          const tabId = this.dataset.tab;

          profileTabs.forEach(function (t) { t.classList.remove('active'); });
          tabContents.forEach(function (c) { c.classList.remove('active'); });

          this.classList.add('active');
          const target = document.getElementById(tabId);
          if (target) target.classList.add('active');
        });
      });

      /* ==========================================
         4. VOTING FORM
         ========================================== */
      const votingForm = document.getElementById('votingForm');
      if (votingForm) {
        votingForm.addEventListener('submit', function (e) {
          const selected = document.querySelectorAll('input[type="radio"]:checked');

          if (selected.length === 0) {
            e.preventDefault();
            alert('Please select at least one candidate before submitting.');
            return;
          }

          document.getElementById('successModal').classList.add('active');
        });

        const resetBtn = document.querySelector('.btn-reset');
        if (resetBtn) {
          resetBtn.addEventListener('click', function (e) {
            if (!confirm('Are you sure you want to clear all your selections?')) {
              e.preventDefault();
            }
          });
        }
      }

      /* ==========================================
         5. MODAL HANDLERS
         ========================================== */
      const successModal = document.getElementById('successModal');

      if (successModal) {
        successModal.addEventListener('click', function (e) {
          if (e.target === this) closeModal();
        });
      }

      window.closeModal = function () {
        const modal = document.getElementById('successModal');
        if (modal) modal.classList.remove('active');

        const form = document.getElementById('votingForm');
        if (form) form.reset();
      };
       /* ==========================================
         6. EXAM ENROLLMENT
         ========================================== */
      const levelTabs = document.querySelectorAll('.level-tab');
      const levelContents = document.querySelectorAll('.level-content');
      const enrollButtons = document.querySelectorAll('.enroll-btn');
      const enrolledSummary = document.getElementById('enrolledSummary');
      const enrolledList = document.getElementById('enrolledList');

      let enrolledExams = [];

      try {
        const saved = localStorage.getItem('nvtc_enrolled_exams');
        if (saved) enrolledExams = JSON.parse(saved);
      } catch (e) {
        enrolledExams = [];
      }

      // Level tab switching
      levelTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          const targetLevel = this.dataset.level;

          levelTabs.forEach(function (t) { t.classList.remove('active'); });
          levelContents.forEach(function (c) { c.classList.remove('active'); });

          this.classList.add('active');
          const target = document.getElementById('level-' + targetLevel);
          if (target) target.classList.add('active');
        });
      });

      function saveEnrollments() {
        try {
          localStorage.setItem('nvtc_enrolled_exams', JSON.stringify(enrolledExams));
        } catch (e) {
          console.warn('Could not save enrollments:', e);
        }
      }

      function renderEnrolledList() {
        if (!enrolledList) return;

        if (enrolledExams.length === 0) {
          enrolledSummary.style.display = 'none';
          return;
        }

        enrolledSummary.style.display = 'block';
        enrolledList.innerHTML = '';

        enrolledExams.forEach(function (exam, index) {
          const li = document.createElement('li');
          li.innerHTML = `
            <span><i class="fas fa-check-circle" style="color: var(--success); margin-right: 8px;"></i>${exam}</span>
            <button class="remove-enroll" data-index="${index}" title="Remove enrollment">
              <i class="fas fa-times"></i>
            </button>
          `;
          enrolledList.appendChild(li);
        });

        enrolledList.querySelectorAll('.remove-enroll').forEach(function (btn) {
          btn.addEventListener('click', function () {
            const idx = parseInt(this.dataset.index, 10);
            const removed = enrolledExams.splice(idx, 1)[0];
            saveEnrollments();
            renderEnrolledList();
            syncButtons();
            showModal('Enrollment Removed', 'Your enrollment for "' + removed + '" has been removed.');
          });
        });
      }

      function syncButtons() {
        enrollButtons.forEach(function (btn) {
          const examName = btn.dataset.exam;
          const isEnrolled = enrolledExams.includes(examName);
          const card = btn.closest('.module-card');

          if (isEnrolled) {
            btn.classList.add('enrolled');
            btn.innerHTML = '<i class="fas fa-check"></i> Enrolled';
            if (card) card.classList.add('enrolled');
          } else {
            btn.classList.remove('enrolled');
            btn.innerHTML = '<i class="fas fa-plus-circle"></i> Enroll Now';
            if (card) card.classList.remove('enrolled');
          }
        });
      }

      enrollButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          const examName = this.dataset.exam;
          const isEnrolled = enrolledExams.includes(examName);

          if (isEnrolled) {
            if (!confirm('Remove your enrollment for "' + examName + '"?')) return;
            enrolledExams = enrolledExams.filter(function (e) { return e !== examName; });
            saveEnrollments();
            renderEnrolledList();
            syncButtons();
            showModal('Enrollment Removed', 'You have been removed from "' + examName + '".');
          } else {
            enrolledExams.push(examName);
            saveEnrollments();
            renderEnrolledList();
            syncButtons();
            showModal('Enrollment Successful', 'You have successfully enrolled for "' + examName + '". Please check your email for confirmation.');
          }
        });
      });

      function showModal(title, message) {
        const modal = document.getElementById('successModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        if (modalTitle) modalTitle.textContent = title;
        if (modalMessage) modalMessage.textContent = message;
        if (modal) modal.classList.add('active');
      }

      renderEnrolledList();
      syncButtons();

      /* ==========================================
      7. FILTER RESULTS BY ENROLLMENT
      ========================================== */
    const resultsBody = document.getElementById('resultsBody');
    const resultsTable = document.getElementById('resultsTable');
    const noResultsState = document.getElementById('noResultsState');
    const noEnrolledResultsState = document.getElementById('noEnrolledResultsState');
    const resultsFilterNotice = document.getElementById('resultsFilterNotice');
    const goEnrollLink = document.getElementById('goEnrollLink');
    const goEnrollBtn = document.getElementById('goEnrollBtn');

    function filterResultsByEnrollment() {
      if (!resultsBody) return;

      // Read enrolled exams from localStorage
      let enrolled = [];
      try {
        const saved = localStorage.getItem('nvtc_enrolled_exams');
        if (saved) enrolled = JSON.parse(saved);
      } catch (e) {
        enrolled = [];
      }

      const rows = resultsBody.querySelectorAll('.exam-row');
      let visibleCount = 0;

      rows.forEach(function (row) {
        const key = row.dataset.key; // e.g. "Level 4 - Module 1"

        if (enrolled.includes(key)) {
          row.classList.remove('hidden-result');
          row.classList.add('enrolled-result');
          visibleCount++;
        } else {
          row.classList.add('hidden-result');
          row.classList.remove('enrolled-result');
        }
      });

      // Show filter notice if there are any enrollments
      if (resultsFilterNotice) {
        resultsFilterNotice.style.display = enrolled.length > 0 ? 'flex' : 'none';
      }

      // Handle empty states
      if (rows.length === 0) {
        // No results at all from server
        if (noResultsState) noResultsState.style.display = 'flex';
        if (noEnrolledResultsState) noEnrolledResultsState.style.display = 'none';
        if (resultsTable) resultsTable.style.display = 'none';
      } else if (visibleCount === 0) {
        // Results exist, but none match enrollment
        if (noResultsState) noResultsState.style.display = 'none';
        if (noEnrolledResultsState) noEnrolledResultsState.style.display = 'flex';
        if (resultsTable) resultsTable.style.display = 'none';
      } else {
        // Show matched results
        if (noResultsState) noResultsState.style.display = 'none';
        if (noEnrolledResultsState) noEnrolledResultsState.style.display = 'none';
        if (resultsTable) resultsTable.style.display = 'table';
      }
    }

    // Run filter on page load
    filterResultsByEnrollment();

    // Re-run filter whenever the user switches to the Results section
    const resultsNavBtn = document.querySelector('.nav-btn-optio[data-section="results"]');
    if (resultsNavBtn) {
      resultsNavBtn.addEventListener('click', function () {
        setTimeout(filterResultsByEnrollment, 50);
      });
    }

    // Also re-run when the user changes their enrollment (via enroll/unenroll)
    // Hook into the existing enroll/unenroll flow — after saveEnrollments()
    const originalSaveEnrollments = saveEnrollments;
    saveEnrollments = function () {
      originalSaveEnrollments();
      filterResultsByEnrollment();
    };

    // Wire up the "go enroll" buttons
    if (goEnrollLink) {
      goEnrollLink.addEventListener('click', function (e) {
        e.preventDefault();
        showSection('enroll');
      });
    }

    if (goEnrollBtn) {
      goEnrollBtn.addEventListener('click', function () {
        showSection('enroll');
      });
    }
    });
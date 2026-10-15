document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('admissionForm');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const errorMsg = document.getElementById('errorMsg');

    if (!form) return;

    /* ============================================================
       HELPERS
       ============================================================ */

    function markError(field) {
        if (!field) return;
        field.style.borderColor = '#ef4444';
        field.style.background = '#fef2f2';

        const wrapper = field.closest('.input-wrapper');
        if (wrapper) wrapper.classList.add('error');

        const group = field.closest('.form-group');
        if (group) {
            const err = group.querySelector('.error-msg');
            if (err) err.classList.add('visible');
        }
    }

    function clearError(field) {
        if (!field) return;
        field.style.borderColor = '';
        field.style.background = '';

        const wrapper = field.closest('.input-wrapper');
        if (wrapper) wrapper.classList.remove('error');

        const group = field.closest('.form-group');
        if (group) {
            const err = group.querySelector('.error-msg');
            if (err) err.classList.remove('visible');
        }
    }

    function clearAllErrors() {
        form.querySelectorAll('input, select, textarea').forEach(clearError);
    }

    function showToast(type, message) {
        if (!toast) return;

        if (type === 'success') {
            toast.classList.remove('show-error');
            toast.classList.add('show-success');
            if (toastMsg) toastMsg.style.display = 'block';
            if (errorMsg) errorMsg.style.display = 'none';
        } else {
            toast.classList.remove('show-success');
            toast.classList.add('show-error');
            if (toastMsg) toastMsg.style.display = 'none';
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
            }
        }
    }

    /* ============================================================
       CORE RULE DETECTION
       ============================================================ */

    // KCSE D- and below, or KCPE (primary certificate)
    function isGradeDorBelow(grade) {
        if (!grade) return false;
        const g = String(grade).toUpperCase().trim();

        // Explicitly D- and E
        if (g === 'KCSE D-') return true;
        if (g === 'KCSE E')  return true;
        if (g === 'E')       return true;

        // KCPE = primary level = below KCSE D-
        if (g === 'KCPE') return true;

        // Catch any string that contains "D-" but not "D+"
        if (g.includes('D-') && !g.includes('D+')) return true;

        return false;
    }

    // Any ICT-related course name
    function isICTCourse(course) {
        if (!course) return false;
        const c = String(course).toUpperCase();
        return (
            c.includes('ICT') ||
            c.includes('COMPUTER') ||
            c.includes('INFORMATION') ||
            c.includes('SOFTWARE') ||
            c.includes('NETWORK') ||
            c.includes('IT ') ||
            c.endsWith(' IT')
        );
    }

    // Level 5 (Roman or Arabic, word or digit)
    function isLevel5OrHigher(level) {
        if (!level) return false;
        const l = String(level).toUpperCase().trim();

        if (l.includes('LEVEL 5') || l === '5') return true;
        if (l.includes('LEVEL V') || l === 'V') return true;
        if (l.includes('FIVE')) return true;

        // Any numeric level above 5
        const num = l.match(/\d+/);
        if (num && Number(num[0]) > 5) return true;

        return false;
    }

    /* ============================================================
       THE RULE — Blocked on submit AND live
       ============================================================ */

    // Returns null if OK, or an error message string if blocked
    function checkICTLevel5Rule() {
        const courseField = form.querySelector('[name="courseApplied"]');
        const levelField  = form.querySelector('[name="level"]');
        const gradeField  = form.querySelector('[name="educationLevel"]');

        if (!courseField || !levelField || !gradeField) return null;

        const course = courseField.value;
        const level  = levelField.value;
        const grade  = gradeField.value;

        const isICT      = isICTCourse(course);
        const isLevel5   = isLevel5OrHigher(level);
        const isLowGrade = isGradeDorBelow(grade);

        if (isICT && isLevel5 && isLowGrade) {
            return 'You cannot enroll in ICT Level 5 with a KCSE grade of D- or below. Please choose Level 4 or lower, or pick a different course.';
        }

        return null;
    }

    // Live feedback while typing / selecting
    function runLiveRule() {
        const message = checkICTLevel5Rule();
        const courseField = form.querySelector('[name="courseApplied"]');
        const levelField  = form.querySelector('[name="level"]');
        const gradeField  = form.querySelector('[name="educationLevel"]');

        if (message) {
            markError(courseField);
            markError(levelField);
            markError(gradeField);
        } else {
            clearError(courseField);
            clearError(levelField);
            clearError(gradeField);
        }
    }

    ['[name="courseApplied"]', '[name="level"]', '[name="educationLevel"]'].forEach(function (sel) {
        const el = form.querySelector(sel);
        if (!el) return;
        el.addEventListener('change', runLiveRule);
        el.addEventListener('input', runLiveRule);
    });

    /* ============================================================
       SUBMIT HANDLER
       ============================================================ */

    form.addEventListener('submit', function (e) {
        clearAllErrors();

        let firstInvalid = null;
        let errorCount = 0;

        /* ---------- 1. THE ICT RULE FIRST ---------- */
        const ictMessage = checkICTLevel5Rule();
        if (ictMessage) {
            e.preventDefault();

            // Highlight the three relevant fields
            const courseField = form.querySelector('[name="courseApplied"]');
            const levelField  = form.querySelector('[name="level"]');
            const gradeField  = form.querySelector('[name="educationLevel"]');
            markError(courseField);
            markError(levelField);
            markError(gradeField);

            // Show the message in the toast
            showToast('error', ictMessage);

            // Scroll the education level field into view
            if (gradeField) {
                gradeField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                try { gradeField.focus({ preventScroll: true }); } catch (err) {}
            }

            // Stop here — do not run the rest
            return false;
        }

        /* ---------- 2. ALL OTHER REQUIRED FIELDS ---------- */
        const requiredFields = form.querySelectorAll('[required]');
        const seenRadioGroups = new Set();

        requiredFields.forEach(function (field) {
            if (field.type === 'radio') {
                const groupName = field.name;
                if (seenRadioGroups.has(groupName)) return;
                seenRadioGroups.add(groupName);

                const checked = form.querySelector(`input[name="${groupName}"]:checked`);
                if (!checked) {
                    form.querySelectorAll(`input[name="${groupName}"]`).forEach(markError);
                    errorCount++;
                    if (!firstInvalid) firstInvalid = field;
                }
                return;
            }

            if (field.type === 'checkbox') {
                if (!field.checked) {
                    markError(field);
                    errorCount++;
                    if (!firstInvalid) firstInvalid = field;
                }
                return;
            }

            if (field.type === 'file') return;

            const value = String(field.value || '').trim();
            if (!value) {
                markError(field);
                errorCount++;
                if (!firstInvalid) firstInvalid = field;
            }
        });

        /* ---------- 3. EMAIL ---------- */
        const emailField = form.querySelector('[name="studentEmail"]');
        if (emailField && emailField.value.trim()) {
            const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim());
            if (!ok) {
                markError(emailField);
                errorCount++;
                if (!firstInvalid) firstInvalid = emailField;
            }
        }

        /* ---------- 4. PHONE ---------- */
        const phoneField = form.querySelector('[name="studentTel"]');
        if (phoneField && phoneField.value.trim()) {
            const ok = /^[0-9+\-\s()]{9,15}$/.test(phoneField.value.trim());
            if (!ok) {
                markError(phoneField);
                errorCount++;
                if (!firstInvalid) firstInvalid = phoneField;
            }
        }

        /* ---------- 5. DATE OF BIRTH ---------- */
        const dobField = form.querySelector('[name="dateOfBirth"]');
        if (dobField && dobField.value) {
            const dob = new Date(dobField.value);
            const today = new Date();
            const age = (today - dob) / (1000 * 60 * 60 * 24 * 365.25);

            if (dob > today) {
                markError(dobField);
                errorCount++;
                if (!firstInvalid) firstInvalid = dobField;
            } else if (age < 14) {
                markError(dobField);
                errorCount++;
                if (!firstInvalid) firstInvalid = dobField;
            }
        }

        /* ---------- 6. STOP IF ANY OTHER ERRORS ---------- */
        if (errorCount > 0) {
            e.preventDefault();

            showToast(
                'error',
                `Please fix ${errorCount} field${errorCount > 1 ? 's' : ''} before submitting.`
            );

            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                try { firstInvalid.focus({ preventScroll: true }); } catch (err) {}
            }

            return false;
        }

        /* ---------- 7. ALL GOOD ---------- */
        showToast('success');
        return true;
    });

    /* ============================================================
       CLEAR ERROR STATE AS USER FIXES FIELDS
       ============================================================ */

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () { clearError(this); });
        field.addEventListener('change', function () { clearError(this); });
    });

    /* ============================================================
       RESET BUTTON
       ============================================================ */

    const resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            setTimeout(clearAllErrors, 0);
        });
    }

});
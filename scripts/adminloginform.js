document.addEventListener('DOMContentLoaded', function() {

            // ---------- DOM Elements ----------
            const form = document.getElementById('loginForm');
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            const usernameWrapper = document.getElementById('usernameWrapper');
            const passwordWrapper = document.getElementById('passwordWrapper');
            const usernameError = document.getElementById('usernameError');
            const passwordError = document.getElementById('passwordError');
            const loginBtn = document.getElementById('loginBtn');
            const togglePassword = document.getElementById('togglePassword');
            const rememberMe = document.getElementById('rememberMe');
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');

            // ---------- Toggle Password Visibility ----------
            let passwordVisible = false;
            togglePassword.addEventListener('click', function() {
                passwordVisible = !passwordVisible;
                passwordInput.type = passwordVisible ? 'text' : 'password';
                this.querySelector('i').className = passwordVisible ? 'fas fa-eye-slash' : 'fas fa-eye';
            });

            // ---------- Real-time Validation ----------
            usernameInput.addEventListener('blur', function() {
                validateField('username');
            });
            usernameInput.addEventListener('input', function() {
                if (this.value.trim()) {
                    clearError('username');
                }
            });

            passwordInput.addEventListener('blur', function() {
                validateField('password');
            });
            passwordInput.addEventListener('input', function() {
                if (this.value.trim()) {
                    clearError('password');
                }
            });

            function validateField(field) {
                if (field === 'username') {
                    const val = usernameInput.value.trim();
                    if (!val) {
                        showError('username', 'Please enter your username or email');
                        return false;
                    }
                    clearError('username');
                    return true;
                }
                if (field === 'password') {
                    const val = passwordInput.value.trim();
                    if (!val) {
                        showError('password', 'Please enter your password');
                        return false;
                    }
                    if (val.length < 6) {
                        showError('password', 'Password must be at least 6 characters');
                        return false;
                    }
                    clearError('password');
                    return true;
                }
                return true;
            }

            function showError(field, message) {
                if (field === 'username') {
                    usernameWrapper.classList.add('error');
                    usernameError.querySelector('span').textContent = message;
                    usernameError.classList.add('visible');
                } else if (field === 'password') {
                    passwordWrapper.classList.add('error');
                    passwordError.querySelector('span').textContent = message;
                    passwordError.classList.add('visible');
                }
            }

            function clearError(field) {
                if (field === 'username') {
                    usernameWrapper.classList.remove('error');
                    usernameError.classList.remove('visible');
                } else if (field === 'password') {
                    passwordWrapper.classList.remove('error');
                    passwordError.classList.remove('visible');
                }
            }

            // ---------- Form Submission ----------
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Validate all fields
                const isUsernameValid = validateField('username');
                const isPasswordValid = validateField('password');

                if (!isUsernameValid || !isPasswordValid) {
                    showToast('Please fix the errors above', 'error');
                    return;
                }

                const username = usernameInput.value.trim();

                // Show loading state
                loginBtn.classList.add('loading');
                loginBtn.disabled = true;

                // Simulate authentication request to the server
                setTimeout(function() {
                    loginBtn.classList.remove('loading');
                    loginBtn.disabled = false;


                    // Simulate success (any valid credentials are accepted in this demo)
                    showToast('Welcome back! Redirecting to dashboard...', 'success');

                    // Redirect after a moment
                    setTimeout(function() {
                        let username = usernameInput.value
                        let password = passwordInput.value
                        window.location.href = `/admin-dashboad/admin-data-form?name=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
                    }, 1500);

                }, 1200);
            });

            // ---------- Toast System ----------
            function showToast(message, type = 'info') {
                toastMessage.textContent = message;
                toast.className = 'toast';
                if (type === 'success') {
                    toast.classList.add('success');
                    toast.querySelector('i').className = 'fas fa-check-circle';
                } else if (type === 'error') {
                    toast.classList.add('error');
                    toast.querySelector('i').className = 'fas fa-exclamation-circle';
                } else {
                    toast.querySelector('i').className = 'fas fa-info-circle';
                }
                toast.classList.add('show');
                clearTimeout(toast._timeout);
                toast._timeout = setTimeout(function() {
                    toast.classList.remove('show');
                }, 4000);
            }

           

            // ---------- Enter key support ----------
            form.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    form.dispatchEvent(new Event('submit'));
                }
            });

            // ---------- Clean up on page unload ----------
            window.addEventListener('beforeunload', function() {
                if (toast._timeout) {
                    clearTimeout(toast._timeout);
                }
            });

        });
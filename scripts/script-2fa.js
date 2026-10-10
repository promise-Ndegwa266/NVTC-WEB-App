document.addEventListener('DOMContentLoaded', function() {

    const inputs = document.querySelectorAll('.code-input');
    const form = document.getElementById('twoFactorForm');
    const verifyBtn = document.getElementById('verifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resendBtn = document.getElementById('resendBtn');
    const statusMessage = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const usernameInput = document.getElementById('username');
    const admitionInput = document.getElementById('admition');

    let toastTimeout;

    function showToast(msg, type) {
        toastMsg.textContent = msg;
        toast.className = 'toast';
        toast.classList.add(type === 'success' ? 'success' : type === 'error' ? 'error' : '');
        toast.querySelector('i').className = type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function() { toast.classList.remove('show'); }, 3500);
    }

    function setStatus(msg, type) {
        statusMessage.className = 'status-message show ' + type;
        statusText.textContent = msg;
    }

    function clearStatus() {
        statusMessage.className = 'status-message';
        statusMessage.classList.remove('show', 'error', 'success', 'info');
    }

    function getCode() {
        let code = '';
        inputs.forEach(function(input) { code += input.value; });
        return code;
    }

    let twoFactorCode = '';

    inputs.forEach(function(input, index) {
        input.addEventListener('input', function() {
            twoFactorCode = getCode();
            clearStatus();
            this.classList.remove('error', 'success');
            if (this.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            if (twoFactorCode.length === inputs.length) {
                setTimeout(function() { form.dispatchEvent(new Event('submit')); }, 300);
            }
        });

        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                inputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keypress', function(e) {
            if (!/[0-9]/.test(String.fromCharCode(e.which))) {
                e.preventDefault();
            }
        });

        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const digits = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, inputs.length);
            digits.split('').forEach(function(d, i) { if (i < inputs.length) inputs[i].value = d; });
            twoFactorCode = getCode();
            clearStatus();
            const nextEmpty = Array.from(inputs).findIndex(function(inp) { return inp.value.length === 0; });
            if (nextEmpty !== -1) inputs[nextEmpty].focus();
            else {
                inputs[inputs.length - 1].focus();
                setTimeout(function() { form.dispatchEvent(new Event('submit')); }, 300);
            }
        });

        input.addEventListener('focus', function() { this.select(); });
    });

    form.addEventListener('submit',async function(e) {
        e.preventDefault();
        const code = twoFactorCode;
        if (code.length < inputs.length) {
            setStatus('Please enter all 6 digits.', 'error');
            inputs.forEach(function(input, i) { if (!input.value) input.classList.add('error'); });
            showToast('Please enter all 6 digits.', 'error');
            return;
        }
        window.location.href = `/authorizetion/two_factor_auth_data/${usernameInput.value}/${admitionInput.value}/${code}`;
        
    });

    clearBtn.addEventListener('click', function() {
        inputs.forEach(function(input) { input.value = ''; input.classList.remove('error', 'success'); });
        twoFactorCode = '';
        clearStatus();
        inputs[0].focus();
        showToast('Cleared all fields.', 'info');
    });
    //////////////////////
    //////////////////////
    resendBtn.addEventListener('click', function() {
        window.location.href = '/authorizetion/resend-code/' + usernameInput.value + '/' + admitionInput.value;
    });

    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    });

    document.querySelector('.card').addEventListener('click', function(e) {
        if (!e.target.closest('input') && !e.target.closest('button')) {
            const firstEmpty = Array.from(inputs).findIndex(function(inp) { return inp.value.length === 0; });
            inputs[firstEmpty !== -1 ? firstEmpty : 0].focus();
        }
    });

    setTimeout(function() { inputs[0].focus(); }, 300);
});
// window.location.href = 'dashboard.html'
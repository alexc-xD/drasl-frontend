// UI helpers
const UI = {
    showError(message) {
        const errorEl = document.querySelector('.error-message');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    },

    showSuccess(message) {
        const successEl = document.querySelector('.success-message');
        if (successEl) {
            successEl.textContent = message;
            successEl.style.display = 'block';
        }
    },

    hideMessages() {
        document.querySelectorAll('.error-message, .success-message').forEach(el => {
            el.style.display = 'none';
        });
    },

    setLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Loading...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent;
        }
    },
};

// Form handlers
document.addEventListener('DOMContentLoaded', () => {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.hideMessages();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            UI.setLoading(submitBtn, true);

            try {
                const response = await DraslAPI.login(username, password);
                if (response.ok || response.redirected) {
                    window.location.href = '/account.html';
                } else {
                    UI.showError('Invalid username or password');
                }
            } catch (err) {
                UI.showError('Connection error. Please try again.');
            } finally {
                UI.setLoading(submitBtn, false);
            }
        });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.hideMessages();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const submitBtn = registerForm.querySelector('button[type="submit"]');

            if (password !== confirmPassword) {
                UI.showError('Passwords do not match');
                return;
            }

            UI.setLoading(submitBtn, true);

            try {
                const response = await DraslAPI.register(username, password);
                if (response.ok || response.redirected) {
                    window.location.href = '/login.html?registered=1';
                } else {
                    UI.showError('Registration failed. Username may be taken.');
                }
            } catch (err) {
                UI.showError('Connection error. Please try again.');
            } finally {
                UI.setLoading(submitBtn, false);
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await DraslAPI.logout();
            window.location.href = '/';
        });
    }

    // Change password form
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            UI.hideMessages();

            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-new-password').value;
            const submitBtn = passwordForm.querySelector('button[type="submit"]');

            if (newPassword !== confirmPassword) {
                UI.showError('New passwords do not match');
                return;
            }

            UI.setLoading(submitBtn, true);

            try {
                const response = await DraslAPI.changePassword(oldPassword, newPassword);
                if (response.ok) {
                    UI.showSuccess('Password changed successfully');
                    passwordForm.reset();
                } else {
                    UI.showError('Failed to change password');
                }
            } catch (err) {
                UI.showError('Connection error. Please try again.');
            } finally {
                UI.setLoading(submitBtn, false);
            }
        });
    }

    // Check for URL params
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
        UI.showSuccess('Registration successful! Please log in.');
    }
});

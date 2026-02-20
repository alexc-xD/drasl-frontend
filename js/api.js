// Drasl API wrapper
const DraslAPI = {
    // Make a POST request with form data
    async post(endpoint, data) {
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }

        const response = await fetch(CONFIG.API_BASE + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
            credentials: 'include',  // Include cookies for session
        });

        return response;
    },

    // Make a GET request
    async get(endpoint) {
        const response = await fetch(CONFIG.API_BASE + endpoint, {
            method: 'GET',
            credentials: 'include',
        });

        return response;
    },

    // Auth methods
    async login(username, password, returnUrl = '/') {
        return this.post(CONFIG.ENDPOINTS.LOGIN, {
            username,
            password,
            returnUrl,
        });
    },

    async logout() {
        return this.post(CONFIG.ENDPOINTS.LOGOUT, {});
    },

    async register(username, password) {
        return this.post(CONFIG.ENDPOINTS.REGISTER, {
            username,
            password,
        });
    },

    // Account methods
    async changePassword(oldPassword, newPassword) {
        return this.post(CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
            oldPassword,
            newPassword,
        });
    },

    async deleteAccount(password) {
        return this.post(CONFIG.ENDPOINTS.DELETE_USER, {
            password,
        });
    },

    // Check if user is logged in by trying to access user page
    async checkAuth() {
        const response = await this.get(CONFIG.ENDPOINTS.USER);
        return response.ok;
    },
};

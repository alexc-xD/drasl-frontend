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
            credentials: 'include',
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

    // Parse user data from /web/user HTML response
    parseUserHTML(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const user = {
            username: null,
            uuid: null,
            isAdmin: false,
            minecraftToken: null,
            apiToken: null,
            preferredLanguage: null,
            players: [],
        };

        // Get username from h1
        const h1 = doc.querySelector('h1');
        if (h1) {
            user.username = h1.textContent.trim();
        }

        // Get UUID from hidden input
        const uuidInput = doc.querySelector('input[name="uuid"]');
        if (uuidInput) {
            user.uuid = uuidInput.value;
        }

        // Get Minecraft Token
        const mcTokenInput = doc.querySelector('#minecraft-token');
        if (mcTokenInput) {
            user.minecraftToken = mcTokenInput.value;
        }

        // Get API Token
        const apiTokenInput = doc.querySelector('#api-token');
        if (apiTokenInput) {
            user.apiToken = apiTokenInput.value;
        }

        // Get preferred language
        const langSelect = doc.querySelector('#preferred-language');
        if (langSelect) {
            user.preferredLanguage = langSelect.value;
        }

        // Check if admin (look for admin link in header)
        const adminLink = doc.querySelector('a[href*="/web/admin"]');
        if (adminLink) {
            user.isAdmin = true;
        }

        // Get players from table
        const playerRows = doc.querySelectorAll('tbody tr');
        playerRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 3) {
                const nameLink = cells[1]?.querySelector('a');
                const uuidCell = cells[2];
                
                if (nameLink && uuidCell) {
                    const playerUuid = uuidCell.textContent.trim();
                    const playerName = nameLink.textContent.trim();
                    const playerUrl = nameLink.getAttribute('href');
                    
                    // Extract skin URL from style if present
                    const skinDiv = row.querySelector('.list-profile-picture');
                    let skinUrl = null;
                    if (skinDiv) {
                        const style = skinDiv.getAttribute('style');
                        if (style) {
                            const match = style.match(/url\(([^)]+)\)/);
                            if (match) {
                                skinUrl = match[1];
                            }
                        }
                    }

                    user.players.push({
                        uuid: playerUuid,
                        name: playerName,
                        url: playerUrl,
                        skinUrl: skinUrl,
                    });
                }
            }
        });

        return user;
    },

    // Get current user by fetching and parsing /web/user
    async getCurrentUser() {
        try {
            const response = await this.get(CONFIG.ENDPOINTS.USER);
            
            // If redirected to login, user is not authenticated
            if (response.redirected || !response.ok) {
                return null;
            }

            const html = await response.text();
            
            // Check if we got the login page instead
            if (html.includes('name="password"') && html.includes('Log in')) {
                return null;
            }

            return this.parseUserHTML(html);
        } catch (e) {
            console.warn('Failed to get user:', e);
            return null;
        }
    },

    // Check auth status
    async isLoggedIn() {
        const user = await this.getCurrentUser();
        return user !== null;
    },

    // Account methods
    async updateUser(data) {
        return this.post(CONFIG.ENDPOINTS.UPDATE_USER, data);
    },

    async deleteUser(uuid) {
        return this.post(CONFIG.ENDPOINTS.DELETE_USER, { uuid });
    },

    // Player methods
    async createPlayer(userUuid, playerName, playerUuid = '') {
        return this.post(CONFIG.ENDPOINTS.CREATE_PLAYER, {
            userUuid,
            playerName,
            playerUuid,
        });
    },

    async deletePlayer(uuid) {
        return this.post(CONFIG.ENDPOINTS.DELETE_PLAYER, { uuid });
    },
};

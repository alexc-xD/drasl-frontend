// Drasl API Configuration
const CONFIG = {
    // Base URL of your Drasl instance (no trailing slash)
    API_BASE: '',  // Empty string = same domain, or set to 'https://auth.example.com'
    
    // Endpoints (these match Drasl's routes)
    ENDPOINTS: {
        LOGIN: '/web/login',
        LOGOUT: '/web/logout',
        REGISTER: '/web/register',
        USER: '/web/user',
        DELETE_USER: '/web/delete-user',
        CHANGE_PASSWORD: '/web/change-password',
    }
};

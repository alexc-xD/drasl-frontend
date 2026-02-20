// Drasl API Configuration
const CONFIG = {
    // Base URL of your Drasl instance (no trailing slash)
    API_BASE: '',  // Empty string = same domain
    
    // Endpoints (from Drasl's routes)
    ENDPOINTS: {
        // Auth
        LOGIN: '/web/login',
        LOGOUT: '/web/logout',
        REGISTER: '/web/register',
        
        // User
        USER: '/web/user',
        UPDATE_USER: '/web/update-user',
        DELETE_USER: '/web/delete-user',
        
        // Players
        CREATE_PLAYER: '/web/create-player',
        DELETE_PLAYER: '/web/delete-player',
        PLAYER: '/web/player',  // + /{uuid}
    }
};

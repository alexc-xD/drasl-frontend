# Drasl Frontend

A standalone frontend for [Drasl](https://github.com/unmojang/drasl) authentication server.

## Project Structure

```
drasl-frontend/
├── index.html          # Landing page
├── login.html          # Login page
├── register.html       # Registration page
├── account.html        # Account management
├── css/
│   └── style.css       # Styles
├── js/
│   ├── config.js       # API configuration
│   ├── api.js          # Drasl API wrapper
│   └── main.js         # UI/form handling
└── images/
    └── logo.png        # Your logo (add this)
```

## Setup

### 1. Configure Drasl

In your Drasl `config.toml`, disable the built-in frontend:

```toml
EnableFrontEnd = false
```

### 2. Configure This Frontend

Edit `js/config.js` if needed. For same-domain deployment, leave `API_BASE` empty:

```js
const CONFIG = {
    API_BASE: '',  // Empty = same domain
    // ...
};
```

### 3. Reverse Proxy Setup (Nginx Example)

```nginx
server {
    listen 443 ssl;
    server_name auth.example.com;

    # Serve static frontend
    location / {
        root /path/to/drasl-frontend;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API routes to Drasl
    location /web/ {
        proxy_pass http://localhost:25585;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Proxy auth endpoints
    location /auth/ {
        proxy_pass http://localhost:25585;
        proxy_set_header Host $host;
    }

    location /session/ {
        proxy_pass http://localhost:25585;
        proxy_set_header Host $host;
    }

    location /account/ {
        proxy_pass http://localhost:25585;
        proxy_set_header Host $host;
    }

    location /services/ {
        proxy_pass http://localhost:25585;
        proxy_set_header Host $host;
    }
}
```

### 4. Add Your Assets

Place your logo at `images/logo.png`.

## Drasl API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/web/login` | POST | User login |
| `/web/logout` | POST | User logout |
| `/web/register` | POST | User registration |
| `/web/user` | GET | Get user info |
| `/web/change-password` | POST | Change password |

## Customization

- Edit `css/style.css` for styling
- Edit HTML files to add/remove content
- Edit `js/config.js` to change endpoints if Drasl changes

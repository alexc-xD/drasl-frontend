// Simple i18n system
const I18n = {
    locale: 'en',
    translations: {},

    // Load translations for a locale
    async load(locale) {
        try {
            const response = await fetch(`/lang/${locale}.json`);
            if (response.ok) {
                this.translations = await response.json();
                this.locale = locale;
                return true;
            }
        } catch (e) {
            console.warn(`Failed to load locale: ${locale}`);
        }
        return false;
    },

    // Translate a string (like Drasl's .T function)
    T(key, ...args) {
        let text = this.translations[key] || key;
        
        // Replace %s placeholders with args
        args.forEach((arg, i) => {
            text = text.replace('%s', arg);
        });
        
        return text;
    },

    // Detect browser language
    detectLocale() {
        const browserLang = navigator.language?.split('-')[0] || 'en';
        return browserLang;
    },

    // Apply translations to the page
    applyToPage() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            el.textContent = this.T(key);
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.T(key);
        });

        document.querySelectorAll('[data-i18n-value]').forEach(el => {
            const key = el.getAttribute('data-i18n-value');
            el.value = this.T(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.getAttribute('data-i18n-title');
            el.title = this.T(key);
        });
    },

    // Initialize with auto-detection
    async init(fallback = 'en') {
        const locale = this.detectLocale();
        const loaded = await this.load(locale);
        if (!loaded && locale !== fallback) {
            await this.load(fallback);
        }
        this.applyToPage();
    }
};

// Shorthand function
function T(key, ...args) {
    return I18n.T(key, ...args);
}

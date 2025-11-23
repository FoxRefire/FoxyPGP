// i18n utility functions
export function t(messageName, substitutions = null) {
    return chrome.i18n.getMessage(messageName, substitutions);
}

export function translateDocument() {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageName = element.getAttribute('data-i18n');
        const text = t(messageName);
        if (text) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = text;
            } else {
                element.textContent = text;
            }
        }
    });

    // Translate placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const messageName = element.getAttribute('data-i18n-placeholder');
        const text = t(messageName);
        if (text) {
            element.placeholder = text;
        }
    });

    // Translate title attributes
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const messageName = element.getAttribute('data-i18n-title');
        const text = t(messageName);
        if (text) {
            element.title = text;
        }
    });

    // Translate tooltip data attributes
    document.querySelectorAll('[data-i18n-tooltip]').forEach(element => {
        const messageName = element.getAttribute('data-i18n-tooltip');
        const text = t(messageName);
        if (text) {
            element.setAttribute('data-tooltip', text);
        }
    });
}


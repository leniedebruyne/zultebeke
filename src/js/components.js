/**
 * Component Loader
 * Loads and inserts reusable header and footer components
 */

async function loadComponents() {
    try {
        // Load and insert header
        const headerResponse = await fetch('/zultebeke/src/components/nav.html');
        const headerHTML = await headerResponse.text();
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            headerPlaceholder.innerHTML = headerHTML;
        }

        // Load and insert footer
        const footerResponse = await fetch('/zultebeke/src/components/footer.html');
        const footerHTML = await footerResponse.text();
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            footerPlaceholder.innerHTML = footerHTML;
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Load components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadComponents);
} else {
    loadComponents();
}

const MOBILE_BREAKPOINT = 767;

const initMobileNav = () => {
    const header = document.querySelector('.header');
    const toggleButton = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');

    if (!header || !toggleButton || !nav) {
        return;
    }

    header.setAttribute('data-mobile-nav', 'ready');

    const closeMenu = () => {
        header.classList.remove('header--menu-open');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-label', 'Open navigatie');
    };

    const openMenu = () => {
        header.classList.add('header--menu-open');
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.setAttribute('aria-label', 'Sluit navigatie');
    };

    closeMenu();

    toggleButton.addEventListener('click', () => {
        if (header.classList.contains('header--menu-open')) {
            closeMenu();
            return;
        }

        openMenu();
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                closeMenu();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > MOBILE_BREAKPOINT) {
            closeMenu();
        }
    });
};

window.addEventListener('DOMContentLoaded', initMobileNav);

import { gsap } from 'gsap';
import { initSiteAnimations } from './site-animations.js';

const MOBILE_BREAKPOINT = 767;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const whenReady = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
        return;
    }

    callback();
};

const initMobileNav = () => {
    const header = document.querySelector('.header');
    const toggleButton = document.querySelector('.header__menu-toggle');
    const nav = document.querySelector('.header__nav');

    if (!header || !toggleButton || !nav) {
        return;
    }

    header.setAttribute('data-mobile-nav', 'ready');
    const navLinks = Array.from(nav.querySelectorAll('a'));
    let closeTween = null;

    const closeMenu = () => {
        if (!header.classList.contains('header--menu-open')) {
            return;
        }

        if (prefersReducedMotion) {
            header.classList.remove('header--menu-open');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-label', 'Open navigatie');
            return;
        }

        closeTween?.kill();
        closeTween = gsap.to(navLinks, {
            autoAlpha: 0,
            y: -4,
            duration: 0.18,
            stagger: 0.03,
            ease: 'power2.out',
            onComplete: () => {
                header.classList.remove('header--menu-open');
                toggleButton.setAttribute('aria-expanded', 'false');
                toggleButton.setAttribute('aria-label', 'Open navigatie');
                gsap.set(navLinks, { clearProps: 'all' });
            },
        });
    };

    const openMenu = () => {
        if (header.classList.contains('header--menu-open')) {
            return;
        }

        closeTween?.kill();
        header.classList.remove('header--menu-open');
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.setAttribute('aria-label', 'Open navigatie');
        header.classList.add('header--menu-open');
        toggleButton.setAttribute('aria-expanded', 'true');
        toggleButton.setAttribute('aria-label', 'Sluit navigatie');

        if (prefersReducedMotion) {
            return;
        }

        gsap.fromTo(navLinks, {
            autoAlpha: 0,
            y: -4,
        }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.34,
            stagger: 0.05,
            ease: 'power2.out',
            overwrite: 'auto',
        });
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

whenReady(() => {
    initMobileNav();
    initSiteAnimations();
});

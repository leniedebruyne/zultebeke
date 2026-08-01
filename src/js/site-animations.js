import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const MOBILE_BREAKPOINT = 767;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const getDistance = (desktopDistance, mobileDistance = Math.round(desktopDistance * 0.6)) => (
    window.innerWidth <= MOBILE_BREAKPOINT ? mobileDistance : desktopDistance
);

const reveal = (targets, trigger, options = {}) => {
    if (!targets || !trigger) {
        return;
    }

    const targetList = targets.length !== undefined ? targets : [targets];

    if (targetList.length === 0) {
        return;
    }

    const {
        from = {},
        duration = 0.9,
        stagger = 0,
        start = 'top 78%',
        end,
        scrub = false,
        once = true,
        delay = 0,
        ease = 'power2.out',
    } = options;

    const tweenVars = {
        autoAlpha: 0,
        duration,
        stagger,
        ease,
        ...from,
        scrollTrigger: {
            trigger,
            start,
            once,
            scrub,
        },
    };

    if (end) {
        tweenVars.scrollTrigger.end = end;
    }

    if (delay) {
        tweenVars.delay = delay;
    }

    return gsap.from(targetList, tweenVars);
};

const revealSplitSection = (section, content, media, contentFrom, mediaFrom, options = {}) => {
    if (!section || !content || !media) {
        return;
    }

    const timeline = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: options.start || 'top 76%',
            once: true,
        },
    });

    timeline.from(content, {
        autoAlpha: 0,
        duration: options.contentDuration || 0.85,
        ease: 'power2.out',
        ...contentFrom,
    });

    timeline.from(media, {
        autoAlpha: 0,
        duration: options.mediaDuration || 0.85,
        ease: 'power2.out',
        stagger: options.mediaStagger || 0,
        ...mediaFrom,
    }, options.mediaOverlap || '-=0.5');
};

const addHoverMotion = () => {
    if (!prefersFinePointer || prefersReducedMotion) {
        return;
    }

    const hoverTargets = [
        '.header__nav-link',
        '.artist-card__link',
        '.gallery__item',
        '.gallery-section__item',
        '.artists__gallery-item',
        '.inspiration__gallery-item',
        '.footer__icon',
    ];

    hoverTargets.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
            let hoverTween = null;

            element.addEventListener('pointerenter', () => {
                hoverTween?.kill();
                hoverTween = gsap.to(element, {
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    y: getDistance(-2, -1),
                    scale: 1.02,
                });
            });

            element.addEventListener('pointerleave', () => {
                hoverTween?.kill();
                hoverTween = gsap.to(element, {
                    duration: 0.28,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    y: 0,
                    scale: 1,
                    clearProps: 'filter',
                });
            });
        });
    });
};

const initHeroMotion = () => {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero__content');
    const heroImage = document.querySelector('.hero__image');

    if (heroContent) {
        gsap.from(heroContent, {
            autoAlpha: 0,
            y: getDistance(34, 22),
            duration: 1,
            ease: 'power3.out',
        });
    }

    if (hero && heroImage) {
        gsap.fromTo(heroImage, {
            scale: 1.06,
        }, {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: hero,
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8,
            },
        });
    }
};

const initSharedMotion = () => {
    const footer = document.querySelector('.footer');
    const footerItems = document.querySelectorAll('.footer__col, .footer__brand');
    const contactLink = document.querySelector('.header__nav-link[href$="#contact"]');

    if (footer && footerItems.length > 0) {
        reveal(footerItems, footer, {
            from: { y: getDistance(24, 16) },
            stagger: 0.08,
            start: 'top 85%',
            duration: 0.8,
        });
    }

    if (footer && contactLink) {
        ScrollTrigger.create({
            trigger: footer,
            start: 'top 70%',
            end: 'bottom bottom',
            onEnter: () => contactLink.classList.add('is-active'),
            onEnterBack: () => contactLink.classList.add('is-active'),
            onLeave: () => contactLink.classList.remove('is-active'),
            onLeaveBack: () => contactLink.classList.remove('is-active'),
        });
    }
};

const initHomeMotion = () => {
    const introduction = document.querySelector('.introduction');
    const introductionHeading = document.querySelector('.introduction__heading');
    const introductionText = document.querySelector('.introduction__text');
    const artists = document.querySelector('.artists');
    const artistsContent = document.querySelector('.artists__content');
    const artistsGalleryItems = document.querySelectorAll('.artists__gallery-item');
    const gallery = document.querySelector('.gallery');
    const galleryHeading = document.querySelector('.gallery__heading');
    const gallerySubtitle = document.querySelector('.gallery__subtitle');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const meetArtists = document.querySelector('.meet-artists');
    const meetArtistsHeading = document.querySelector('.meet-artists__heading');
    const artistCards = document.querySelectorAll('.artist-card');

    if (introduction && introductionHeading && introductionText) {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: introduction,
                start: 'top 78%',
                once: true,
            },
        });

        timeline.from(introductionHeading, {
            autoAlpha: 0,
            y: getDistance(28, 18),
            duration: 0.9,
            ease: 'power2.out',
        }).from(introductionText, {
            autoAlpha: 0,
            y: getDistance(24, 16),
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.55');
    }

    if (artists && artistsContent && artistsGalleryItems.length > 0) {
        revealSplitSection(
            artists,
            artistsContent,
            artistsGalleryItems,
            { x: getDistance(-28, -18) },
            { y: getDistance(26, 18) },
            { start: 'top 76%', mediaStagger: 0.12, mediaOverlap: '-=0.55' },
        );
    }

    if (gallery && galleryHeading && gallerySubtitle && galleryItems.length > 0) {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: gallery,
                start: 'top 74%',
                once: true,
            },
        });

        timeline.from([galleryHeading, gallerySubtitle], {
            autoAlpha: 0,
            y: getDistance(22, 16),
            stagger: 0.08,
            duration: 0.8,
            ease: 'power2.out',
        }).from(galleryItems, {
            autoAlpha: 0,
            y: getDistance(28, 18),
            stagger: 0.08,
            duration: 0.85,
            ease: 'power2.out',
        }, '-=0.45');
    }

    if (meetArtists && meetArtistsHeading && artistCards.length > 0) {
        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: meetArtists,
                start: 'top 74%',
                once: true,
            },
        });

        timeline.from(meetArtistsHeading, {
            autoAlpha: 0,
            y: getDistance(20, 14),
            duration: 0.8,
            ease: 'power2.out',
        }).from(artistCards, {
            autoAlpha: 0,
            y: getDistance(30, 18),
            stagger: 0.14,
            duration: 0.9,
            ease: 'power2.out',
        }, '-=0.45');
    }
};

const initDetailMotion = () => {
    const aboutSection = document.querySelector('.about');
    const aboutContent = document.querySelector('.about__content');
    const aboutImage = document.querySelector('.about__image');
    const aboutContainer = document.querySelector('.about__container');

    if (aboutSection && aboutContent && aboutImage && aboutContainer) {
        const imageIsLeft = aboutContainer.classList.contains('about__container--reverse');
        revealSplitSection(
            aboutSection,
            aboutContent,
            aboutImage,
            { x: imageIsLeft ? getDistance(26, 18) : getDistance(-26, -18) },
            { x: imageIsLeft ? getDistance(-26, -18) : getDistance(26, 18) },
        );
    }

    const inspirationSection = document.querySelector('.inspiration');
    const inspirationContent = document.querySelector('.inspiration__content');
    const inspirationGallery = document.querySelector('.inspiration__gallery');
    const inspirationContainer = document.querySelector('.inspiration__container');

    if (inspirationSection && inspirationContent && inspirationGallery && inspirationContainer) {
        const contentIsLeft = inspirationContainer.firstElementChild === inspirationContent;
        revealSplitSection(
            inspirationSection,
            inspirationContent,
            inspirationGallery,
            { x: contentIsLeft ? getDistance(-26, -18) : getDistance(26, 18) },
            { x: contentIsLeft ? getDistance(26, 18) : getDistance(-26, -18) },
        );
    }

    const philosophySection = document.querySelector('.philosophy');
    const philosophyContent = document.querySelector('.philosophy__content');
    const philosophyImage = document.querySelector('.philosophy__image');

    if (philosophySection && philosophyContent && philosophyImage) {
        revealSplitSection(
            philosophySection,
            philosophyContent,
            philosophyImage,
            { x: getDistance(-24, -16) },
            { x: getDistance(24, 16) },
        );
    }

    const storySection = document.querySelector('.story');
    const storyContent = document.querySelector('.story__content');
    const storyImage = document.querySelector('.story__image');

    if (storySection && storyContent && storyImage) {
        revealSplitSection(
            storySection,
            storyContent,
            storyImage,
            { x: getDistance(-24, -16) },
            { x: getDistance(24, 16) },
        );
    }

    const gallerySection = document.querySelector('.gallery-section');
    const galleryHeading = document.querySelector('.gallery-section__heading');
    const galleryItems = document.querySelectorAll('.gallery-section__item');

    if (gallerySection && galleryHeading && galleryItems.length > 0) {
        revealSplitSection(
            gallerySection,
            galleryHeading,
            galleryItems,
            { y: getDistance(20, 14) },
            { y: getDistance(24, 16) },
            { start: 'top 74%', mediaStagger: 0.08, mediaOverlap: '-=0.45' },
        );
    }
};

const initMotion = () => {
    if (window.__zultebekeMotionInitialized) {
        return;
    }

    window.__zultebekeMotionInitialized = true;

    if (prefersReducedMotion) {
        return;
    }

    initHeroMotion();
    initSharedMotion();

    const page = document.documentElement.dataset.page;

    if (page === 'home') {
        initHomeMotion();
    } else {
        initDetailMotion();
    }

    addHoverMotion();

    let resizeTimer = null;

    window.addEventListener('resize', () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            ScrollTrigger.refresh();
        }, 150);
    });

    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    }, { once: true });
};

export const initSiteAnimations = () => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMotion, { once: true });
        return;
    }

    initMotion();
};
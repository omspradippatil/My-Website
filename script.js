(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const siteNav = document.querySelector(".site-nav");
    const navToggle = document.getElementById("nav-toggle");
    const navLinks = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));

    const progressBar = document.getElementById("progress-bar");
    const topBtn = document.getElementById("top-btn");
    const revealEls = Array.from(document.querySelectorAll(".reveal"));

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    let scrollTicking = false;

    function updateScrollUI() {
        scrollTicking = false;

        const scrolled = window.scrollY || window.pageYOffset;
        const total = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const progress = clamp((scrolled / total) * 100, 0, 100);

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (topBtn) {
            topBtn.classList.toggle("show", scrolled > 280);
        }

        if (siteNav) {
            siteNav.classList.toggle("is-scrolled", scrolled > 6);
        }
    }

    function onScroll() {
        if (scrollTicking) {
            return;
        }

        scrollTicking = true;
        requestAnimationFrame(updateScrollUI);
    }

    function setupScrollReveal() {
        if (!revealEls.length) {
            return;
        }

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealEls.forEach((el) => el.classList.add("visible"));
            return;
        }

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.14,
                rootMargin: "0px 0px -10% 0px"
            }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    }

    function setupPillPopIn() {
        const groupIds = ["lang-pills", "fw-pills", "db-pills", "domain-pills"];

        groupIds.forEach((id) => {
            const group = document.getElementById(id);
            if (!group) {
                return;
            }

            const pills = group.querySelectorAll(".pill");
            if (!pills.length) {
                return;
            }

            if (prefersReducedMotion) {
                pills.forEach((pill) => pill.classList.add("popped"));
                return;
            }

            if (!("IntersectionObserver" in window)) {
                pills.forEach((pill) => pill.classList.add("popped"));
                return;
            }

            const observer = new IntersectionObserver(
                (entries, io) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }

                        pills.forEach((pill, index) => {
                            window.setTimeout(() => {
                                pill.classList.add("popped");
                            }, index * 50);
                        });

                        io.unobserve(entry.target);
                    });
                },
                { threshold: 0.12 }
            );

            observer.observe(group);
        });
    }

    function setupSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (event) => {
                const href = anchor.getAttribute("href");

                if (!href || href === "#") {
                    event.preventDefault();
                    return;
                }

                const target = document.querySelector(href);
                if (!target) {
                    return;
                }

                event.preventDefault();

                const navOffset = siteNav ? siteNav.getBoundingClientRect().height + 24 : 0;
                const y = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

                window.scrollTo({
                    top: Math.max(0, y),
                    behavior: prefersReducedMotion ? "auto" : "smooth"
                });

                if (siteNav && siteNav.classList.contains("open")) {
                    siteNav.classList.remove("open");
                    navToggle?.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    function setupMobileNav() {
        if (!siteNav || !navToggle) {
            return;
        }

        navToggle.addEventListener("click", () => {
            const open = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", (event) => {
            if (!siteNav.classList.contains("open")) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Node)) {
                return;
            }

            if (!siteNav.contains(target)) {
                siteNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900 && siteNav.classList.contains("open")) {
                siteNav.classList.remove("open");
                navToggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function setupActiveNavLink() {
        if (!navLinks.length || !("IntersectionObserver" in window)) {
            return;
        }

        const sectionMap = navLinks
            .map((link) => {
                const href = link.getAttribute("href");
                if (!href || href === "#") {
                    return null;
                }

                const section = document.querySelector(href);
                if (!section) {
                    return null;
                }

                return { link, section };
            })
            .filter(Boolean);

        if (!sectionMap.length) {
            return;
        }

        const activate = (sectionId) => {
            sectionMap.forEach(({ link, section }) => {
                link.classList.toggle("active", section.id === sectionId);
            });
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        activate(entry.target.id);
                    }
                });
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0.1
            }
        );

        sectionMap.forEach(({ section }) => observer.observe(section));
    }

    function setupGlobalStaggerAnimations() {
        const targets = Array.from(
            document.querySelectorAll(
                ".hero-actions .btn, .hero-card li, .info-card, .contact-item, .list li, .pdf-frame, footer, .socials a"
            )
        );

        if (!targets.length) {
            return;
        }

        targets.forEach((element, index) => {
            element.classList.add("animate-on-scroll");
            element.style.setProperty("--stagger", String(index % 10));
        });

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            targets.forEach((element) => element.classList.add("animated-in"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, io) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("animated-in");
                    io.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        targets.forEach((element) => observer.observe(element));
    }

    function setupTopButton() {
        if (!topBtn) {
            return;
        }

        topBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    function init() {
        setupMobileNav();
        setupActiveNavLink();
        setupScrollReveal();
        setupGlobalStaggerAnimations();
        setupPillPopIn();
        setupSmoothAnchors();
        setupTopButton();

        updateScrollUI();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    document.addEventListener("DOMContentLoaded", init);
})();

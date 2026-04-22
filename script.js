(() => {
    "use strict";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const siteNav    = document.querySelector(".site-nav");
    const navToggle  = document.getElementById("nav-toggle");
    const navLinks   = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
    const progressBar = document.getElementById("progress-bar");
    const topBtn     = document.getElementById("top-btn");
    const revealEls  = Array.from(document.querySelectorAll(".reveal"));

    const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
    let scrollTicking = false;

    /* ─────────────────────────────────────────────────
       Scroll UI (progress bar, back-to-top, nav shadow)
    ───────────────────────────────────────────────── */
    function updateScrollUI() {
        scrollTicking = false;
        const scrolled = window.scrollY || window.pageYOffset;
        const total    = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
        const pct      = clamp((scrolled / total) * 100, 0, 100);

        if (progressBar) progressBar.style.width = `${pct}%`;
        if (topBtn)       topBtn.classList.toggle("show", scrolled > 280);
        if (siteNav)      siteNav.classList.toggle("is-scrolled", scrolled > 6);
    }

    function onScroll() {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(updateScrollUI);
    }

    /* ─────────────────────────────────────────────────
       Scroll-reveal (fade up, no blur)
    ───────────────────────────────────────────────── */
    function setupScrollReveal() {
        if (!revealEls.length) return;

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealEls.forEach(el => el.classList.add("visible"));
            return;
        }

        // Immediately reveal everything in the current viewport
        revealEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) el.classList.add("visible");
        });

        // Reveal the rest as user scrolls
        const observer = new IntersectionObserver(
            (entries, io) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                });
            },
            { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
        );

        revealEls.forEach(el => {
            if (!el.classList.contains("visible")) observer.observe(el);
        });
    }

    /* ─────────────────────────────────────────────────
       Typing animation → then reveal tagline & buttons
    ───────────────────────────────────────────────── */
    function revealHeroContent(delay) {
        const tagline     = document.querySelector(".tagline");
        const heroActions = document.querySelector(".hero-actions");

        if (tagline)     setTimeout(() => tagline.classList.add("hero-revealed"),     delay);
        if (heroActions) setTimeout(() => heroActions.classList.add("hero-revealed"), delay + 160);
    }

    function setupIntroTyping() {
        const headline   = document.querySelector(".typing-headline");
        if (!(headline instanceof HTMLElement)) { revealHeroContent(0); return; }

        const typingText = headline.querySelector(".typing-text");
        if (!(typingText instanceof HTMLElement)) { revealHeroContent(0); return; }

        const fullText = headline.dataset.typingText || typingText.textContent || "";
        if (!fullText) { revealHeroContent(0); return; }

        if (prefersReducedMotion) {
            typingText.textContent = fullText;
            headline.classList.add("typed");
            revealHeroContent(0);
            return;
        }

        typingText.textContent = "";
        headline.classList.add("is-typing");

        const chars = Array.from(fullText);
        let i = 0;

        const typeNext = () => {
            typingText.textContent += chars[i];
            i++;
            if (i < chars.length) {
                const delay = chars[i - 1] === " " ? 38 : 72;
                setTimeout(typeNext, delay);
                return;
            }
            headline.classList.remove("is-typing");
            headline.classList.add("typed");
            revealHeroContent(130);
        };

        // Start after the headline has faded in (~0.38s anim delay + 0.7s duration)
        setTimeout(typeNext, 420);
    }

    /* ─────────────────────────────────────────────────
       Pill pop-in
    ───────────────────────────────────────────────── */
    function setupPillPopIn() {
        const groupIds = ["lang-pills", "fw-pills", "db-pills", "domain-pills"];

        groupIds.forEach(id => {
            const group = document.getElementById(id);
            if (!group) return;
            const pills = group.querySelectorAll(".pill");
            if (!pills.length) return;

            if (prefersReducedMotion || !("IntersectionObserver" in window)) {
                pills.forEach(p => p.classList.add("popped"));
                return;
            }

            const observer = new IntersectionObserver(
                (entries, io) => {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;
                        pills.forEach((pill, idx) =>
                            setTimeout(() => pill.classList.add("popped"), idx * 55)
                        );
                        io.unobserve(entry.target);
                    });
                },
                { threshold: 0.12 }
            );
            observer.observe(group);
        });
    }

    /* ─────────────────────────────────────────────────
       Smooth anchor scrolling
    ───────────────────────────────────────────────── */
    function setupSmoothAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener("click", e => {
                const href   = anchor.getAttribute("href");
                if (!href || href === "#") { e.preventDefault(); return; }
                const target = document.querySelector(href);
                if (!target) return;
                e.preventDefault();

                const navH = siteNav ? siteNav.getBoundingClientRect().height + 24 : 0;
                const y    = target.getBoundingClientRect().top + window.pageYOffset - navH;
                window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion ? "auto" : "smooth" });

                if (siteNav?.classList.contains("open")) {
                    siteNav.classList.remove("open");
                    navToggle?.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    /* ─────────────────────────────────────────────────
       Mobile nav
    ───────────────────────────────────────────────── */
    function setupMobileNav() {
        if (!siteNav || !navToggle) return;

        navToggle.addEventListener("click", () => {
            const open = siteNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });

        document.addEventListener("click", e => {
            if (!siteNav.classList.contains("open")) return;
            if (!(e.target instanceof Node) || !siteNav.contains(e.target)) {
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

    /* ─────────────────────────────────────────────────
       Active nav link highlighting
    ───────────────────────────────────────────────── */
    function setupActiveNavLink() {
        if (!navLinks.length || !("IntersectionObserver" in window)) return;

        const sectionMap = navLinks
            .map(link => {
                const href    = link.getAttribute("href");
                if (!href || href === "#") return null;
                const section = document.querySelector(href);
                return section ? { link, section } : null;
            })
            .filter(Boolean);

        if (!sectionMap.length) return;

        const activate = id =>
            sectionMap.forEach(({ link, section }) =>
                link.classList.toggle("active", section.id === id)
            );

        const observer = new IntersectionObserver(
            entries => entries.forEach(e => e.isIntersecting && activate(e.target.id)),
            { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
        );

        sectionMap.forEach(({ section }) => observer.observe(section));
    }

    /* ─────────────────────────────────────────────────
       Global stagger animations
    ───────────────────────────────────────────────── */
    function setupGlobalStaggerAnimations() {
        const targets = Array.from(document.querySelectorAll(
            ".hero-card li, .info-card, .contact-item, .platform-link, .list li, .pdf-frame, footer, .socials a"
        ));
        if (!targets.length) return;

        targets.forEach((el, i) => {
            el.classList.add("animate-on-scroll");
            el.style.setProperty("--stagger", String(i % 10));
        });

        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            targets.forEach(el => el.classList.add("animated-in"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries, io) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("animated-in");
                    io.unobserve(entry.target);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );

        targets.forEach(el => observer.observe(el));
    }

    /* ─────────────────────────────────────────────────
       Back-to-top button
    ───────────────────────────────────────────────── */
    function setupTopButton() {
        if (!topBtn) return;
        topBtn.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" })
        );
    }

    /* ─────────────────────────────────────────────────
       Particle canvas in hero header
    ───────────────────────────────────────────────── */
    function setupHeroCanvas() {
        if (prefersReducedMotion) return;
        const header = document.querySelector("header");
        if (!header) return;

        const canvas = document.createElement("canvas");
        canvas.id = "hero-canvas";
        header.insertBefore(canvas, header.firstChild);

        const ctx  = canvas.getContext("2d");
        let rafId  = null;

        const resize = () => {
            canvas.width  = header.offsetWidth;
            canvas.height = header.offsetHeight;
        };
        resize();
        new ResizeObserver(resize).observe(header);

        const COUNT = 32;
        const particles = Array.from({ length: COUNT }, () => ({
            x:     Math.random() * canvas.width,
            y:     Math.random() * canvas.height,
            r:     Math.random() * 2.2 + 0.7,
            dx:    (Math.random() - 0.5) * 0.32,
            dy:    (Math.random() - 0.5) * 0.32,
            alpha: Math.random() * 0.38 + 0.08,
            color: Math.random() > 0.5 ? "15,118,110" : "199,107,58"
        }));

        const draw = () => {
            const w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            particles.forEach(p => {
                p.x = (p.x + p.dx + w) % w;
                p.y = (p.y + p.dy + h) % h;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
                ctx.fill();
            });

            for (let i = 0; i < COUNT; i++) {
                for (let j = i + 1; j < COUNT; j++) {
                    const dx   = particles[i].x - particles[j].x;
                    const dy   = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 110) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(15,118,110,${0.07 * (1 - dist / 110)})`;
                        ctx.lineWidth   = 0.7;
                        ctx.stroke();
                    }
                }
            }

            rafId = requestAnimationFrame(draw);
        };

        // Pause when header scrolls out of view to save CPU
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                if (!rafId) rafId = requestAnimationFrame(draw);
            } else {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        }).observe(header);

        rafId = requestAnimationFrame(draw);
    }

    /* ─────────────────────────────────────────────────
       Floating ambient orbs in hero
    ───────────────────────────────────────────────── */
    function setupHeroOrbs() {
        if (prefersReducedMotion) return;
        const header = document.querySelector("header");
        if (!header) return;

        ["hero-orb hero-orb-1", "hero-orb hero-orb-2"].forEach(cls => {
            const orb = document.createElement("div");
            orb.className = cls;
            header.appendChild(orb);
        });
    }

    /* ─────────────────────────────────────────────────
       Magnetic buttons
    ───────────────────────────────────────────────── */
    function setupMagneticButtons() {
        if (prefersReducedMotion) return;
        if (window.matchMedia("(hover: none)").matches) return;

        document.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("mousemove", e => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width  / 2;
                const y = e.clientY - rect.top  - rect.height / 2;
                btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px) translateY(-1px)`;
            });
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "";
                btn.style.transition = "transform 0.4s cubic-bezier(.34,1.56,.64,1)";
                setTimeout(() => (btn.style.transition = ""), 420);
            });
        });
    }

    /* ─────────────────────────────────────────────────
       Hero card 3D parallax on mouse move
    ───────────────────────────────────────────────── */
    function setupHeroParallax() {
        if (prefersReducedMotion) return;
        if (window.matchMedia("(hover: none)").matches) return;

        const header   = document.querySelector("header");
        const heroCard = document.querySelector(".hero-card");
        if (!header || !heroCard) return;

        header.addEventListener("mousemove", e => {
            const rect = header.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width  - 0.5;
            const y = (e.clientY - rect.top)  / rect.height - 0.5;
            heroCard.style.transform =
                `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 4}deg) translateY(-3px)`;
        });

        header.addEventListener("mouseleave", () => {
            heroCard.style.transform = "";
        });
    }

    /* ─────────────────────────────────────────────────
       Scroll-down indicator in hero
    ───────────────────────────────────────────────── */
    function setupScrollIndicator() {
        const header = document.querySelector("header");
        if (!header) return;

        const ind = document.createElement("div");
        ind.className = "scroll-indicator";
        ind.setAttribute("aria-label", "Scroll down");
        ind.innerHTML = `<i class="fas fa-chevron-down" aria-hidden="true"></i>`;

        ind.addEventListener("click", () => {
            const about = document.querySelector("#about");
            if (!about) return;
            const navH = siteNav ? siteNav.getBoundingClientRect().height + 24 : 88;
            window.scrollTo({
                top:      Math.max(0, about.getBoundingClientRect().top + window.pageYOffset - navH),
                behavior: "smooth"
            });
        });

        header.appendChild(ind);

        window.addEventListener("scroll", () => {
            ind.style.opacity = window.scrollY > 60 ? "0" : "";
        }, { passive: true });
    }

    /* ─────────────────────────────────────────────────
       Click ripple on buttons
    ───────────────────────────────────────────────── */
    function setupRippleEffect() {
        if (prefersReducedMotion) return;
        document.querySelectorAll(".btn").forEach(btn => {
            btn.addEventListener("click", e => {
                const rect   = btn.getBoundingClientRect();
                const size   = Math.max(rect.width, rect.height);
                const x      = e.clientX - rect.left - size / 2;
                const y      = e.clientY - rect.top  - size / 2;
                const ripple = document.createElement("span");
                ripple.className  = "ripple-wave";
                ripple.style.cssText =
                    `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 700);
            });
        });
    }

    /* ─────────────────────────────────────────────────
       3D tilt on all cards
    ───────────────────────────────────────────────── */
    function setupCardTilt() {
        if (prefersReducedMotion) return;
        if (window.matchMedia("(hover: none)").matches) return;

        document.querySelectorAll(".info-card, .contact-item, .platform-link").forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x    = (e.clientX - rect.left) / rect.width  - 0.5;
                const y    = (e.clientY - rect.top)  / rect.height - 0.5;
                // Use setProperty with important to override CSS !important
                card.style.setProperty(
                    "transform",
                    `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-5px) scale(1.01)`,
                    "important"
                );
            });
            card.addEventListener("mouseleave", () => {
                card.style.removeProperty("transform");
            });
        });
    }

    /* ─────────────────────────────────────────────────
       Section side-nav dots
    ───────────────────────────────────────────────── */
    function setupSectionDots() {
        const sections = Array.from(document.querySelectorAll("main > section[id]"));
        if (!sections.length) return;

        const labels = {
            about: "About", experience: "Experience", education: "Education",
            skills: "Skills", projects: "Projects", achievements: "Achievements",
            activities: "Activities", languages: "Languages", github: "GitHub",
            cv: "CV", contact: "Contact", links: "Links"
        };

        const nav = document.createElement("nav");
        nav.className = "section-dots";
        nav.setAttribute("aria-label", "Section navigation");

        const dots = sections.map(sec => {
            const dot = document.createElement("button");
            dot.className = "section-dot";
            dot.dataset.label = labels[sec.id] || sec.id;
            dot.setAttribute("aria-label", `Go to ${labels[sec.id] || sec.id}`);
            dot.addEventListener("click", () => {
                const navH = siteNav ? siteNav.getBoundingClientRect().height + 24 : 88;
                window.scrollTo({
                    top:      Math.max(0, sec.getBoundingClientRect().top + window.pageYOffset - navH),
                    behavior: "smooth"
                });
            });
            nav.appendChild(dot);
            return { dot, sec };
        });

        document.body.appendChild(nav);

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            entries => entries.forEach(entry => {
                const match = dots.find(d => d.sec === entry.target);
                if (match) match.dot.classList.toggle("active", entry.isIntersecting);
            }),
            { rootMargin: "-30% 0px -55% 0px", threshold: 0 }
        );

        dots.forEach(({ sec }) => observer.observe(sec));
    }

    /* ─────────────────────────────────────────────────
       Section reveal direction hints
    ───────────────────────────────────────────────── */
    function assignRevealDirections() {
        const dirs = ["up","left","right","up","left","right","up","up","left","right","up","up"];
        document.querySelectorAll("main section.reveal").forEach((sec, i) => {
            sec.dataset.dir = dirs[i % dirs.length] || "up";
        });
    }

    /* ─────────────────────────────────────────────────
       Init
    ───────────────────────────────────────────────── */
    function init() {
        // Diagnostic: tell the user if animations are system-disabled
        if (prefersReducedMotion) {
            console.warn(
                "[Portfolio] Windows/OS 'Reduce animations' is ON. " +
                "Go to: Windows Settings → Accessibility → Visual Effects → Animation effects → turn ON"
            );
        }

        assignRevealDirections();
        setupIntroTyping();
        setupMobileNav();
        setupActiveNavLink();
        setupScrollReveal();
        setupGlobalStaggerAnimations();
        setupPillPopIn();
        setupSmoothAnchors();
        setupTopButton();

        setupHeroCanvas();
        setupHeroOrbs();
        setupMagneticButtons();
        setupHeroParallax();
        setupRippleEffect();
        setupCardTilt();
        setupSectionDots();
        setupScrollIndicator();

        updateScrollUI();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    document.addEventListener("DOMContentLoaded", init);
})();

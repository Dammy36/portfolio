// Small, dependency-free behaviour for the portfolio.
(function () {
  const root = document.documentElement;
  root.classList.add("js");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Header border once the page scrolls
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () =>
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (toggle && nav) {
    const label = toggle.querySelector(".menu-toggle__text");

    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    };

    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true")
    );

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia("(min-width: 640px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  // Reveal sections as they enter the viewport
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }

  // Local time in Lagos
  const clocks = document.querySelectorAll("[data-lagos-time]");
  if (clocks.length) {
    const format = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Lagos",
    });
    const tick = () =>
      clocks.forEach((el) => (el.textContent = format.format(new Date())));
    tick();
    setInterval(tick, 30000);
  }

  // Current year in the footer
  document
    .querySelectorAll("[data-year]")
    .forEach((el) => (el.textContent = new Date().getFullYear()));
})();

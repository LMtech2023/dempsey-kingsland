(function () {
  "use strict";

  var NAV_BREAKPOINT = 1200;
  var header = document.getElementById("site-header");
  var nav = document.getElementById("site-nav");
  var menuToggle = document.querySelector(".header__menu-toggle");
  var menuClose = document.querySelector(".header__nav-close");
  var overlay = document.querySelector(".header__overlay");
  var navLinks = document.querySelectorAll(".header__nav-link");
  var chromeElements = header ? [header] : [];

  function isMobileNav() {
    return window.innerWidth <= NAV_BREAKPOINT;
  }

  function setChromeHeight() {
    if (!header) return;

    var total = 0;
    chromeElements.forEach(function (el) {
      total += el.getBoundingClientRect().height;
    });

    document.documentElement.style.setProperty(
      "--site-chrome-height",
      total + "px"
    );
  }

  function setMenuState(isOpen) {
    if (!nav || !menuToggle || !overlay) return;

    var mobile = isMobileNav();

    nav.classList.toggle("is-open", isOpen);
    overlay.classList.toggle("is-visible", isOpen);
    menuToggle.classList.toggle("is-active", isOpen);
    document.body.classList.toggle("menu-open", isOpen && mobile);

    menuToggle.setAttribute("aria-expanded", mobile ? String(isOpen) : "false");
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    if (mobile) {
      nav.setAttribute("aria-hidden", String(!isOpen));
      overlay.setAttribute("aria-hidden", String(!isOpen));
    } else {
      nav.removeAttribute("aria-hidden");
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  function openMenu() {
    if (!isMobileNav()) return;
    setMenuState(true);
  }

  function closeMenu() {
    setMenuState(false);
  }

  function toggleMenu() {
    if (!isMobileNav()) return;
    setMenuState(!nav.classList.contains("is-open"));
  }

  function handleResize() {
    setChromeHeight();

    if (!isMobileNav()) {
      closeMenu();
    }
  }

  function initChromeObserver() {
    if (!header || typeof ResizeObserver === "undefined") {
      setChromeHeight();
      return;
    }

    var observer = new ResizeObserver(setChromeHeight);
    chromeElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }

  if (menuClose) {
    menuClose.addEventListener("click", closeMenu);
  }

  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", handleResize);
  window.addEventListener("load", handleResize);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setChromeHeight);
  }

  initChromeObserver();
  setChromeHeight();
  setMenuState(false);
})();

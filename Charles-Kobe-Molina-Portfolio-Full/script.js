document.addEventListener("DOMContentLoaded", () => {
  // AOS scroll reveal
  if (window.AOS) {
    AOS.init({
      duration: 750,
      easing: "cubic-bezier(.2,.75,.2,1)",
      once: true,
      offset: 60,
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
    });
  }

  const navbar = document.getElementById("navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");
  const year = document.getElementById("year");

  const updateNav = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const closeMenu = () => {
    menuToggle.classList.remove("active");
    mobileMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const open = !mobileMenu.classList.contains("open");
    menuToggle.classList.toggle("active", open);
    mobileMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  mobileLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
  });

  year.textContent = new Date().getFullYear();

  // Subtle pointer glow on capable devices
  const glow = document.querySelector(".cursor-glow");
  if (glow && window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("pointermove", e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }, { passive: true });
  }

  // Add active section state to desktop nav
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".desktop-nav a");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0 });

  sections.forEach(section => observer.observe(section));

  // Pointer-following light gives the work cards a little depth without a heavy animation loop.
  if (window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll("#work .case-card").forEach(card => {
      card.addEventListener("pointermove", event => {
        const bounds = card.getBoundingClientRect();
        card.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
        card.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
      }, { passive: true });
      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--pointer-x");
        card.style.removeProperty("--pointer-y");
      });
    });
  }

  document.querySelectorAll(".logo-tile").forEach((tile, index) => {
    tile.style.setProperty("--tool-index", index);
  });
});

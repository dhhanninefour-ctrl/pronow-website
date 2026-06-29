/* ===================================================================
   PRONOW — main.js
   Header scroll state · mobile menu · reveal on scroll · image slots.
   =================================================================== */

(function () {
  "use strict";

  /* ---------- header background on scroll ---------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile menu ---------- */
  const hamburger = document.getElementById("hamburger");
  const nav = document.getElementById("primaryNav");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  };
  hamburger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    hamburger.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    // safety net: if the observer never fires (e.g. tab opened in background,
    // odd viewport), force everything visible after a short delay.
    setTimeout(() => reveals.forEach((el) => el.classList.add("is-visible")), 1600);
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- image slots ----------
     Any element with data-img="name" tries to load
     assets/images/name.(webp|jpg|jpeg|png). If found, it is used
     as a background image and the "PHOTO/IMAGE" placeholder hides.
     Drop real photos into assets/images/ with the matching name.   */
  const EXTS = ["webp", "jpg", "jpeg", "png"];
  document.querySelectorAll("[data-img]").forEach((el) => {
    const name = el.getAttribute("data-img");
    let i = 0;
    const tryNext = () => {
      if (i >= EXTS.length) return; // none found → keep placeholder
      const url = "assets/images/" + name + "." + EXTS[i++];
      const img = new Image();
      img.onload = () => {
        el.style.backgroundImage = "url('" + url + "')";
        el.classList.add("has-img");
      };
      img.onerror = tryNext;
      img.src = url;
    };
    tryNext();
  });
})();

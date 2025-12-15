/* one_page_website.js
   Lightbox (Modal Image Gallery) for a one-page website
   - Works with thumbnails that have: class="lightbox-thumb"
   - Provide a bigger image via: data-large="path/to/large.jpg"
   - OR (fallback) if your thumbnail src contains "/thumbs/", the script will try "/large/"
*/

(function () {
  "use strict";

  function getLargeSrc(img) {
    const dataLarge = img.getAttribute("data-large");
    if (dataLarge) return dataLarge;

    const src = img.getAttribute("src") || "";
    // Fallback: /thumbs/ -> /large/
    if (src.includes("/thumbs/")) return src.replace("/thumbs/", "/large/");
    return src; // last resort (same image)
  }

  function ensureLightboxDOM() {
    if (document.getElementById("lightboxModal")) return;

    const style = document.createElement("style");
    style.textContent = `
      /* Lightbox styles (kept here so you don't need extra CSS files) */
      #lightboxModal {
        display: none;
        position: fixed;
        z-index: 9999;
        left: 0; top: 0;
        width: 100%; height: 100%;
        overflow: auto;
        background: rgba(0,0,0,0.9);
      }
      #lightboxModal.is-open { display: block; }
      #lightboxModal .lb-content {
        position: relative;
        margin: 40px auto;
        max-width: 1000px;
        width: 92%;
        text-align: center;
      }
      #lightboxModal img {
        width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 6px;
      }
      #lightboxModal .lb-caption {
        color: #ddd;
        padding: 12px 0 0;
        font-size: 16px;
        line-height: 1.3;
      }
      #lightboxModal .lb-close {
        position: fixed;
        top: 18px;
        right: 26px;
        color: #fff;
        font-size: 40px;
        font-weight: 300;
        cursor: pointer;
        user-select: none;
      }
      #lightboxModal .lb-nav {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
        width: 54px;
        height: 54px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.25);
        background: rgba(255,255,255,0.08);
        color: #fff;
        font-size: 34px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #lightboxModal .lb-prev { left: 18px; }
      #lightboxModal .lb-next { right: 18px; }
      #lightboxModal .lb-nav:focus { outline: 2px solid rgba(255,255,255,0.6); }
      .lightbox-thumb { cursor: zoom-in; }
    `;
    document.head.appendChild(style);

    const modal = document.createElement("div");
    modal.id = "lightboxModal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `
      <span class="lb-close" aria-label="Close lightbox">&times;</span>
      <button class="lb-nav lb-prev" aria-label="Previous image">&#10094;</button>
      <button class="lb-nav lb-next" aria-label="Next image">&#10095;</button>
      <div class="lb-content">
        <img id="lightboxImage" alt="">
        <div id="lightboxCaption" class="lb-caption"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function initLightbox() {
    ensureLightboxDOM();

    const thumbs = Array.from(document.querySelectorAll("img.lightbox-thumb"));
    if (thumbs.length === 0) return; // nothing to do

    const modal = document.getElementById("lightboxModal");
    const modalImg = document.getElementById("lightboxImage");
    const captionEl = document.getElementById("lightboxCaption");
    const closeBtn = modal.querySelector(".lb-close");
    const prevBtn = modal.querySelector(".lb-prev");
    const nextBtn = modal.querySelector(".lb-next");

    let currentIndex = 0;

    function openAt(index) {
      currentIndex = (index + thumbs.length) % thumbs.length;
      const thumb = thumbs[currentIndex];

      const largeSrc = getLargeSrc(thumb);
      modalImg.src = largeSrc;

      const caption = thumb.getAttribute("alt") || thumb.getAttribute("data-caption") || "";
      captionEl.textContent = caption;

      modal.classList.add("is-open");
      document.body.style.overflow = "hidden"; // lock scroll
    }

    function close() {
      modal.classList.remove("is-open");
      modalImg.src = "";
      captionEl.textContent = "";
      document.body.style.overflow = "";
    }

    function next() { openAt(currentIndex + 1); }
    function prev() { openAt(currentIndex - 1); }

    thumbs.forEach((img, i) => {
      img.addEventListener("click", () => openAt(i));
    });

    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    // Click outside the image closes
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  // Run after HTML is loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
  } else {
    initLightbox();
  }
})();
/**
 * KWD Theme — Main JavaScript
 * kwdstore.com | Salla Twilight Engine
 * Optimized for Performance & SEO Signals
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────
   * 1. DOM READY
   * ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    KWD.init();
  });

  /* ──────────────────────────────────────────────
   * 2. MAIN NAMESPACE
   * ────────────────────────────────────────────── */
  const KWD = {
    init() {
      this.heroSlider();
      this.mobileMenu();
      this.stickyHeader();
      this.lazyImages();
      this.productGallery();
      this.quantitySelector();
      this.productTabs();
      this.filterSidebar();
      this.searchOverlay();
      this.backToTop();
      this.seoChecker();
      this.trackEvents();
      this.cartSync();
    },

    /* ────────────────────────────────────────────
     * 2.1 HERO SLIDER
     * ────────────────────────────────────────── */
    heroSlider() {
      const sliders = document.querySelectorAll('.hero-slider[data-auto]');
      sliders.forEach(slider => {
        const slides   = slider.querySelectorAll('.hero-slide');
        const dots     = slider.querySelectorAll('.slider-dot');
        const prevBtn  = slider.querySelector('.slider-arrow-prev');
        const nextBtn  = slider.querySelector('.slider-arrow-next');
        if (!slides.length) return;

        let current  = 0;
        let autoplay = null;
        const total  = slides.length;

        const goTo = (index) => {
          slides[current].classList.remove('active');
          if (dots[current]) dots[current].classList.remove('active');
          current = (index + total) % total;
          slides[current].classList.add('active');
          if (dots[current]) dots[current].classList.add('active');
        };

        const startAuto = () => {
          autoplay = setInterval(() => goTo(current + 1), 5000);
        };
        const stopAuto  = () => clearInterval(autoplay);

        goTo(0);
        startAuto();

        if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
        if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

        dots.forEach((dot, i) => {
          dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
        });

        // Touch / swipe
        let touchStartX = 0;
        slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend',   e => {
          const diff = touchStartX - e.changedTouches[0].screenX;
          if (Math.abs(diff) > 50) {
            stopAuto();
            goTo(diff > 0 ? current + 1 : current - 1);
            startAuto();
          }
        }, { passive: true });

        // Pause on hover
        slider.addEventListener('mouseenter', stopAuto);
        slider.addEventListener('mouseleave', startAuto);
      });
    },

    /* ────────────────────────────────────────────
     * 2.2 MOBILE MENU
     * ────────────────────────────────────────── */
    mobileMenu() {
      const menuBtn  = document.querySelector('.mobile-menu-btn');
      const siteNav  = document.querySelector('.site-nav');
      const overlay  = document.createElement('div');
      overlay.className = 'nav-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:999;display:none;';
      document.body.appendChild(overlay);

      if (!menuBtn || !siteNav) return;

      const toggle = () => {
        const open = siteNav.classList.toggle('mobile-open');
        menuBtn.setAttribute('aria-expanded', open);
        overlay.style.display = open ? 'block' : 'none';
        document.body.style.overflow = open ? 'hidden' : '';
        menuBtn.innerHTML = open
          ? '<i class="sicon-close"></i>'
          : '<i class="sicon-menu"></i>';
      };

      menuBtn.addEventListener('click', toggle);
      overlay.addEventListener('click', toggle);

      // Keyboard: escape closes menu
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && siteNav.classList.contains('mobile-open')) toggle();
      });
    },

    /* ────────────────────────────────────────────
     * 2.3 STICKY HEADER (hide on scroll down)
     * ────────────────────────────────────────── */
    stickyHeader() {
      const header = document.querySelector('.site-header');
      if (!header) return;
      let lastY = 0;

      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastY && y > 100) {
          header.style.transform = 'translateY(-100%)';
        } else {
          header.style.transform = 'translateY(0)';
        }
        lastY = y;
        header.classList.toggle('scrolled', y > 10);
      }, { passive: true });
    },

    /* ────────────────────────────────────────────
     * 2.4 LAZY IMAGE LOADING (SEO: fast LCP)
     * ────────────────────────────────────────── */
    lazyImages() {
      if (!('IntersectionObserver' in window)) return;

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) img.src = img.dataset.src;
            if (img.dataset.srcset) img.srcset = img.dataset.srcset;
            img.classList.add('loaded');
            obs.unobserve(img);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('img[data-src]').forEach(img => obs.observe(img));
    },

    /* ────────────────────────────────────────────
     * 2.5 PRODUCT GALLERY
     * ────────────────────────────────────────── */
    productGallery() {
      const gallery = document.querySelector('.product-gallery');
      if (!gallery) return;

      const mainImg  = gallery.querySelector('.gallery-main img');
      const thumbs   = gallery.querySelectorAll('.thumb-item');

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          if (mainImg && thumb.dataset.full) {
            mainImg.src = thumb.dataset.full;
            mainImg.alt = thumb.querySelector('img')?.alt || '';
          }
        });
      });

      // Zoom on click
      if (mainImg) {
        mainImg.style.cursor = 'zoom-in';
        mainImg.addEventListener('click', () => {
          const modal = document.createElement('div');
          modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
          const zoomImg = document.createElement('img');
          zoomImg.src = mainImg.src;
          zoomImg.alt = mainImg.alt;
          zoomImg.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;border-radius:8px;';
          modal.appendChild(zoomImg);
          modal.addEventListener('click', () => modal.remove());
          document.body.appendChild(modal);
        });
      }
    },

    /* ────────────────────────────────────────────
     * 2.6 QUANTITY SELECTOR
     * ────────────────────────────────────────── */
    quantitySelector() {
      document.querySelectorAll('.qty-selector').forEach(selector => {
        const input = selector.querySelector('.qty-input');
        const minus = selector.querySelector('[data-qty="minus"]');
        const plus  = selector.querySelector('[data-qty="plus"]');
        if (!input) return;

        const min = parseInt(input.min) || 1;
        const max = parseInt(input.max) || 999;

        if (minus) minus.addEventListener('click', () => {
          const v = parseInt(input.value) || min;
          if (v > min) input.value = v - 1;
          input.dispatchEvent(new Event('change'));
        });

        if (plus) plus.addEventListener('click', () => {
          const v = parseInt(input.value) || min;
          if (v < max) input.value = v + 1;
          input.dispatchEvent(new Event('change'));
        });

        input.addEventListener('input', () => {
          let v = parseInt(input.value);
          if (isNaN(v) || v < min) input.value = min;
          if (v > max) input.value = max;
        });
      });
    },

    /* ────────────────────────────────────────────
     * 2.7 PRODUCT TABS
     * ────────────────────────────────────────── */
    productTabs() {
      document.querySelectorAll('.product-tabs').forEach(tabs => {
        const btns   = tabs.querySelectorAll('.tab-btn');
        const panels = tabs.querySelectorAll('.tab-panel');

        btns.forEach(btn => {
          btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            btns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const panel = tabs.querySelector(`.tab-panel[data-tab="${target}"]`);
            if (panel) panel.classList.add('active');
          });
        });
      });
    },

    /* ────────────────────────────────────────────
     * 2.8 FILTER SIDEBAR TOGGLE (mobile)
     * ────────────────────────────────────────── */
    filterSidebar() {
      const btn     = document.querySelector('[data-filter-toggle]');
      const sidebar = document.querySelector('.filter-sidebar');
      if (!btn || !sidebar) return;

      btn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        btn.setAttribute('aria-expanded', sidebar.classList.contains('open'));
      });

      // Collapsible groups
      document.querySelectorAll('.filter-title').forEach(title => {
        title.addEventListener('click', () => {
          const options = title.nextElementSibling;
          if (options) {
            const open = options.style.display !== 'none';
            options.style.display = open ? 'none' : 'flex';
            const icon = title.querySelector('.filter-toggle-icon');
            if (icon) icon.style.transform = open ? 'rotate(0)' : 'rotate(-180deg)';
          }
        });
      });
    },

    /* ────────────────────────────────────────────
     * 2.9 SEARCH OVERLAY
     * ────────────────────────────────────────── */
    searchOverlay() {
      const searchBtn     = document.querySelector('[data-search-open]');
      const searchOverlay = document.querySelector('.search-overlay');
      const closeBtn      = document.querySelector('[data-search-close]');
      const searchInput   = document.querySelector('.search-overlay-input');

      if (!searchBtn || !searchOverlay) return;

      const open  = () => { searchOverlay.classList.add('active'); searchInput?.focus(); document.body.style.overflow = 'hidden'; };
      const close = () => { searchOverlay.classList.remove('active'); document.body.style.overflow = ''; };

      searchBtn.addEventListener('click', open);
      if (closeBtn) closeBtn.addEventListener('click', close);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
      searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) close(); });
    },

    /* ────────────────────────────────────────────
     * 2.10 BACK TO TOP
     * ────────────────────────────────────────── */
    backToTop() {
      const btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'العودة للأعلى');
      btn.innerHTML = '<i class="sicon-chevron-up"></i>';
      btn.style.cssText = [
        'position:fixed',
        'bottom:1.5rem',
        'inset-inline-end:1.5rem',
        'width:44px',
        'height:44px',
        'border-radius:50%',
        'background:var(--color-accent)',
        'color:#fff',
        'font-size:1.25rem',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'opacity:0',
        'visibility:hidden',
        'transition:all .3s',
        'z-index:500',
        'cursor:pointer',
        'border:none',
        'box-shadow:0 4px 12px rgba(233,69,96,.35)'
      ].join(';');

      document.body.appendChild(btn);

      window.addEventListener('scroll', () => {
        const show = window.scrollY > 400;
        btn.style.opacity      = show ? '1' : '0';
        btn.style.visibility   = show ? 'visible' : 'hidden';
        btn.style.transform    = show ? 'translateY(0)' : 'translateY(12px)';
      }, { passive: true });

      btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    },

    /* ────────────────────────────────────────────
     * 2.11 SEO LIVE CHECKER (Admin helpers)
     *   Runs only in preview/admin context
     * ────────────────────────────────────────── */
    seoChecker() {
      if (!document.body.dataset.seoCheck) return;

      const checks = {
        title: () => {
          const t = document.title;
          return { pass: t.length >= 30 && t.length <= 60, msg: `عنوان الصفحة: ${t.length} حرف (المثالي 30-60)` };
        },
        description: () => {
          const m = document.querySelector('meta[name="description"]');
          const l = m ? m.content.length : 0;
          return { pass: l >= 120 && l <= 160, msg: `الوصف: ${l} حرف (المثالي 120-160)` };
        },
        h1: () => {
          const h1s = document.querySelectorAll('h1');
          return { pass: h1s.length === 1, msg: `عدد H1: ${h1s.length} (يجب أن يكون 1)` };
        },
        canonical: () => {
          const c = document.querySelector('link[rel="canonical"]');
          return { pass: !!c, msg: c ? 'Canonical موجود ✓' : 'Canonical مفقود ✗' };
        },
        images: () => {
          const imgs    = document.querySelectorAll('img');
          const noAlt   = [...imgs].filter(i => !i.alt).length;
          return { pass: noAlt === 0, msg: `صور بدون alt: ${noAlt}` };
        },
        schema: () => {
          const ld = document.querySelectorAll('script[type="application/ld+json"]');
          return { pass: ld.length >= 1, msg: `Schema.org: ${ld.length} كتل` };
        }
      };

      const results = Object.entries(checks).map(([key, fn]) => ({ key, ...fn() }));
      const passed  = results.filter(r => r.pass).length;
      const score   = Math.round((passed / results.length) * 100);

      console.group('%c KWD SEO Report', 'color:#e94560;font-weight:bold;font-size:14px;');
      console.log(`%c Score: ${score}/100`, `color:${score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'};font-size:13px;font-weight:bold;`);
      results.forEach(r => {
        console.log(`%c ${r.pass ? '✓' : '✗'} ${r.msg}`, `color:${r.pass ? '#22c55e' : '#ef4444'}`);
      });
      console.groupEnd();
    },

    /* ────────────────────────────────────────────
     * 2.12 ECOMMERCE EVENT TRACKING
     * ────────────────────────────────────────── */
    trackEvents() {
      // Push to dataLayer (GTM) if available
      const dl = (event, data) => {
        if (window.dataLayer) window.dataLayer.push({ event, ...data });
      };

      // Add to cart
      document.addEventListener('click', e => {
        const btn = e.target.closest('[data-add-cart]');
        if (btn) {
          dl('add_to_cart', {
            product_id:   btn.dataset.productId,
            product_name: btn.dataset.productName,
            price:        btn.dataset.price,
            currency:     btn.dataset.currency || 'SAR'
          });
        }
      });

      // Wishlist
      document.addEventListener('click', e => {
        const btn = e.target.closest('[data-wishlist]');
        if (btn) {
          dl('add_to_wishlist', {
            product_id: btn.dataset.productId
          });
        }
      });

      // Search
      const searchForm = document.querySelector('[data-search-form]');
      if (searchForm) {
        searchForm.addEventListener('submit', e => {
          const q = searchForm.querySelector('input[name="q"]')?.value;
          if (q) dl('search', { search_term: q });
        });
      }
    },

    /* ────────────────────────────────────────────
     * 2.13 CART SYNC (real-time badge update)
     * ────────────────────────────────────────── */
    cartSync() {
      document.addEventListener('salla:cart:updated', e => {
        const count = e.detail?.count || 0;
        document.querySelectorAll('[data-cart-count]').forEach(el => {
          el.textContent = count;
          el.style.display = count ? 'flex' : 'none';
        });
      });
    }
  };

  // Expose globally for inline handlers
  window.KWD = KWD;

})();

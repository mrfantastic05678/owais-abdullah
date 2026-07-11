/**
 * scroll-story.js — dependency-free scroll-scrubbed product reveal engine.
 * Shared verbatim by the standalone bundle and the Shopify section; copy
 * as-is into a theme's assets/ folder unmodified.
 *
 * Config (per-instance, passed as a JSON object):
 *   mode:          'frames' | 'video'                default 'frames'
 *   framesBaseUrl: string prefix before the zero-padded frame number
 *   frameCount:    number of frames in the sequence   default 60
 *   framePad:      digits in the frame filename        default 3 ("001")
 *   frameExt:      file extension                       default 'webp'
 *   videoSelector: selector for the <video> element (video mode)
 *   canvasSelector: selector for the <canvas> element (frames mode)
 *   staticFrameUrl: fallback still image for prefers-reduced-motion
 *
 * Scroll-percentage overlays are read from the DOM, not this config:
 * any descendant with [data-act][data-start][data-end] toggles an
 * `is-visible` class when scroll progress (0-100) falls in [start, end].
 */
(function (global) {
  'use strict';

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function ScrollStory(root, config) {
    this.root = root;
    this.config = Object.assign(
      {
        mode: 'frames',
        framesBaseUrl: '',
        frameCount: 60,
        framePad: 3,
        frameExt: 'webp',
        videoSelector: 'video',
        canvasSelector: 'canvas',
        staticFrameUrl: '',
      },
      config
    );

    this.wrapper = root.querySelector('.scroll-story__pin-wrapper') || root;
    this.canvas = root.querySelector(this.config.canvasSelector);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.video = root.querySelector(this.config.videoSelector);

    this.frames = [];
    this.currentFrameIndex = -1;
    this.ticking = false;
    this.started = false;
    this.reducedMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this._onScroll = this._onScroll.bind(this);
    this._raf = this._raf.bind(this);
  }

  ScrollStory.prototype.init = function () {
    if (this.reducedMotion) {
      this._renderStaticFallback();
      return this;
    }

    var self = this;
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !self.started) {
            self.started = true;
            self._start();
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(this.wrapper);
    return this;
  };

  ScrollStory.prototype._start = function () {
    if (this.config.mode === 'frames') {
      this._preloadFrames();
    } else if (this.video) {
      this.video.pause();
      this.video.muted = true;
      this.video.setAttribute('playsinline', '');
    }
    global.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  };

  ScrollStory.prototype._onScroll = function () {
    if (this.ticking) return;
    this.ticking = true;
    global.requestAnimationFrame(this._raf);
  };

  ScrollStory.prototype._raf = function () {
    this.ticking = false;
    var rect = this.wrapper.getBoundingClientRect();
    var scrollableDistance = this.wrapper.offsetHeight - global.innerHeight;
    var scrolled = clamp(-rect.top, 0, Math.max(scrollableDistance, 0));
    var progress = scrollableDistance > 0 ? scrolled / scrollableDistance : 0;

    this._renderFrame(progress);
    this._updateOverlays(progress * 100);
  };

  ScrollStory.prototype._preloadFrames = function () {
    var self = this;
    var cfg = this.config;
    var i = 1;

    function frameUrl(n) {
      var padded = String(n).padStart(cfg.framePad, '0');
      return cfg.framesBaseUrl + padded + '.' + cfg.frameExt;
    }

    function loadOne(n) {
      return fetch(frameUrl(n))
        .then(function (r) {
          return r.blob();
        })
        .then(function (blob) {
          return global.createImageBitmap(blob);
        })
        .then(function (bmp) {
          self.frames[n - 1] = bmp;
        })
        .catch(function () {
          /* missing frame: draw step will just skip it */
        });
    }

    // First frame blocks so the section never paints empty; the rest load
    // in the background without holding up interactivity.
    loadOne(1).then(function () {
      var rest = [];
      for (i = 2; i <= cfg.frameCount; i++) rest.push(loadOne(i));
      Promise.all(rest).catch(function () {});
    });
  };

  ScrollStory.prototype._renderFrame = function (progress) {
    if (this.config.mode === 'video') {
      if (!this.video || !this.video.duration) return;
      this.video.currentTime = progress * this.video.duration;
      return;
    }
    var frameCount = this.config.frameCount;
    var index = clamp(Math.round(progress * (frameCount - 1)), 0, frameCount - 1);
    if (index === this.currentFrameIndex) return;
    var bmp = this.frames[index];
    if (!bmp || !this.ctx) return;
    this.currentFrameIndex = index;
    this._drawToCanvas(bmp);
  };

  ScrollStory.prototype._drawToCanvas = function (bmp) {
    var canvas = this.canvas;
    var dpr = global.devicePixelRatio || 1;
    var cssWidth = canvas.clientWidth;
    var cssHeight = canvas.clientHeight;
    var targetWidth = Math.round(cssWidth * dpr);
    var targetHeight = Math.round(cssHeight * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    var canvasRatio = canvas.width / canvas.height;
    var bmpRatio = bmp.width / bmp.height;
    var dw, dh, dx, dy;
    if (bmpRatio > canvasRatio) {
      dh = canvas.height;
      dw = dh * bmpRatio;
      dx = (canvas.width - dw) / 2;
      dy = 0;
    } else {
      dw = canvas.width;
      dh = dw / bmpRatio;
      dx = 0;
      dy = (canvas.height - dh) / 2;
    }
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.drawImage(bmp, dx, dy, dw, dh);
  };

  ScrollStory.prototype._updateOverlays = function (progressPct) {
    var overlays = this.root.querySelectorAll('[data-act]');
    for (var i = 0; i < overlays.length; i++) {
      var el = overlays[i];
      var start = parseFloat(el.getAttribute('data-start') || '0');
      var end = parseFloat(el.getAttribute('data-end') || '100');
      var visible = progressPct >= start && progressPct <= end;
      el.classList.toggle('is-visible', visible);
    }
  };

  ScrollStory.prototype._renderStaticFallback = function () {
    this.root.classList.add('scroll-story--static');
    var overlays = this.root.querySelectorAll('[data-act]');
    for (var i = 0; i < overlays.length; i++) overlays[i].classList.add('is-visible');

    if (this.canvas && this.config.staticFrameUrl) {
      var self = this;
      fetch(this.config.staticFrameUrl)
        .then(function (r) {
          return r.blob();
        })
        .then(function (blob) {
          return global.createImageBitmap(blob);
        })
        .then(function (bmp) {
          self._drawToCanvas(bmp);
        })
        .catch(function () {});
    } else if (this.video) {
      this.video.pause();
      this.video.currentTime = 0;
    }
  };

  global.ScrollStory = ScrollStory;

  // Auto-init any [data-scroll-story] element found on DOMContentLoaded.
  // The attribute value is a JSON config blob (see header comment above).
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-scroll-story]').forEach(function (root) {
      var raw = root.getAttribute('data-scroll-story') || '{}';
      var cfg;
      try {
        cfg = JSON.parse(raw);
      } catch (e) {
        cfg = {};
      }
      new ScrollStory(root, cfg).init();
    });
  });
})(window);

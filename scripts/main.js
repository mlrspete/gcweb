(function () {
  var hasGsap = typeof window.gsap !== "undefined";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var state = {
    reducedMotion: prefersReducedMotion.matches
  };

  window.GRUBCLUB_REDUCED_MOTION = state.reducedMotion;

  function updateReducedMotion(event) {
    state.reducedMotion = event.matches;
    window.GRUBCLUB_REDUCED_MOTION = state.reducedMotion;
  }

  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener("change", updateReducedMotion);
  } else if (typeof prefersReducedMotion.addListener === "function") {
    prefersReducedMotion.addListener(updateReducedMotion);
  }

  if (hasGsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  function removeLoader(loader, resolve) {
    if (!loader) {
      resolve();
      return;
    }

    document.body.classList.remove("is-loading");
    loader.setAttribute("hidden", "hidden");
    window.setTimeout(function () {
      loader.remove();
      resolve();
    }, 0);
  }

  function initLoader() {
    var loader = document.querySelector(".site-loader");

    if (!loader) {
      return Promise.resolve();
    }

    var wordmark = loader.querySelector(".site-loader__wordmark");
    var lines = loader.querySelectorAll(".site-loader__line");
    var accent = loader.querySelector(".site-loader__accent");

    document.body.classList.add("is-loading");

    return new Promise(function (resolve) {
      if (state.reducedMotion || !hasGsap) {
        window.setTimeout(function () {
          removeLoader(loader, resolve);
        }, 60);
        return;
      }

      window.gsap.set(wordmark, { yPercent: 112 });
      window.gsap.set(lines, { scaleX: 0, transformOrigin: "left center" });
      window.gsap.set(accent, { xPercent: -18 });

      window.gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: function () {
          removeLoader(loader, resolve);
        }
      })
        .to(wordmark, {
          yPercent: 0,
          duration: 0.46
        }, 0.08)
        .to(lines, {
          scaleX: 1,
          duration: 0.28,
          stagger: 0.06,
          ease: "power3.out"
        }, 0.28)
        .to(accent, {
          xPercent: 24,
          duration: 0.72,
          ease: "power2.inOut"
        }, 0.02)
        .to(loader, {
          yPercent: -100,
          duration: 0.48,
          ease: "power4.in"
        }, 0.96);
    });
  }

  function syncTickerWidth(viewport, current, next) {
    viewport.style.width = Math.max(current.offsetWidth, next.offsetWidth, 10) + "px";
  }

  function initTicker(ticker) {
    if (!ticker) {
      return;
    }

    var viewport = ticker.querySelector(".ticker-flip__viewport");
    var current = ticker.querySelector(".ticker-flip__current");
    var next = ticker.querySelector(".ticker-flip__next");
    var value = 1;
    var renderToken = 0;
    var tickInterval = state.reducedMotion ? 240 : 120;

    function formatValue(number) {
      return number.toLocaleString("en-US");
    }

    function settle(valueToRender, token) {
      window.setTimeout(function () {
        if (token !== renderToken) {
          return;
        }

        current.textContent = formatValue(valueToRender);
        next.textContent = formatValue(valueToRender + 1);
        syncTickerWidth(viewport, current, next);

        if (hasGsap) {
          window.gsap.set(current, { yPercent: 0, opacity: 1 });
          window.gsap.set(next, { yPercent: 100, opacity: 1 });
        }
      }, 205);
    }

    function renderTick(nextValue) {
      renderToken += 1;

      current.textContent = formatValue(nextValue - 1);
      next.textContent = formatValue(nextValue);
      syncTickerWidth(viewport, current, next);

      if (state.reducedMotion || !hasGsap) {
        current.textContent = formatValue(nextValue);
        next.textContent = formatValue(nextValue + 1);
        syncTickerWidth(viewport, current, next);
        return;
      }

      window.gsap.killTweensOf([current, next]);
      window.gsap.set(current, { yPercent: 0, opacity: 1 });
      window.gsap.set(next, { yPercent: 100, opacity: 1 });

      window.gsap.to(current, {
        yPercent: -100,
        opacity: 0.55,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto"
      });

      window.gsap.to(next, {
        yPercent: 0,
        opacity: 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto"
      });

      settle(nextValue, renderToken);
    }

    current.textContent = formatValue(value);
    next.textContent = formatValue(value + 1);
    syncTickerWidth(viewport, current, next);

    if (hasGsap) {
      window.gsap.set(current, { yPercent: 0, opacity: 1 });
      window.gsap.set(next, { yPercent: 100, opacity: 1 });
    }

    window.setInterval(function () {
      value += 1;
      renderTick(value);
    }, tickInterval);
  }

  function initHero(loaderReady) {
    var hero = document.querySelector(".hero");

    if (!hero) {
      return;
    }

    var kicker = hero.querySelector(".hero__kicker");
    var wordmark = hero.querySelector(".hero__wordmark");
    var tagline = hero.querySelector(".hero__tagline");
    var support = hero.querySelector(".hero__support");
    var cta = hero.querySelector(".hero__cta");
    var card = hero.querySelector(".rustpilot-card");
    var quote = hero.querySelector(".quote-pill--hero");
    var ticker = hero.querySelector(".ticker-flip");

    initTicker(ticker);

    if (cta) {
      cta.addEventListener("click", function (event) {
        var target = document.querySelector(cta.getAttribute("href"));

        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({
          behavior: state.reducedMotion ? "auto" : "smooth",
          block: "start"
        });

        if (hasGsap && !state.reducedMotion) {
          window.gsap.fromTo(cta, {
            y: 0
          }, {
            y: -1,
            duration: 0.12,
            repeat: 1,
            yoyo: true,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    }

    if (state.reducedMotion || !hasGsap) {
      return;
    }

    window.gsap.set(kicker, { autoAlpha: 0, y: 18 });
    window.gsap.set(wordmark, { autoAlpha: 0, y: 28 });
    window.gsap.set([tagline, support], { autoAlpha: 0, y: 18 });
    window.gsap.set(cta, { autoAlpha: 0, y: 14 });
    window.gsap.set(card, {
      autoAlpha: 0,
      y: 34,
      rotate: window.matchMedia("(max-width: 767px)").matches ? -2 : -8
    });
    window.gsap.set(quote, { autoAlpha: 0, y: 18 });

    loaderReady.then(function () {
      window.gsap.timeline({
        defaults: {
          ease: "power4.out"
        }
      })
        .to(kicker, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5
        }, 0)
        .to(wordmark, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72
        }, 0.06)
        .to([tagline, support], {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08
        }, 0.18)
        .to(cta, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42
        }, 0.38)
        .to(card, {
          autoAlpha: 1,
          y: 0,
          rotate: window.matchMedia("(max-width: 767px)").matches ? 0 : -3,
          duration: 0.76
        }, 0.18)
        .to(quote, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5
        }, 0.42);
    });
  }

  function initAudienceShowcase() {
    var section = document.querySelector(".audience-showcase");

    if (!section) {
      return;
    }

    var track = section.querySelector(".audience-showcase__track");
    var sticky = section.querySelector(".audience-showcase__sticky");
    var wordStack = section.querySelector(".audience-showcase__word-stack");
    var wordTrack = section.querySelector(".audience-showcase__word-track");
    var words = Array.prototype.slice.call(section.querySelectorAll(".audience-showcase__word"));
    var scenes = Array.prototype.slice.call(section.querySelectorAll(".audience-scene"));
    var progress = section.querySelector(".audience-showcase__progress");
    var progressLine = section.querySelector(".audience-showcase__progress-line");
    var progressIndicator = section.querySelector(".audience-showcase__progress-indicator");
    var progressLabels = Array.prototype.slice.call(section.querySelectorAll(".audience-showcase__progress-labels span"));
    var sceneBackgrounds = ["#eaf3bd", "#d9d9d1", "#dff0de"];
    var wordOffsets = [0, 0, 0];
    var progressStops = [0, 0, 0];
    var activeSceneIndex = 0;

    function setActiveScene(index) {
      words.forEach(function (word, wordIndex) {
        word.classList.toggle("is-active", wordIndex === index);
      });
    }

    function getSceneIndex(progressValue) {
      if (progressValue >= (2 / 3)) {
        return 2;
      }

      if (progressValue >= (1 / 3)) {
        return 1;
      }

      return 0;
    }

    function measureWordOffsets() {
      var rowHeight = 0;

      if (!wordStack || !wordTrack || !words.length) {
        return [0, 0, 0];
      }

      words.forEach(function (word) {
        rowHeight = Math.max(rowHeight, Math.ceil(word.getBoundingClientRect().height));
      });

      rowHeight = rowHeight || Math.ceil(wordStack.getBoundingClientRect().height) || 0;
      wordStack.style.setProperty("--audience-word-row-height", rowHeight + "px");

      return words.map(function (_, index) {
        return rowHeight * index * -1;
      });
    }

    function measureProgressStops() {
      var indicatorHeight;
      var progressRect;
      var labelCenters;

      if (!progress || !progressLine || !progressIndicator || !progressLabels.length || progress.offsetParent === null) {
        if (progress) {
          progress.style.setProperty("--audience-progress-line-start", "0px");
          progress.style.setProperty("--audience-progress-line-end", "100%");
        }

        return [0, 0, 0];
      }

      indicatorHeight = progressIndicator.offsetHeight || 10;
      progressRect = progress.getBoundingClientRect();
      labelCenters = progressLabels.map(function (label) {
        var rect = label.getBoundingClientRect();

        return (rect.top - progressRect.top) + (rect.height / 2);
      });

      progress.style.setProperty("--audience-progress-line-start", labelCenters[0] + "px");
      progress.style.setProperty("--audience-progress-line-end", labelCenters[labelCenters.length - 1] + "px");

      return labelCenters.map(function (center) {
        return center - (indicatorHeight / 2);
      });
    }

    function applyCurrentSceneState(index) {
      var safeIndex = Math.max(0, Math.min(index, scenes.length - 1));

      activeSceneIndex = safeIndex;
      setActiveScene(safeIndex);

      if (wordTrack) {
        if (hasGsap) {
          window.gsap.set(wordTrack, { y: wordOffsets[safeIndex] || 0 });
        } else {
          wordTrack.style.transform = "translate3d(0, " + (wordOffsets[safeIndex] || 0) + "px, 0)";
        }
      }

      if (progressIndicator) {
        if (hasGsap) {
          window.gsap.set(progressIndicator, { y: progressStops[safeIndex] || 0 });
        } else {
          progressIndicator.style.transform = "translateX(-50%) translateY(" + (progressStops[safeIndex] || 0) + "px)";
        }
      }
    }

    function measureAudienceLayout() {
      wordOffsets = measureWordOffsets();
      progressStops = measureProgressStops();
    }

    measureAudienceLayout();
    applyCurrentSceneState(0);

    if (state.reducedMotion || !hasGsap || !window.ScrollTrigger) {
      section.classList.add("audience-showcase--static");
      return;
    }

    window.gsap.set(sticky, { backgroundColor: sceneBackgrounds[0] });

    scenes.forEach(function (scene, index) {
      window.gsap.set(scene, {
        autoAlpha: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : 24,
        scale: index === 0 ? 1 : 0.985
      });
    });

    window.ScrollTrigger.addEventListener("refreshInit", measureAudienceLayout);

    window.gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        pin: sticky,
        scrub: true,
        start: "top top",
        end: function () {
          return "+=" + Math.max(track.offsetHeight - window.innerHeight, window.innerHeight * 2.2);
        },
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: function (self) {
          activeSceneIndex = getSceneIndex(self.progress);
          setActiveScene(activeSceneIndex);
        }
      }
    })
      .to({}, { duration: 1 })
      .to(wordTrack, {
        y: function () {
          return wordOffsets[1];
        },
        duration: 1
      }, 1)
      .to(progressIndicator, {
        y: function () {
          return progressStops[1];
        },
        duration: 1
      }, 1)
      .to(sticky, {
        backgroundColor: sceneBackgrounds[1],
        duration: 1
      }, 1)
      .to(scenes[0], {
        autoAlpha: 0,
        y: 24,
        scale: 0.985,
        duration: 1,
        ease: "power2.out"
      }, 1)
      .to(scenes[1], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out"
      }, 1)
      .to(wordTrack, {
        y: function () {
          return wordOffsets[2];
        },
        duration: 1
      }, 2)
      .to(progressIndicator, {
        y: function () {
          return progressStops[2];
        },
        duration: 1
      }, 2)
      .to(sticky, {
        backgroundColor: sceneBackgrounds[2],
        duration: 1
      }, 2)
      .to(scenes[1], {
        autoAlpha: 0,
        y: 24,
        scale: 0.985,
        duration: 1,
        ease: "power2.out"
      }, 2)
      .to(scenes[2], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power2.out"
      }, 2);

    window.addEventListener("resize", function () {
      measureAudienceLayout();
      applyCurrentSceneState(activeSceneIndex);
      window.ScrollTrigger.refresh();
    });
  }

  function initFinalCta() {
    var section = document.querySelector(".final-cta");

    if (!section) {
      return;
    }

    var panel = section.querySelector(".cta-panel");
    var tabs = section.querySelectorAll(".cta-panel__tab");
    var sweep = section.querySelector(".cta-panel__theme-sweep");
    var status = section.querySelector(".cta-panel__status");
    var forms = {
      waitlist: section.querySelector(".cta-form--waitlist"),
      partner: section.querySelector(".cta-form--partner")
    };
    var activeMode = panel ? panel.getAttribute("data-mode") || "waitlist" : "waitlist";

    if (!panel || !forms.waitlist || !forms.partner) {
      return;
    }

    forms.waitlist.setAttribute("role", "tabpanel");
    forms.partner.setAttribute("role", "tabpanel");

    function setStatus(type, message) {
      status.textContent = message || "";
      status.classList.remove("is-success", "is-error", "is-visible");

      if (!message) {
        return;
      }

      status.classList.add("is-visible", "is-" + type);
    }

    function clearValidation(form) {
      Array.prototype.forEach.call(form.elements, function (field) {
        field.classList.remove("is-invalid");
        field.removeAttribute("aria-invalid");
      });
    }

    function setFieldValidity(field, isValid) {
      field.classList.toggle("is-invalid", !isValid);

      if (isValid) {
        field.removeAttribute("aria-invalid");
        return;
      }

      field.setAttribute("aria-invalid", "true");
    }

    function validateField(field) {
      var value = typeof field.value === "string" ? field.value.trim() : field.value;
      var isValid = true;

      if (field.hasAttribute("required")) {
        isValid = value !== "";
      }

      if (isValid && field.type === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      setFieldValidity(field, isValid);

      return isValid;
    }

    function validateForm(form) {
      var firstInvalid = null;
      var requiredFields = form.querySelectorAll("[required]");

      requiredFields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) {
          firstInvalid = field;
        }
      });

      return {
        isValid: !firstInvalid,
        firstInvalid: firstInvalid
      };
    }

    function setFormEnabled(form, enabled) {
      Array.prototype.forEach.call(form.elements, function (field) {
        field.disabled = !enabled;
      });
    }

    function setTabState(mode) {
      tabs.forEach(function (tab) {
        var isActive = tab.getAttribute("data-mode-target") === mode;

        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-pressed", String(isActive));
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
      });
    }

    function syncFormHeights() {
      Object.keys(forms).forEach(function (mode) {
        var form = forms[mode];
        var isActive = mode === activeMode;

        form.style.maxHeight = isActive ? form.scrollHeight + "px" : "0px";
      });
    }

    function applyModeState(mode) {
      activeMode = mode;
      panel.setAttribute("data-mode", mode);
      setTabState(mode);

      Object.keys(forms).forEach(function (key) {
        var form = forms[key];
        var isActive = key === mode;

        form.classList.toggle("is-visible", isActive);
        form.setAttribute("aria-hidden", String(!isActive));
        setFormEnabled(form, isActive);
      });

      syncFormHeights();
    }

    function animateSweep(targetMode) {
      if (!sweep || state.reducedMotion || !hasGsap) {
        return;
      }

      sweep.style.background = targetMode === "partner"
        ? "linear-gradient(110deg, rgba(215,255,0,0) 0%, rgba(215,255,0,0.34) 42%, rgba(52,209,123,0.24) 72%, rgba(215,255,0,0) 100%)"
        : "linear-gradient(110deg, rgba(248,248,243,0) 0%, rgba(248,248,243,0.72) 42%, rgba(215,255,0,0.16) 70%, rgba(248,248,243,0) 100%)";

      window.gsap.killTweensOf(sweep);
      window.gsap.fromTo(sweep, {
        xPercent: targetMode === "partner" ? -120 : 120,
        opacity: 0.82
      }, {
        xPercent: targetMode === "partner" ? 120 : -120,
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut"
      });
    }

    function animateIncomingFields(mode) {
      var form = forms[mode];

      if (!form || state.reducedMotion || !hasGsap) {
        return;
      }

      var items = form.querySelectorAll(".field-group, .cta-form__micro");

      window.gsap.killTweensOf(items);
      window.gsap.fromTo(items, {
        y: 14,
        autoAlpha: 0
      }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.34,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.08,
        clearProps: "opacity,transform,visibility"
      });
    }

    function switchMode(targetMode) {
      if (!forms[targetMode] || targetMode === activeMode) {
        return;
      }

      setStatus("", "");
      applyModeState(targetMode);
      animateSweep(targetMode);
      animateIncomingFields(targetMode);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        switchMode(tab.getAttribute("data-mode-target"));
      });

      tab.addEventListener("keydown", function (event) {
        var currentIndex = Array.prototype.indexOf.call(tabs, tab);
        var nextIndex = currentIndex;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
          nextIndex = 0;
        } else if (event.key === "End") {
          nextIndex = tabs.length - 1;
        } else {
          return;
        }

        event.preventDefault();
        tabs[nextIndex].focus();
        switchMode(tabs[nextIndex].getAttribute("data-mode-target"));
      });
    });

    Object.keys(forms).forEach(function (mode) {
      var form = forms[mode];

      form.addEventListener("submit", function (event) {
        var result;
        var successCopy;
        var errorCopy;

        event.preventDefault();
        clearValidation(form);

        result = validateForm(form);
        successCopy = mode === "partner" ? "Application queued." : "You\u2019re on it.";
        errorCopy = mode === "partner" ? "Complete the required fields." : "Enter a valid email.";

        if (!result.isValid) {
          setStatus("error", errorCopy);
          if (result.firstInvalid) {
            result.firstInvalid.focus();
          }
          return;
        }

        form.reset();
        clearValidation(form);
        syncFormHeights();
        setStatus("success", successCopy);
      });
    });

    applyModeState(activeMode);

    window.addEventListener("resize", function () {
      syncFormHeights();

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  }

  function initQuoteConfetti() {
    var pills = Array.prototype.slice.call(document.querySelectorAll(".quote-pill"));
    var confettiTimer = null;
    var liveBits = new Set();
    var colors = ["#D7FF00", "#34D17B", "#E56A3A", "#F8F8F3"];

    if (!pills.length || state.reducedMotion) {
      return;
    }

    function randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function clearBits() {
      liveBits.forEach(function (bit) {
        bit.remove();
      });
      liveBits.clear();
    }

    function isVisiblePill(pill) {
      var rect = pill.getBoundingClientRect();
      var scene = pill.closest(".audience-scene");

      if (rect.width < 1 || rect.height < 1) {
        return false;
      }

      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
        return false;
      }

      if (scene) {
        var sceneStyle = window.getComputedStyle(scene);

        if (sceneStyle.display === "none" || sceneStyle.visibility === "hidden" || parseFloat(sceneStyle.opacity || "1") < 0.28) {
          return false;
        }
      }

      return true;
    }

    function getVisiblePills() {
      return pills.filter(isVisiblePill);
    }

    function emitBurst() {
      var visiblePills;
      var pill;
      var anchor;
      var pillRect;
      var anchorRect;
      var startX;
      var startY;
      var count;

      if (state.reducedMotion || document.hidden) {
        return;
      }

      visiblePills = getVisiblePills();

      if (!visiblePills.length) {
        return;
      }

      pill = visiblePills[randomBetween(0, visiblePills.length - 1)];
      anchor = pill.querySelector(".quote-pill__confetti-anchor");

      if (!anchor) {
        return;
      }

      pillRect = pill.getBoundingClientRect();
      anchorRect = anchor.getBoundingClientRect();
      startX = anchorRect.left - pillRect.left + (anchorRect.width / 2);
      startY = anchorRect.top - pillRect.top + (anchorRect.height / 2);
      count = randomBetween(3, 6);

      for (var index = 0; index < count; index += 1) {
        (function () {
          var bit = document.createElement("span");
          var size = randomBetween(4, 7);
          var distanceX = randomBetween(10, 26) * (Math.random() > 0.5 ? 1 : -1);
          var distanceY = randomBetween(10, 24) * -1;
          var duration = randomBetween(450, 900);
          var rotation = randomBetween(-120, 120);
          var shape = randomBetween(0, 2);

          bit.className = "quote-pill__confetti-bit";
          bit.style.left = startX + "px";
          bit.style.top = startY + "px";
          bit.style.width = size + "px";
          bit.style.height = (shape === 2 ? size * 0.62 : size) + "px";
          bit.style.borderRadius = shape === 0 ? "999px" : (shape === 1 ? "3px" : "2px");
          bit.style.backgroundColor = colors[randomBetween(0, colors.length - 1)];
          bit.style.transitionDuration = duration + "ms, " + duration + "ms";

          pill.appendChild(bit);
          liveBits.add(bit);

          window.requestAnimationFrame(function () {
            bit.style.transform = "translate3d(" + distanceX + "px, " + distanceY + "px, 0) rotate(" + rotation + "deg) scale(0.7)";
            bit.style.opacity = "0";
          });

          window.setTimeout(function () {
            liveBits.delete(bit);
            bit.remove();
          }, duration + 120);
        })();
      }
    }

    function scheduleNextBurst() {
      window.clearTimeout(confettiTimer);

      if (state.reducedMotion || document.hidden) {
        clearBits();
        return;
      }

      confettiTimer = window.setTimeout(function () {
        emitBurst();
        scheduleNextBurst();
      }, randomBetween(4000, 7000));
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        window.clearTimeout(confettiTimer);
        clearBits();
        return;
      }

      scheduleNextBurst();
    });

    scheduleNextBurst();
  }

  function initApp() {
    var loaderReady = initLoader();

    initHero(loaderReady);
    initAudienceShowcase();
    initFinalCta();
    initQuoteConfetti();

    if (window.ScrollTrigger) {
      window.requestAnimationFrame(function () {
        window.ScrollTrigger.refresh();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp, { once: true });
    return;
  }

  initApp();
})();

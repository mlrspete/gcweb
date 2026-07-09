var REAL_RUST_CONTACT_EMAIL = typeof window.REAL_RUST_CONTACT_EMAIL === "string" && window.REAL_RUST_CONTACT_EMAIL.trim()
  ? window.REAL_RUST_CONTACT_EMAIL.trim()
  : "hello@realrust.com";
var REAL_RUST_CONTACT_SUBJECT = typeof window.REAL_RUST_CONTACT_SUBJECT === "string" && window.REAL_RUST_CONTACT_SUBJECT.trim()
  ? window.REAL_RUST_CONTACT_SUBJECT.trim()
  : "Real Rust conversation";

(function () {
  var hasGsap = typeof window.gsap !== "undefined";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var state = {
    reducedMotion: prefersReducedMotion.matches
  };
  var stageMotionState = {
    pointerX: 0,
    pointerY: 0,
    wheelBias: 0,
    ambientPulse: 0.32,
    revealProgress: 0,
    dockHover: 0,
    dockOpen: 0,
    loaderProgress: 0
  };

  window.REAL_RUST_REDUCED_MOTION = state.reducedMotion;
  window.REAL_RUST_STAGE_MOTION = stageMotionState;

  function setStageMotion(partial) {
    Object.keys(partial).forEach(function (key) {
      if (typeof partial[key] !== "number" || Number.isNaN(partial[key])) {
        return;
      }

      stageMotionState[key] = partial[key];
    });
  }

  function updateReducedMotion(event) {
    state.reducedMotion = event.matches;
    window.REAL_RUST_REDUCED_MOTION = state.reducedMotion;
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
    var loaderProgress = { value: 0 };

    if (!loader) {
      setStageMotion({ loaderProgress: 1 });
      return Promise.resolve();
    }

    var wordmark = loader.querySelector(".site-loader__wordmark");
    var scanline = loader.querySelector(".site-loader__scanline");
    var slab = loader.querySelector(".site-loader__slab");
    var haze = loader.querySelector(".site-loader__haze");

    document.body.classList.add("is-loading");

    return new Promise(function (resolve) {
      if (state.reducedMotion || !hasGsap) {
        setStageMotion({ loaderProgress: 1 });
        window.setTimeout(function () {
          removeLoader(loader, resolve);
        }, 60);
        return;
      }

      window.gsap.set(wordmark, {
        yPercent: 112,
        autoAlpha: 0.82,
        filter: "blur(8px)"
      });
      window.gsap.set(scanline, {
        autoAlpha: 0,
        xPercent: -120
      });
      window.gsap.set(slab, {
        opacity: 0.26,
        scale: 0.978,
        y: 12
      });
      window.gsap.set(haze, {
        autoAlpha: 0,
        scale: 0.9
      });

      window.gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: function () {
          setStageMotion({ loaderProgress: 1 });
          removeLoader(loader, resolve);
        }
      })
        .to(loaderProgress, {
          value: 1,
          duration: 1.2,
          ease: "none",
          onUpdate: function () {
            setStageMotion({ loaderProgress: loaderProgress.value });
          }
        }, 0)
        .to(wordmark, {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.36
        }, 0.08)
        .to(scanline, {
          autoAlpha: 1,
          duration: 0.06,
          ease: "none"
        }, 0.28)
        .to(scanline, {
          xPercent: 120,
          duration: 0.42,
          ease: "power2.inOut"
        }, 0.28)
        .to(haze, {
          autoAlpha: 0.82,
          scale: 1,
          duration: 0.22,
          ease: "power2.out"
        }, 0.3)
        .to(slab, {
          opacity: 0.54,
          scale: 1,
          y: 0,
          duration: 0.26,
          ease: "power2.out"
        }, 0.3)
        .to(scanline, {
          autoAlpha: 0,
          duration: 0.12,
          ease: "none"
        }, 0.66)
        .to(loader, {
          autoAlpha: 0,
          yPercent: -6,
          duration: 0.36,
          ease: "power3.inOut"
        }, 0.78);
    });
  }

  function clamp(value, minValue, maxValue) {
    return Math.min(Math.max(value, minValue), maxValue);
  }

  function buildMailtoHref(email, subject, body) {
    var searchParams = new URLSearchParams();

    if (subject) {
      searchParams.set("subject", subject);
    }

    if (body) {
      searchParams.set("body", body);
    }

    return "mailto:" + email + (searchParams.toString() ? ("?" + searchParams.toString()) : "");
  }

  function initHeroAmbientMotion() {
    var hero = document.querySelector(".hero");
    var pulseProxy = { value: 0.32 };

    if (!hero) {
      return;
    }

    hero.style.setProperty("--hero-ambient-pulse", pulseProxy.value.toFixed(3));
    hero.style.setProperty("--hero-reveal-progress", "0");
    hero.style.setProperty("--copy-halo-strength", "0.82");
    hero.style.setProperty("--slab-sheen-drift", "-18px");
    hero.style.setProperty("--slab-hover-bias", "0");
    setStageMotion({
      ambientPulse: pulseProxy.value,
      revealProgress: 0
    });

    if (state.reducedMotion || !hasGsap) {
      hero.style.setProperty("--hero-reveal-progress", "1");
      hero.style.setProperty("--copy-halo-strength", "1");
      setStageMotion({
        ambientPulse: pulseProxy.value,
        revealProgress: 1
      });
      return;
    }

    window.gsap.to(pulseProxy, {
      value: 0.94,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      onUpdate: function () {
        hero.style.setProperty("--hero-ambient-pulse", pulseProxy.value.toFixed(3));
        setStageMotion({ ambientPulse: pulseProxy.value });
      }
    });

    window.gsap.to(hero, {
      "--slab-sheen-drift": "18px",
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  function initStageDynamics() {
    var hero = document.querySelector(".hero");
    var rafId = 0;
    var current = {
      offsetX: 0,
      offsetY: 0,
      rotateX: 0,
      rotateY: 0,
      scrollShift: 0,
      wheelBias: 0
    };
    var target = {
      offsetX: 0,
      offsetY: 0,
      rotateX: 0,
      rotateY: 0,
      scrollShift: 0,
      wheelBias: 0
    };

    if (!hero || state.reducedMotion) {
      return;
    }

    function applyStyles() {
      hero.style.setProperty("--pointer-offset-x", current.offsetX.toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-y", current.offsetY.toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-x-soft", (current.offsetX * 0.24).toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-y-soft", (current.offsetY * -0.2).toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-x-reverse", (current.offsetX * -0.16).toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-y-reverse", (current.offsetY * 0.24).toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-x-core", (current.offsetX * 0.32).toFixed(2) + "px");
      hero.style.setProperty("--pointer-offset-y-core", (current.offsetY * 0.18).toFixed(2) + "px");
      hero.style.setProperty("--pointer-rotate-x", current.rotateX.toFixed(2) + "deg");
      hero.style.setProperty("--pointer-rotate-y", current.rotateY.toFixed(2) + "deg");
      hero.style.setProperty("--scroll-shift", current.scrollShift.toFixed(2) + "px");
      hero.style.setProperty("--wheel-bias", current.wheelBias.toFixed(3));
      hero.style.setProperty("--wheel-bias-soft", (current.wheelBias * 0.6).toFixed(3));
      setStageMotion({
        pointerX: current.offsetX / 16,
        pointerY: current.offsetY / 12,
        wheelBias: current.wheelBias
      });
    }

    function requestTick() {
      if (!rafId) {
        rafId = window.requestAnimationFrame(tick);
      }
    }

    function tick() {
      var totalDelta = 0;

      rafId = 0;
      totalDelta += Math.abs(target.offsetX - current.offsetX);
      totalDelta += Math.abs(target.offsetY - current.offsetY);
      totalDelta += Math.abs(target.rotateX - current.rotateX);
      totalDelta += Math.abs(target.rotateY - current.rotateY);
      totalDelta += Math.abs(target.scrollShift - current.scrollShift);
      totalDelta += Math.abs(target.wheelBias - current.wheelBias);

      current.offsetX += (target.offsetX - current.offsetX) * 0.12;
      current.offsetY += (target.offsetY - current.offsetY) * 0.12;
      current.rotateX += (target.rotateX - current.rotateX) * 0.12;
      current.rotateY += (target.rotateY - current.rotateY) * 0.12;
      current.scrollShift += (target.scrollShift - current.scrollShift) * 0.12;
      current.wheelBias += (target.wheelBias - current.wheelBias) * 0.1;
      target.wheelBias *= 0.92;

      if (Math.abs(target.wheelBias) < 0.001) {
        target.wheelBias = 0;
      }

      applyStyles();

      if (totalDelta > 0.08) {
        requestTick();
      }
    }

    function updateScrollState() {
      var rect = hero.getBoundingClientRect();
      var viewportHeight = window.innerHeight || 1;
      var progress = clamp((viewportHeight - rect.top) / (rect.height + (viewportHeight * 0.25)), 0, 1);

      target.scrollShift = progress * -18;
      requestTick();
    }

    function handlePointerMove(event) {
      var rect;
      var nx;
      var ny;

      if (event.pointerType === "touch") {
        return;
      }

      rect = hero.getBoundingClientRect();
      nx = ((event.clientX - rect.left) / rect.width) - 0.5;
      ny = ((event.clientY - rect.top) / rect.height) - 0.5;

      target.offsetX = nx * 16;
      target.offsetY = ny * 12;
      target.rotateX = ny * -5;
      target.rotateY = nx * 6;
      requestTick();
    }

    function resetPointerState() {
      target.offsetX = 0;
      target.offsetY = 0;
      target.rotateX = 0;
      target.rotateY = 0;
      requestTick();
    }

    function handleWheel(event) {
      var delta = clamp(event.deltaY / 220, -1, 1);

      target.wheelBias = clamp(target.wheelBias + (delta * 0.26), -1, 1);
      requestTick();
    }

    hero.addEventListener("pointermove", handlePointerMove);
    hero.addEventListener("pointerleave", resetPointerState);
    hero.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    applyStyles();
    updateScrollState();
  }

  function initHero(loaderReady) {
    var hero = document.querySelector(".hero");
    var brand;
    var headlineLines;
    var support;
    var ctaDock;
    var receiver;
    var slabShell;
    var slabReflection;
    var revealProxy = { value: 0 };

    if (!hero) {
      return;
    }

    brand = hero.querySelector(".hero__brand");
    headlineLines = Array.prototype.slice.call(hero.querySelectorAll(".hero__headline-line"));
    support = hero.querySelector(".hero__support");
    ctaDock = hero.querySelector(".contact-dock") || hero.querySelector(".hero__cta");
    receiver = hero.querySelector(".hero__receiver");
    slabShell = hero.querySelector(".hero__slab-shell");
    slabReflection = hero.querySelector(".hero__slab-reflection");

    if (state.reducedMotion || !hasGsap) {
      hero.style.setProperty("--hero-reveal-progress", "1");
      hero.style.setProperty("--copy-halo-strength", "1");
      setStageMotion({ revealProgress: 1 });
      return;
    }

    if (brand) {
      window.gsap.set(brand, { autoAlpha: 0, y: 10 });
    }

    if (receiver) {
      window.gsap.set(receiver, { autoAlpha: 0.12 });
    }

    if (slabShell) {
      window.gsap.set(slabShell, {
        autoAlpha: 0.82
      });
    }

    if (slabReflection) {
      window.gsap.set(slabReflection, {
        autoAlpha: 0.12
      });
    }

    window.gsap.set(headlineLines, {
      yPercent: 112,
      autoAlpha: 0.84,
      filter: "blur(8px)"
    });
    window.gsap.set(support, {
      yPercent: 104,
      autoAlpha: 0.72,
      filter: "blur(6px)"
    });

    if (ctaDock) {
      window.gsap.set(ctaDock, { autoAlpha: 0, y: 18 });
    }

    loaderReady.then(function () {
      var revealTimeline = window.gsap.timeline({
        defaults: {
          ease: "power3.out"
        },
        onUpdate: function () {
          hero.style.setProperty("--hero-reveal-progress", revealProxy.value.toFixed(3));
          setStageMotion({ revealProgress: revealProxy.value });
        },
        onComplete: function () {
          hero.style.setProperty("--hero-reveal-progress", "1");
          hero.style.setProperty("--copy-halo-strength", "1");
          setStageMotion({ revealProgress: 1 });
        }
      })
        .to(revealProxy, {
          value: 1,
          duration: 1.12,
          ease: "power2.out"
        }, 0)
        .to(hero, {
          "--copy-halo-strength": 1,
          duration: 1.02,
          ease: "power2.out"
        }, 0.02);

      if (receiver) {
        revealTimeline.to(receiver, {
          autoAlpha: 0.28,
          duration: 0.9
        }, 0);
      }

      if (slabShell) {
        revealTimeline.to(slabShell, {
          autoAlpha: 1,
          duration: 0.92
        }, 0.02);
      }

      if (slabReflection) {
        revealTimeline.to(slabReflection, {
          autoAlpha: 1,
          duration: 1.02,
          ease: "sine.out"
        }, 0.04);
      }

      if (brand) {
        revealTimeline.to(brand, {
          autoAlpha: 1,
          y: 0,
          duration: 0.4
        }, 0.06);
      }

      revealTimeline
        .to(headlineLines[0], {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.72
        }, 0.12)
        .to(headlineLines[1], {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.72
        }, 0.28)
        .to(support, {
          yPercent: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.56
        }, 0.48);

      if (ctaDock) {
        revealTimeline.to(ctaDock, {
          autoAlpha: 1,
          y: 0,
          duration: 0.48
        }, 0.66);
      }
    });
  }

  function initHeroAtmosphericOverlays(loaderReady) {
    var hero = document.querySelector(".hero");
    var overlayTrack;
    var overlayRing;
    var overlayLabel;

    if (!hero) {
      return;
    }

    overlayTrack = hero.querySelector(".hero__overlay-track");
    overlayRing = hero.querySelector(".hero__overlay-ring");
    overlayLabel = hero.querySelector(".hero__overlay-label--chamber");

    hero.style.setProperty("--overlay-track-progress", "0.18");
    hero.style.setProperty("--overlay-scan-progress", "0.06");
    hero.style.setProperty("--overlay-scan-alpha", "0");

    if (state.reducedMotion || !hasGsap) {
      hero.style.setProperty("--overlay-track-progress", "0.24");
      hero.style.setProperty("--overlay-scan-progress", "0.18");
      hero.style.setProperty("--overlay-scan-alpha", "0.16");
      return;
    }

    window.gsap.set([overlayTrack, overlayRing, overlayLabel].filter(Boolean), {
      autoAlpha: 0
    });

    loaderReady.then(function () {
      var overlayIntro = window.gsap.timeline({
        defaults: {
          ease: "power2.out"
        }
      });

      if (overlayTrack) {
        overlayIntro.to(overlayTrack, {
          autoAlpha: 1,
          duration: 0.42,
          clearProps: "opacity,visibility"
        }, 0.62);
      }

      if (overlayRing) {
        overlayIntro.to(overlayRing, {
          autoAlpha: 1,
          duration: 0.54,
          clearProps: "opacity,visibility"
        }, 0.74);
      }

      if (overlayLabel) {
        overlayIntro.to(overlayLabel, {
          autoAlpha: 1,
          duration: 0.42,
          clearProps: "opacity,visibility"
        }, 0.82);
      }

      window.gsap.timeline({
        repeat: -1,
        repeatDelay: 3.6
      })
        .set(hero, {
          "--overlay-track-progress": 0.18,
          "--overlay-scan-progress": 0.06,
          "--overlay-scan-alpha": 0
        })
        .to(hero, {
          "--overlay-scan-alpha": 0.56,
          duration: 0.18,
          ease: "sine.out"
        }, 0)
        .to(hero, {
          "--overlay-scan-progress": 0.98,
          "--overlay-track-progress": 0.82,
          duration: 1.08,
          ease: "sine.inOut"
        }, 0.02)
        .to(hero, {
          "--overlay-scan-alpha": 0,
          duration: 0.38,
          ease: "sine.in"
        }, 0.78)
        .to(hero, {
          "--overlay-track-progress": 0.26,
          duration: 1.32,
          ease: "sine.inOut"
        }, 1.22);
    });
  }

  function initHeroMicroInteractions() {
    var hero = document.querySelector(".hero");
    var dock = document.querySelector("[data-contact-dock]");
    var toggleButton = dock ? dock.querySelector("[data-contact-dock-toggle]") : null;
    var hoverProxy = { value: 0 };

    if (!hero || !dock) {
      return;
    }

    setStageMotion({
      dockHover: 0,
      dockOpen: dock.classList.contains("is-open") ? 1 : 0
    });

    if (state.reducedMotion || !hasGsap || !toggleButton) {
      return;
    }

    window.gsap.set(toggleButton, {
      "--button-hover-intensity": 0,
      "--button-sheen-progress": 0.18
    });

    function animateDockVisual(targetValue) {
      var duration = targetValue > hoverProxy.value ? 0.42 : 0.56;

      window.gsap.to(toggleButton, {
        y: targetValue > 0.45 ? -2 : 0,
        "--button-hover-intensity": targetValue > 0 ? clamp(0.24 + (targetValue * 0.76), 0, 1) : 0,
        "--button-sheen-progress": targetValue > 0 ? 1.04 : 0.18,
        duration: duration,
        ease: "power3.out",
        overwrite: true
      });
      window.gsap.to(hero, {
        "--slab-hover-bias": targetValue,
        duration: duration,
        ease: "power3.out",
        overwrite: true
      });
      window.gsap.to(hoverProxy, {
        value: targetValue,
        duration: duration,
        ease: "power3.out",
        overwrite: true,
        onUpdate: function () {
          setStageMotion({ dockHover: hoverProxy.value });
        }
      });
    }

    function getRestingValue() {
      return dock.classList.contains("is-open") ? 0.35 : 0;
    }

    toggleButton.addEventListener("pointerenter", function () {
      animateDockVisual(1);
    });
    toggleButton.addEventListener("pointerleave", function () {
      animateDockVisual(getRestingValue());
    });
    toggleButton.addEventListener("focus", function () {
      animateDockVisual(0.72);
    });
    toggleButton.addEventListener("blur", function () {
      animateDockVisual(getRestingValue());
    });

    window.REAL_RUST_SET_DOCK_VISUAL_STATE = function (isOpen) {
      setStageMotion({ dockOpen: isOpen ? 1 : 0 });
      animateDockVisual(isOpen ? 0.35 : 0);
    };
  }

  function initContactDock() {
    var dock = document.querySelector("[data-contact-dock]");
    var toggleButton = dock ? dock.querySelector("[data-contact-dock-toggle]") : null;
    var panel = dock ? dock.querySelector(".contact-dock__panel") : null;
    var emailLink = dock ? dock.querySelector("[data-contact-email]") : null;
    var copyButton = dock ? dock.querySelector("[data-contact-copy]") : null;
    var mailLink = dock ? dock.querySelector("[data-contact-mail]") : null;
    var closeButton = dock ? dock.querySelector("[data-contact-close]") : null;
    var status = dock ? dock.querySelector(".contact-dock__status") : null;
    var mailtoHref = buildMailtoHref(REAL_RUST_CONTACT_EMAIL, REAL_RUST_CONTACT_SUBJECT);
    var isOpen = false;
    var resetTimer = 0;
    var collapseTimer = 0;

    if (!dock || !toggleButton || !panel || !emailLink || !copyButton || !mailLink || !closeButton || !status) {
      return;
    }

    emailLink.textContent = REAL_RUST_CONTACT_EMAIL;
    emailLink.href = mailtoHref;
    mailLink.href = mailtoHref;

    function animateDockOpen() {
      var panelItems;

      if (state.reducedMotion || !hasGsap) {
        return;
      }

      panelItems = [emailLink, copyButton, mailLink, closeButton];
      window.gsap.killTweensOf(panelItems);
      window.gsap.set(panelItems, { autoAlpha: 0, y: 8 });
      window.gsap.to(panelItems, {
        autoAlpha: 1,
        y: 0,
        duration: 0.28,
        stagger: 0.035,
        delay: 0.02,
        ease: "power2.out",
        clearProps: "opacity,transform"
      });
    }

    function animateCopySuccess() {
      if (state.reducedMotion || !hasGsap) {
        return;
      }

      window.gsap.fromTo(copyButton, {
        scale: 0.98
      }, {
        scale: 1.04,
        duration: 0.18,
        repeat: 1,
        yoyo: true,
        ease: "power2.out",
        clearProps: "transform"
      });

      if (toggleButton) {
        window.gsap.fromTo(toggleButton, {
          "--button-sheen-progress": 0.34
        }, {
          "--button-sheen-progress": 1.06,
          duration: 0.52,
          ease: "power2.out"
        });
      }
    }

    function copyText(value) {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        return navigator.clipboard.writeText(value);
      }

      return new Promise(function (resolve, reject) {
        var textArea = document.createElement("textarea");

        textArea.value = value;
        textArea.setAttribute("readonly", "readonly");
        textArea.style.position = "fixed";
        textArea.style.top = "-999px";
        textArea.style.left = "-999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          if (!document.execCommand("copy")) {
            throw new Error("Copy command failed");
          }

          resolve();
        } catch (error) {
          reject(error);
        } finally {
          textArea.remove();
        }
      });
    }

    function clearTimers() {
      if (resetTimer) {
        window.clearTimeout(resetTimer);
        resetTimer = 0;
      }

      if (collapseTimer) {
        window.clearTimeout(collapseTimer);
        collapseTimer = 0;
      }
    }

    function setCopyState(isCopied) {
      copyButton.textContent = isCopied ? "Copied" : "Copy";
      copyButton.classList.toggle("is-success", isCopied);
    }

    function setStatus(message, isSuccess) {
      status.textContent = message || "";
      status.classList.remove("is-visible", "is-success");

      if (!message) {
        return;
      }

      status.classList.add("is-visible");

      if (isSuccess) {
        status.classList.add("is-success");
      }
    }

    function resetFeedback() {
      clearTimers();
      setCopyState(false);
      setStatus("", false);
    }

    function setPanelInteractivity(isEnabled) {
      var tabIndex = isEnabled ? 0 : -1;

      emailLink.tabIndex = tabIndex;
      copyButton.tabIndex = tabIndex;
      mailLink.tabIndex = tabIndex;
      closeButton.tabIndex = tabIndex;

      if ("inert" in panel) {
        panel.inert = !isEnabled;
      }
    }

    function syncDockState(nextOpen, options) {
      var shouldReturnFocus = !options || options.returnFocus !== false;

      isOpen = nextOpen;
      dock.classList.toggle("is-open", nextOpen);
      toggleButton.setAttribute("aria-expanded", nextOpen ? "true" : "false");
      panel.setAttribute("aria-hidden", nextOpen ? "false" : "true");
      setPanelInteractivity(nextOpen);

      if (typeof window.REAL_RUST_SET_DOCK_VISUAL_STATE === "function") {
        window.REAL_RUST_SET_DOCK_VISUAL_STATE(nextOpen);
      } else {
        setStageMotion({ dockOpen: nextOpen ? 1 : 0 });
      }

      if (!nextOpen) {
        resetFeedback();

        if (hasGsap) {
          window.gsap.set([emailLink, copyButton, mailLink, closeButton], {
            clearProps: "opacity,transform"
          });
        }

        if (shouldReturnFocus) {
          window.setTimeout(function () {
            toggleButton.focus();
          }, 20);
        }

        return;
      }

      animateDockOpen();

      if (options && options.focusMail) {
        window.setTimeout(function () {
          emailLink.focus();
        }, 20);
      }
    }

    function openDock(options) {
      syncDockState(true, options || {});
    }

    function closeDock(options) {
      syncDockState(false, options || {});
    }

    function scheduleAutoCollapse() {
      collapseTimer = window.setTimeout(function () {
        closeDock({});
      }, 1400);
    }

    toggleButton.addEventListener("click", function () {
      if (isOpen) {
        closeDock({});
        return;
      }

      openDock({});
    });

    closeButton.addEventListener("click", function () {
      closeDock({});
    });

    copyButton.addEventListener("click", function () {
      resetFeedback();

      copyText(REAL_RUST_CONTACT_EMAIL).then(function () {
        setCopyState(true);
        setStatus("Copied", true);
        animateCopySuccess();
        scheduleAutoCollapse();
      }, function () {
        setStatus("Copy failed", false);
        resetTimer = window.setTimeout(function () {
          setStatus("", false);
        }, 1600);
      });
    });

    mailLink.addEventListener("click", function () {
      if (!isOpen) {
        return;
      }

      collapseTimer = window.setTimeout(function () {
        closeDock({});
      }, 180);
    });

    document.addEventListener("pointerdown", function (event) {
      if (!isOpen || dock.contains(event.target)) {
        return;
      }

      closeDock({ returnFocus: false });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        closeDock({});
      }
    });

    window.REAL_RUST_OPEN_CONTACT_DOCK = function (options) {
      openDock(options || {});
    };
    window.REAL_RUST_CLOSE_CONTACT_DOCK = function (options) {
      closeDock(options || {});
    };
    window.REAL_RUST_OPEN_CONVERSATION = window.REAL_RUST_OPEN_CONTACT_DOCK;

    setPanelInteractivity(false);
  }

  function initConversationForm() {
    var form = document.getElementById("conversation-form");
    var emailField = document.getElementById("conversation-email");
    var brandField = document.getElementById("conversation-brand");
    var briefField = document.getElementById("conversation-brief");
    var status = form ? form.querySelector(".cta-panel__status") : null;
    var fields = [emailField, brandField, briefField];
    var resetTimer = 0;

    if (!form || !emailField || !brandField || !briefField || !status) {
      return;
    }

    function setStatus(message, tone) {
      status.textContent = message || "";
      status.classList.remove("is-visible", "is-success", "is-error");

      if (!message) {
        return;
      }

      status.classList.add("is-visible");

      if (tone === "success") {
        status.classList.add("is-success");
      }

      if (tone === "error") {
        status.classList.add("is-error");
      }
    }

    function scheduleStatusReset() {
      if (resetTimer) {
        window.clearTimeout(resetTimer);
      }

      resetTimer = window.setTimeout(function () {
        setStatus("", "");
      }, 2200);
    }

    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function setFieldValidity(field, isValid) {
      field.classList.toggle("is-invalid", !isValid);
      field.setAttribute("aria-invalid", isValid ? "false" : "true");
    }

    function validateField(field) {
      var value = field.value.trim();
      var isValid = Boolean(value);

      if (isValid && field.type === "email") {
        isValid = isValidEmail(value);
      }

      setFieldValidity(field, isValid);
      return isValid;
    }

    fields.forEach(function (field) {
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true") {
          validateField(field);
        }

        if (status.classList.contains("is-visible")) {
          setStatus("", "");
        }
      });

      field.addEventListener("blur", function () {
        validateField(field);
      });
    });

    form.addEventListener("submit", function (event) {
      var firstInvalidField = null;
      var isFormValid = true;
      var brandName;
      var subject;
      var body;
      var mailtoHref;

      event.preventDefault();

      fields.forEach(function (field) {
        var fieldValid = validateField(field);

        if (!fieldValid && !firstInvalidField) {
          firstInvalidField = field;
        }

        if (!fieldValid) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        setStatus("Check the highlighted fields.", "error");

        if (firstInvalidField) {
          firstInvalidField.focus();
        }

        scheduleStatusReset();
        return;
      }

      brandName = brandField.value.trim();
      subject = REAL_RUST_CONTACT_SUBJECT + " / " + brandName;
      body = [
        "Email: " + emailField.value.trim(),
        "Brand: " + brandName,
        "",
        "Brief:",
        briefField.value.trim()
      ].join("\n");
      mailtoHref = buildMailtoHref(REAL_RUST_CONTACT_EMAIL, subject, body);

      setStatus("Opening mail draft.", "success");
      scheduleStatusReset();
      window.location.href = mailtoHref;
    });
  }

  function getInitialFocusTargetId() {
    var params = new URLSearchParams(window.location.search);
    return params.get("focus");
  }

  function resolveFocusTargetId(targetId) {
    if (targetId === "waitlist") {
      return "conversation";
    }

    return targetId;
  }

  function applyInitialFocus(loaderReady) {
    var targetId = resolveFocusTargetId(getInitialFocusTargetId());

    if (!targetId) {
      return;
    }

    loaderReady.then(function () {
      var target;

      if (targetId === "top") {
        window.scrollTo(0, 0);

        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }

        return;
      }

      if (targetId === "conversation") {
        if (new URLSearchParams(window.location.search).get("threeexp") === "environment") {
          target = document.querySelector(".final-cta");

          if (target) {
            target.scrollIntoView({
              behavior: "auto",
              block: "end"
            });
          }

          return;
        }

        if (typeof window.REAL_RUST_OPEN_CONTACT_DOCK === "function") {
          window.REAL_RUST_OPEN_CONTACT_DOCK({ focusMail: true });
        }

        return;
      }

      target = document.getElementById(targetId);

      if (!target) {
        return;
      }

      target.scrollIntoView({
        behavior: "auto",
        block: "start"
      });

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    });
  }

  function initApp() {
    var loaderReady = initLoader();

    initHeroAmbientMotion();
    initStageDynamics();
    initHeroMicroInteractions();
    applyInitialFocus(loaderReady);
    initHero(loaderReady);
    initHeroAtmosphericOverlays(loaderReady);
    initContactDock();
    initConversationForm();

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

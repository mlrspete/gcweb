var GRUBCLUB_FORMS_ENDPOINT = "";

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

  function formatTickerValue(number) {
    return number.toLocaleString("en-US");
  }

  function isTickerDigit(character) {
    return /\d/.test(character);
  }

  function getTickerTemplate(number) {
    return formatTickerValue(Math.max(number, 1000)).split("");
  }

  function alignTickerChars(number, length) {
    var characters = formatTickerValue(number).split("");
    var aligned = new Array(length);
    var offset = length - characters.length;
    var index;

    for (index = 0; index < length; index += 1) {
      aligned[index] = index < offset ? "" : characters[index - offset];
    }

    return aligned;
  }

  function initTicker(ticker) {
    if (!ticker) {
      return;
    }

    var animationDuration = 90;
    var normalTickCadence = 98;
    var reducedTickCadence = 380;
    var value = 1000;
    var slots = [];
    var template = [];
    var templateKey = "";

    function clearDigitSlot(slot) {
      while (slot.strip.firstChild) {
        slot.strip.removeChild(slot.strip.firstChild);
      }
    }

    function createDigitCell(character) {
      var cell = document.createElement("span");
      var isEmpty = character === "";

      cell.className = "ticker-flip__digit-cell" + (isEmpty ? " is-empty" : "");
      cell.textContent = isEmpty ? "0" : character;
      return cell;
    }

    function clearSlotTimer(slot) {
      if (slot.timer) {
        window.clearTimeout(slot.timer);
        slot.timer = null;
      }
    }

    function setDigitSlot(slot, character) {
      clearSlotTimer(slot);
      slot.strip.classList.remove("is-animating");
      clearDigitSlot(slot);
      slot.strip.appendChild(createDigitCell(character));
      slot.character = character;
    }

    function animateDigitSlot(slot, fromCharacter, toCharacter) {
      clearSlotTimer(slot);
      slot.strip.classList.remove("is-animating");
      clearDigitSlot(slot);
      slot.strip.appendChild(createDigitCell(fromCharacter));
      slot.strip.appendChild(createDigitCell(toCharacter));
      void slot.strip.offsetHeight;
      slot.strip.classList.add("is-animating");
      slot.character = toCharacter;
      slot.timer = window.setTimeout(function () {
        setDigitSlot(slot, toCharacter);
      }, animationDuration + 8);
    }

    function setSeparatorSlot(slot, character) {
      slot.character = character;
      slot.el.classList.toggle("is-hidden", character !== ",");
    }

    function buildSlots(nextTemplate, seedValue) {
      var seedChars = alignTickerChars(seedValue, nextTemplate.length);
      var index;
      var slot;
      var digitWindow;
      var digitStrip;

      for (index = 0; index < slots.length; index += 1) {
        clearSlotTimer(slots[index]);
      }

      slots = [];
      template = nextTemplate.slice();
      templateKey = template.join("");
      ticker.textContent = "";

      for (index = 0; index < template.length; index += 1) {
        if (isTickerDigit(template[index])) {
          slot = {
            type: "digit",
            timer: null
          };
          slot.el = document.createElement("span");
          slot.el.className = "ticker-flip__slot ticker-flip__slot--digit";
          digitWindow = document.createElement("span");
          digitWindow.className = "ticker-flip__digit-window";
          digitStrip = document.createElement("span");
          digitStrip.className = "ticker-flip__digit-strip";
          digitWindow.appendChild(digitStrip);
          slot.el.appendChild(digitWindow);
          slot.strip = digitStrip;
          ticker.appendChild(slot.el);
          slots.push(slot);
          setDigitSlot(slot, seedChars[index]);
          continue;
        }

        slot = {
          type: "separator",
          timer: null
        };
        slot.el = document.createElement("span");
        slot.el.className = "ticker-flip__slot ticker-flip__slot--separator";
        slot.el.textContent = template[index];
        ticker.appendChild(slot.el);
        slots.push(slot);
        setSeparatorSlot(slot, seedChars[index]);
      }

      ticker.setAttribute("aria-label", formatTickerValue(seedValue));
    }

    function syncTemplate(nextValue) {
      var nextTemplate = getTickerTemplate(nextValue);
      var nextTemplateKey = nextTemplate.join("");

      if (templateKey !== nextTemplateKey) {
        buildSlots(nextTemplate, value);
      }
    }

    function renderTick(nextValue) {
      var currentChars;
      var nextChars;
      var index;
      var slot;

      syncTemplate(nextValue);
      currentChars = alignTickerChars(value, template.length);
      nextChars = alignTickerChars(nextValue, template.length);

      for (index = 0; index < slots.length; index += 1) {
        slot = slots[index];

        if (slot.type === "separator") {
          if (slot.character !== nextChars[index]) {
            setSeparatorSlot(slot, nextChars[index]);
          }
          continue;
        }

        if (currentChars[index] === nextChars[index]) {
          continue;
        }

        if (state.reducedMotion) {
          setDigitSlot(slot, nextChars[index]);
          continue;
        }

        animateDigitSlot(slot, currentChars[index], nextChars[index]);
      }

      value = nextValue;
      ticker.setAttribute("aria-label", formatTickerValue(value));
    }

    function scheduleNextTick() {
      window.setTimeout(function () {
        renderTick(value + 1);
        scheduleNextTick();
      }, state.reducedMotion ? reducedTickCadence : normalTickCadence);
    }

    buildSlots(getTickerTemplate(value), value);
    scheduleNextTick();
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
    var sceneChildGroups = scenes.map(function (scene) {
      return {
        mainCard: scene.querySelector(".audience-card--main"),
        sideCard: scene.querySelector(".audience-card--side"),
        stripChips: Array.prototype.slice.call(scene.querySelectorAll(".audience-strip span")),
        quotePills: Array.prototype.slice.call(scene.querySelectorAll(".audience-scene__quotes .quote-pill"))
      };
    });
    var playersChildren = sceneChildGroups[0];
    var playersIntroViewportRatio = 0.98;
    var playersIntroTriggerStart = "top " + Math.round(playersIntroViewportRatio * 100) + "%";
    var wordOffsets = [0, 0, 0];
    var progressStops = [0, 0, 0];
    var activeSceneIndex = 0;
    var playersIntroPlayed = false;
    var playersIntroTimeline = null;
    var phaseDurations = {
      playersHold: 1,
      playersToOwners: 1,
      ownersHold: 1.15,
      ownersToPartners: 1
    };
    var phasePoints = {
      playersHoldEnd: phaseDurations.playersHold,
      playersToOwnersEnd: phaseDurations.playersHold + phaseDurations.playersToOwners,
      ownersHoldEnd: phaseDurations.playersHold + phaseDurations.playersToOwners + phaseDurations.ownersHold,
      total: phaseDurations.playersHold + phaseDurations.playersToOwners + phaseDurations.ownersHold + phaseDurations.ownersToPartners
    };
    var childIntroOffsets = {
      sideCard: 0.08,
      chips: 0.16,
      quotes: 0.28
    };
    var childIntroDurations = {
      mainCard: 0.72,
      sideCard: 0.74,
      chips: 0.42,
      quotes: 0.5
    };
    var childTransitionDurations = {
      mainCard: 0.58,
      sideCard: 0.6,
      chips: 0.34,
      quotes: 0.4
    };
    var childTransitionOffsets = {
      incoming: 0.14,
      outgoing: 0.3,
      outgoingChips: 0.33,
      outgoingQuotes: 0.36
    };

    function shouldUseStaticAudienceShowcase() {
      return window.innerWidth <= 960 || (window.innerWidth <= 1366 && window.innerHeight <= 820);
    }

    function getSceneChildTargets(sceneChildGroup) {
      return [sceneChildGroup.mainCard, sceneChildGroup.sideCard]
        .concat(sceneChildGroup.stripChips, sceneChildGroup.quotePills)
        .filter(function (target) {
          return !!target;
        });
    }

    function setSceneChildrenAtRest(sceneChildGroup) {
      var targets = getSceneChildTargets(sceneChildGroup);

      if (!targets.length) {
        return;
      }

      window.gsap.set(targets, {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        autoAlpha: 1
      });
    }

    function setSceneChildrenToIntroState(sceneChildGroup) {
      if (!sceneChildGroup) {
        return;
      }

      if (sceneChildGroup.mainCard) {
        window.gsap.set(sceneChildGroup.mainCard, {
          y: 34,
          scale: 0.985,
          rotate: -0.8,
          autoAlpha: 0
        });
      }

      if (sceneChildGroup.sideCard) {
        window.gsap.set(sceneChildGroup.sideCard, {
          x: 18,
          y: 38,
          scale: 0.985,
          rotate: 0.8,
          autoAlpha: 0
        });
      }

      if (sceneChildGroup.stripChips.length) {
        window.gsap.set(sceneChildGroup.stripChips, {
          y: 18,
          autoAlpha: 0
        });
      }

      if (sceneChildGroup.quotePills.length) {
        window.gsap.set(sceneChildGroup.quotePills, {
          x: 8,
          y: 14,
          scale: 0.98,
          autoAlpha: 0
        });
      }
    }

    function hasPlayersIntroStartPassed() {
      return section.getBoundingClientRect().top <= (window.innerHeight * playersIntroViewportRatio);
    }

    function syncPlayersIntroState() {
      if (!playersChildren) {
        return;
      }

      if (playersIntroTimeline) {
        playersIntroTimeline.kill();
        playersIntroTimeline = null;
      }

      if (playersIntroPlayed || hasPlayersIntroStartPassed()) {
        playersIntroPlayed = true;
        setSceneChildrenAtRest(playersChildren);
        return;
      }

      setSceneChildrenToIntroState(playersChildren);
    }

    function addSceneChildIntro(timeline, sceneChildGroup, startTime, durations, setupTime) {
      var introSetupTime = typeof setupTime === "number" ? setupTime : startTime;

      if (sceneChildGroup.mainCard) {
        timeline
          .set(sceneChildGroup.mainCard, {
            y: 34,
            scale: 0.985,
            rotate: -0.8,
            autoAlpha: 0
          }, introSetupTime)
          .to(sceneChildGroup.mainCard, {
            y: 0,
            scale: 1,
            rotate: 0,
            autoAlpha: 1,
            duration: durations.mainCard,
            ease: "power3.out",
            overwrite: "auto"
          }, startTime);
      }

      if (sceneChildGroup.sideCard) {
        timeline
          .set(sceneChildGroup.sideCard, {
            x: 18,
            y: 38,
            scale: 0.985,
            rotate: 0.8,
            autoAlpha: 0
          }, introSetupTime)
          .to(sceneChildGroup.sideCard, {
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            autoAlpha: 1,
            duration: durations.sideCard,
            ease: "power3.out",
            overwrite: "auto"
          }, startTime + childIntroOffsets.sideCard);
      }

      if (sceneChildGroup.stripChips.length) {
        timeline
          .set(sceneChildGroup.stripChips, {
            y: 18,
            autoAlpha: 0
          }, introSetupTime)
          .to(sceneChildGroup.stripChips, {
            y: 0,
            autoAlpha: 1,
            duration: durations.chips,
            stagger: 0.045,
            ease: "power2.out",
            overwrite: "auto"
          }, startTime + childIntroOffsets.chips);
      }

      if (sceneChildGroup.quotePills.length) {
        timeline
          .set(sceneChildGroup.quotePills, {
            x: 8,
            y: 14,
            scale: 0.98,
            autoAlpha: 0
          }, introSetupTime)
          .to(sceneChildGroup.quotePills, {
            x: 0,
            y: 0,
            scale: 1,
            autoAlpha: 1,
            duration: durations.quotes,
            stagger: 0.08,
            ease: "power3.out",
            overwrite: "auto"
          }, startTime + childIntroOffsets.quotes);
      }
    }

    function addSceneChildOutro(timeline, sceneChildGroup, transitionStart) {
      var cardTargets = [sceneChildGroup.mainCard, sceneChildGroup.sideCard].filter(function (target) {
        return !!target;
      });

      if (cardTargets.length) {
        timeline.to(cardTargets, {
          y: -8,
          autoAlpha: 0,
          duration: 0.34,
          ease: "power2.inOut",
          overwrite: "auto"
        }, transitionStart + childTransitionOffsets.outgoing);
      }

      if (sceneChildGroup.stripChips.length) {
        timeline.to(sceneChildGroup.stripChips, {
          y: -6,
          autoAlpha: 0,
          duration: 0.24,
          stagger: 0.03,
          ease: "power2.inOut",
          overwrite: "auto"
        }, transitionStart + childTransitionOffsets.outgoingChips);
      }

      if (sceneChildGroup.quotePills.length) {
        timeline.to(sceneChildGroup.quotePills, {
          y: -8,
          autoAlpha: 0,
          duration: 0.24,
          stagger: 0.04,
          ease: "power2.inOut",
          overwrite: "auto"
        }, transitionStart + childTransitionOffsets.outgoingQuotes);
      }
    }

    function addSceneChildTransitionIn(timeline, sceneChildGroup, transitionStart) {
      addSceneChildIntro(
        timeline,
        sceneChildGroup,
        transitionStart + childTransitionOffsets.incoming,
        childTransitionDurations,
        transitionStart
      );
    }

    function playPlayersIntro() {
      if (playersIntroPlayed || !playersChildren) {
        return;
      }

      playersIntroPlayed = true;

      if (playersIntroTimeline) {
        playersIntroTimeline.kill();
      }

      playersIntroTimeline = window.gsap.timeline({
        defaults: {
          overwrite: "auto"
        },
        onComplete: function () {
          playersIntroTimeline = null;
          setSceneChildrenAtRest(playersChildren);
        },
        onInterrupt: function () {
          playersIntroTimeline = null;
        }
      });

      if (playersChildren.mainCard) {
        playersIntroTimeline.fromTo(playersChildren.mainCard, {
          y: 34,
          scale: 0.985,
          rotate: -0.8,
          autoAlpha: 0
        }, {
          y: 0,
          scale: 1,
          rotate: 0,
          autoAlpha: 1,
          duration: childIntroDurations.mainCard,
          ease: "power3.out"
        }, 0);
      }

      if (playersChildren.sideCard) {
        playersIntroTimeline.fromTo(playersChildren.sideCard, {
          x: 18,
          y: 38,
          scale: 0.985,
          rotate: 0.8,
          autoAlpha: 0
        }, {
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          autoAlpha: 1,
          duration: childIntroDurations.sideCard,
          ease: "power3.out"
        }, childIntroOffsets.sideCard);
      }

      if (playersChildren.stripChips.length) {
        playersIntroTimeline.fromTo(playersChildren.stripChips, {
          y: 18,
          autoAlpha: 0
        }, {
          y: 0,
          autoAlpha: 1,
          duration: childIntroDurations.chips,
          stagger: 0.045,
          ease: "power2.out"
        }, childIntroOffsets.chips);
      }

      if (playersChildren.quotePills.length) {
        playersIntroTimeline.fromTo(playersChildren.quotePills, {
          x: 8,
          y: 14,
          scale: 0.98,
          autoAlpha: 0
        }, {
          x: 0,
          y: 0,
          scale: 1,
          autoAlpha: 1,
          duration: childIntroDurations.quotes,
          stagger: 0.08,
          ease: "power3.out"
        }, childIntroOffsets.quotes);
      }
    }

    function setActiveScene(index) {
      words.forEach(function (word, wordIndex) {
        word.classList.toggle("is-active", wordIndex === index);
      });
    }

    function getSceneIndex(progressValue) {
      var timelinePosition = progressValue * phasePoints.total;

      if (timelinePosition >= (phasePoints.ownersHoldEnd + (phaseDurations.ownersToPartners / 2))) {
        return 2;
      }

      if (timelinePosition >= (phasePoints.playersHoldEnd + (phaseDurations.playersToOwners / 2))) {
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

    if (state.reducedMotion || !hasGsap || !window.ScrollTrigger || shouldUseStaticAudienceShowcase()) {
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

    sceneChildGroups.forEach(function (sceneChildGroup) {
      setSceneChildrenAtRest(sceneChildGroup);
    });

    syncPlayersIntroState();

    window.ScrollTrigger.addEventListener("refreshInit", function () {
      measureAudienceLayout();
      syncPlayersIntroState();
    });

    window.ScrollTrigger.create({
      trigger: section,
      start: playersIntroTriggerStart,
      end: "top top",
      invalidateOnRefresh: true,
      onEnter: function () {
        playPlayersIntro();
      },
      onRefresh: function () {
        syncPlayersIntroState();
      }
    });

    var showcaseTimeline = window.gsap.timeline({
      defaults: {
        ease: "none"
      },
      scrollTrigger: {
        trigger: section,
        pin: sticky,
        scrub: true,
        start: "top top",
        end: function () {
          return "+=" + (Math.max(track.offsetHeight - window.innerHeight, window.innerHeight * 2.2) + window.innerHeight);
        },
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onEnter: function () {
          playPlayersIntro();
        },
        onRefresh: function (self) {
          if (playersIntroTimeline) {
            playersIntroTimeline.kill();
            playersIntroTimeline = null;
          }

          if (self.isActive) {
            playersIntroPlayed = true;

            if (activeSceneIndex === 0) {
              setSceneChildrenAtRest(sceneChildGroups[0]);
            }
          }
        },
        onUpdate: function (self) {
          activeSceneIndex = getSceneIndex(self.progress);
          setActiveScene(activeSceneIndex);
        }
      }
    })
      .to({}, { duration: phaseDurations.playersHold })
      .to(wordTrack, {
        y: function () {
          return wordOffsets[1];
        },
        duration: phaseDurations.playersToOwners
      }, phasePoints.playersHoldEnd)
      .to(progressIndicator, {
        y: function () {
          return progressStops[1];
        },
        duration: phaseDurations.playersToOwners
      }, phasePoints.playersHoldEnd)
      .to(sticky, {
        backgroundColor: sceneBackgrounds[1],
        duration: phaseDurations.playersToOwners
      }, phasePoints.playersHoldEnd)
      .to(scenes[0], {
        autoAlpha: 0,
        y: 24,
        scale: 0.985,
        duration: phaseDurations.playersToOwners,
        ease: "power2.out"
      }, phasePoints.playersHoldEnd)
      .to(scenes[1], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: phaseDurations.playersToOwners,
        ease: "power2.out"
      }, phasePoints.playersHoldEnd)
      .to({}, { duration: phaseDurations.ownersHold }, phasePoints.playersToOwnersEnd)
      .to(wordTrack, {
        y: function () {
          return wordOffsets[2];
        },
        duration: phaseDurations.ownersToPartners
      }, phasePoints.ownersHoldEnd)
      .to(progressIndicator, {
        y: function () {
          return progressStops[2];
        },
        duration: phaseDurations.ownersToPartners
      }, phasePoints.ownersHoldEnd)
      .to(sticky, {
        backgroundColor: sceneBackgrounds[2],
        duration: phaseDurations.ownersToPartners
      }, phasePoints.ownersHoldEnd)
      .to(scenes[1], {
        autoAlpha: 0,
        y: 24,
        scale: 0.985,
        duration: phaseDurations.ownersToPartners,
        ease: "power2.out"
      }, phasePoints.ownersHoldEnd)
      .to(scenes[2], {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: phaseDurations.ownersToPartners,
        ease: "power2.out"
      }, phasePoints.ownersHoldEnd);

    addSceneChildOutro(showcaseTimeline, sceneChildGroups[0], phasePoints.playersHoldEnd);
    addSceneChildTransitionIn(showcaseTimeline, sceneChildGroups[1], phasePoints.playersHoldEnd);
    addSceneChildOutro(showcaseTimeline, sceneChildGroups[1], phasePoints.ownersHoldEnd);
    addSceneChildTransitionIn(showcaseTimeline, sceneChildGroups[2], phasePoints.ownersHoldEnd);

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
    var isSubmitting = false;

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

    function getEndpointUrl() {
      return typeof GRUBCLUB_FORMS_ENDPOINT === "string" ? GRUBCLUB_FORMS_ENDPOINT.trim() : "";
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

    function setTabsBusy(isBusy) {
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-disabled", String(isBusy));
      });
    }

    function getFieldValue(form, name) {
      var field = form.elements[name];
      var value = field ? field.value : "";

      return typeof value === "string" ? value.trim() : value;
    }

    function buildSubmissionPayload(mode, form) {
      var payload = {
        formType: mode,
        submittedAt: new Date().toISOString(),
        pageUrl: window.location.href,
        userAgent: window.navigator.userAgent || "",
        email: getFieldValue(form, "email")
      };

      if (mode === "partner") {
        payload.name = getFieldValue(form, "name");
        payload.type = getFieldValue(form, "type");
        payload.link = getFieldValue(form, "link");
        payload.message = getFieldValue(form, "message");
      }

      return payload;
    }

    function setSubmitButtonLoadingState(form, isLoading, loadingLabel) {
      var submitButton = form.querySelector("[type=\"submit\"]");

      if (!submitButton) {
        return;
      }

      if (!submitButton.hasAttribute("data-default-label")) {
        submitButton.setAttribute("data-default-label", submitButton.textContent);
      }

      submitButton.textContent = isLoading
        ? loadingLabel
        : submitButton.getAttribute("data-default-label");
    }

    function finishFormSubmission(form) {
      isSubmitting = false;
      form.removeAttribute("aria-busy");
      setSubmitButtonLoadingState(form, false);
      setTabsBusy(false);
      applyModeState(activeMode);
    }

    function submitFormPayload(endpointUrl, payload) {
      if (typeof window.fetch !== "function") {
        return Promise.reject(new Error("Fetch unavailable"));
      }

      return window.fetch(endpointUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "omit",
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) {
          throw new Error("Request failed");
        }

        return response;
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
      if (isSubmitting || !forms[targetMode] || targetMode === activeMode) {
        return;
      }

      setStatus("", "");
      applyModeState(targetMode);
      animateSweep(targetMode);
      animateIncomingFields(targetMode);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        if (isSubmitting) {
          return;
        }

        switchMode(tab.getAttribute("data-mode-target"));
      });

      tab.addEventListener("keydown", function (event) {
        var currentIndex = Array.prototype.indexOf.call(tabs, tab);
        var nextIndex = currentIndex;

        if (isSubmitting) {
          event.preventDefault();
          return;
        }

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
        var endpointUrl;
        var payload;
        var result;
        var successCopy;
        var validationErrorCopy;
        var networkErrorCopy;

        event.preventDefault();
        clearValidation(form);

        result = validateForm(form);
        successCopy = mode === "partner" ? "Nice. We\u2019ve got your application." : "Nice. You\u2019re on the list.";
        validationErrorCopy = mode === "partner" ? "Complete the required fields." : "Enter a valid email.";
        networkErrorCopy = mode === "partner"
          ? "Couldn\u2019t send right now. Try again or DM us."
          : "Couldn\u2019t send right now. Try again in a sec.";

        if (!result.isValid) {
          setStatus("error", validationErrorCopy);
          if (result.firstInvalid) {
            result.firstInvalid.focus();
          }
          return;
        }

        endpointUrl = getEndpointUrl();

        if (!endpointUrl) {
          setStatus("error", "Forms aren\u2019t wired yet. Add the endpoint and try again.");
          return;
        }

        payload = buildSubmissionPayload(mode, form);
        isSubmitting = true;
        setTabsBusy(true);
        setStatus("", "");
        form.setAttribute("aria-busy", "true");
        setSubmitButtonLoadingState(form, true, "sending\u2026");
        setFormEnabled(form, false);

        submitFormPayload(endpointUrl, payload)
          .then(function () {
            form.reset();
            clearValidation(form);
            syncFormHeights();
            setStatus("success", successCopy);
          }, function () {
            setStatus("error", networkErrorCopy);
          })
          .then(function () {
            finishFormSubmission(form);
          }, function () {
            finishFormSubmission(form);
          });
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

    function isRenderedAndVisible(element) {
      var current = element;
      var style;

      while (current && current !== document.body) {
        style = window.getComputedStyle(current);

        if (style.display === "none" || style.visibility === "hidden" || parseFloat(style.opacity || "1") < 0.28) {
          return false;
        }

        current = current.parentElement;
      }

      return true;
    }

    function isVisiblePill(pill) {
      var rect = pill.getBoundingClientRect();

      if (rect.width < 1 || rect.height < 1) {
        return false;
      }

      if (rect.bottom < 0 || rect.top > window.innerHeight || rect.right < 0 || rect.left > window.innerWidth) {
        return false;
      }

      return isRenderedAndVisible(pill);
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
      }, randomBetween(2200, 3800));
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

  function getInitialFocusTargetId() {
    var params = new URLSearchParams(window.location.search);

    return params.get("focus");
  }

  function applyInitialFocus(loaderReady) {
    var targetId = getInitialFocusTargetId();

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

    applyInitialFocus(loaderReady);
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

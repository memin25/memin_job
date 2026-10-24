const terminalScript = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", html: "Muhammed Emin Arslan<br>Full Stack Developer · İstanbul" },
  { kind: "cmd", text: "stack" },
  { kind: "out", text: "Flutter · React · Python · Dart · Flask" },
  { kind: "cmd", text: "available" },
  { kind: "out", html: '<span class="ok">true</span> — freelance &amp; iş birliği' },
];

const paletteItems = [
  { title: "Teslimler", hint: "teslim edilen işler", href: "#teslimler" },
  { title: "Hakkımda", hint: "/hakkimda", href: "#hakkimda" },
  { title: "Hizmetler", hint: "ne yaptırmak istiyorsunuz", href: "#hizmetler" },
  { title: "Yetkinlikler", hint: "/stack", href: "#yetkinlikler" },
  { title: "İletişim", hint: "form + kanallar", href: "#iletisim" },
  { title: "Okuma Atölyesi", hint: "okumaatolyesi.com", href: "https://okumaatolyesi.com" },
  { title: "Digiturk Online", hint: "digiturk-online.com", href: "https://digiturk-online.com" },
  { title: "Trendyol Klonu", hint: "GitHub", href: "https://github.com/memin25/Trendyol_clone" },
  { title: "Eventify", hint: "GitHub", href: "https://github.com/memin25/Eventify_mobile_app" },
];

const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isCoarse = () => window.matchMedia("(pointer: coarse)").matches;

function runBoot() {
  const boot = document.getElementById("boot");
  if (!boot) return;
  if (prefersReduced() || sessionStorage.getItem("mea-booted")) {
    boot.classList.add("is-done");
    return;
  }
  window.setTimeout(() => {
    boot.classList.add("is-done");
    sessionStorage.setItem("mea-booted", "1");
  }, 800);
}

function typeTerminal() {
  const root = document.getElementById("terminal");
  if (!root) return;

  if (prefersReduced()) return;

  root.innerHTML = "";
  let step = 0;

  const writeCommand = (text, done) => {
    const line = document.createElement("p");
    line.className = "term-line";
    const prompt = document.createElement("span");
    prompt.className = "prompt";
    prompt.textContent = "$";
    const cmd = document.createElement("span");
    const caret = document.createElement("span");
    caret.className = "caret";
    line.append(prompt, cmd, caret);
    root.append(line);

    let i = 0;
    const tick = () => {
      cmd.textContent = text.slice(0, i);
      if (i <= text.length) {
        i += 1;
        window.setTimeout(tick, 38);
        return;
      }
      caret.remove();
      done();
    };
    tick();
  };

  const writeOutput = (item) => {
    const out = document.createElement("p");
    out.className = "term-out";
    if (item.html) out.innerHTML = item.html;
    else out.textContent = item.text;
    root.append(out);
  };

  const next = () => {
    if (step >= terminalScript.length) {
      const idle = document.createElement("p");
      idle.className = "term-line";
      idle.innerHTML = '<span class="prompt">$</span><span class="caret"></span>';
      root.append(idle);
      return;
    }

    const item = terminalScript[step];
    step += 1;
    if (item.kind === "cmd") {
      writeCommand(item.text, () => window.setTimeout(next, 180));
      return;
    }
    writeOutput(item);
    window.setTimeout(next, 220);
  };

  next();
}

function observeReveal() {
  const nodes = document.querySelectorAll("[data-reveal]");
  if (!nodes.length) return;

  if (prefersReduced() || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((node) => io.observe(node));
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const run = (el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    if (prefersReduced()) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => io.observe(el));
}

function setupProjectTilt() {
  if (isCoarse() || prefersReduced()) return;

  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--tilt-y", `${(x - 0.5) * 8}deg`);
      card.style.setProperty("--tilt-x", `${(0.5 - y) * 8}deg`);
    });
    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function setupTokens() {
  document.querySelectorAll(".token").forEach((token) => {
    token.addEventListener("click", () => {
      document.querySelectorAll(".token.is-open").forEach((open) => {
        if (open !== token) open.classList.remove("is-open");
      });
      token.classList.toggle("is-open");
    });
  });
}

function setupCopy() {
  const button = document.getElementById("copy-snippet");
  const code = document.getElementById("snippet-code");
  if (!button || !code) return;

  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      button.textContent = "Kopyalandı";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = "Kopyala";
        button.classList.remove("is-copied");
      }, 1400);
    } catch {
      button.textContent = "Seçip kopyala";
    }
  });
}

function setupPalette() {
  const palette = document.getElementById("palette");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-list");
  const hint = document.getElementById("kbd-hint");
  const mod = document.getElementById("kbd-mod");
  if (!palette || !input || !list) return;

  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (mod) mod.textContent = isMac ? "⌘" : "Ctrl";

  let active = 0;
  let visible = paletteItems;

  const render = () => {
    list.innerHTML = visible
      .map(
        (item, index) =>
          `<li class="${index === active ? "is-active" : ""}">
            <a class="palette-item" href="${item.href}" data-index="${index}">
              <span>${item.title}</span>
              <small>${item.hint}</small>
            </a>
          </li>`
      )
      .join("");
  };

  const open = () => {
    palette.hidden = false;
    input.value = "";
    visible = paletteItems;
    active = 0;
    render();
    input.focus();
  };

  const close = () => {
    palette.hidden = true;
  };

  const go = (href) => {
    close();
    if (/^https?:/.test(href)) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (href.startsWith("#")) {
      window.location.hash = href;
      document.querySelector(href)?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" });
      return;
    }
    window.location.href = href;
  };

  hint?.addEventListener("click", open);
  palette.addEventListener("click", (event) => {
    if (event.target === palette) close();
  });

  list.addEventListener("click", (event) => {
    const link = event.target.closest("a");
    if (!link) return;
    event.preventDefault();
    go(link.getAttribute("href"));
  });

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    visible = paletteItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q)
    );
    active = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      active = Math.min(active + 1, visible.length - 1);
      render();
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(active - 1, 0);
      render();
    }
    if (event.key === "Enter" && visible[active]) {
      event.preventDefault();
      go(visible[active].href);
    }
    if (event.key === "Escape") close();
  });

  window.addEventListener("keydown", (event) => {
    const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
    if (!combo) {
      if (event.key === "Escape" && !palette.hidden) close();
      return;
    }
    event.preventDefault();
    if (palette.hidden) open();
    else close();
  });

  render();
}

function setupCursorTrail() {
  const canvas = document.getElementById("cursor-trail");
  if (!canvas || isCoarse() || prefersReduced()) return;

  const ctx = canvas.getContext("2d");
  const points = [];
  let cssWidth = window.innerWidth;
  let cssHeight = window.innerHeight;

  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    cssWidth = window.innerWidth;
    cssHeight = window.innerHeight;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener(
    "pointermove",
    (event) => {
      const rect = canvas.getBoundingClientRect();
      points.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        life: 1,
      });
      if (points.length > 18) points.shift();
    },
    { passive: true }
  );

  const draw = () => {
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    points.forEach((point, index) => {
      point.life -= 0.045;
      if (point.life <= 0) return;
      const next = points[index + 1];
      if (!next) return;
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(next.x, next.y);
      ctx.strokeStyle = `rgba(212, 165, 116, ${point.life * 0.55})`;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

function setupChrome() {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  const year = document.getElementById("year");
  let lastScrollY = window.scrollY || 0;

  if (year) year.textContent = String(new Date().getFullYear());

  const getScrollY = () => {
    const scrolling = document.scrollingElement || document.documentElement;
    return Math.max(scrolling.scrollTop, window.scrollY, 0);
  };

  const setHeaderHidden = (hidden) => {
    if (!header) return;
    if (nav?.classList.contains("is-open")) hidden = false;
    header.classList.toggle("is-hidden", hidden);
    toggle?.classList.toggle("is-hidden", hidden);
  };

  const onScroll = () => {
    const y = getScrollY();
    header?.classList.toggle("is-scrolled", y > 8);
    if (y <= 40) {
      setHeaderHidden(false);
      lastScrollY = y;
      return;
    }
    if (y > lastScrollY) setHeaderHidden(true);
    else if (y < lastScrollY) setHeaderHidden(false);
    lastScrollY = y;
  };

  lastScrollY = getScrollY();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle?.addEventListener("click", () => {
    const open = nav?.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    const label = toggle.querySelector("em");
    if (label) label.textContent = open ? "Kapat" : "Menü";
    if (open) {
      header?.classList.remove("is-hidden");
      toggle.classList.remove("is-hidden");
    }
  });

  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle?.setAttribute("aria-expanded", "false");
      const label = toggle?.querySelector("em");
      if (label) label.textContent = "Menü";
    });
  });
}

function setupTickerHoverPause() {
  const ticker = document.querySelector(".ticker");
  const track = document.querySelector(".ticker-track");
  if (!ticker || !track || prefersReduced()) return;

  const getAnim = () => track.getAnimations()[0];

  ticker.addEventListener("mouseenter", () => {
    const anim = getAnim();
    if (!anim) return;
    anim.playbackRate = 1;
    anim.pause();
  });

  ticker.addEventListener("mouseleave", () => {
    const anim = getAnim();
    if (!anim) return;
    anim.playbackRate = 1;
    anim.play();
  });
}

function setupDreamSection() {
  const phraseEl = document.getElementById("dream-phrase");
  const stepsRoot = document.getElementById("dream-steps");
  if (!phraseEl) return;

  const phrases = [
    "mobil uygulama",
    "kurumsal web sitesi",
    "stok takip sistemi",
    "e-ticaret platformu",
    "admin paneli",
    "raporlama ekranı",
  ];
  const steps = stepsRoot ? [...stepsRoot.querySelectorAll("li")] : [];
  let phraseIndex = 0;
  let stepIndex = 0;
  let phraseTimer;
  let stepTimer;

  const setPhrase = (next, animate = true) => {
    phraseIndex = (next + phrases.length) % phrases.length;
    if (!animate) {
      phraseEl.textContent = phrases[phraseIndex];
      return;
    }
    phraseEl.classList.add("is-changing");
    window.setTimeout(() => {
      phraseEl.textContent = phrases[phraseIndex];
      phraseEl.classList.remove("is-changing");
    }, 320);
  };

  const setStep = (next) => {
    if (!steps.length) return;
    stepIndex = (next + steps.length) % steps.length;
    steps.forEach((step, i) => step.classList.toggle("is-active", i === stepIndex));
  };

  if (prefersReduced()) {
    phraseEl.textContent = phrases[0];
    setStep(0);
    return;
  }

  const startLoops = () => {
    window.clearInterval(phraseTimer);
    window.clearInterval(stepTimer);
    phraseTimer = window.setInterval(() => setPhrase(phraseIndex + 1), 2800);
    stepTimer = window.setInterval(() => setStep(stepIndex + 1), 3200);
  };

  setPhrase(0, false);
  setStep(0);
  startLoops();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(phraseTimer);
      window.clearInterval(stepTimer);
      return;
    }
    startLoops();
  });
}

function setupHeroGallery() {
  const root = document.getElementById("hero-gallery");
  if (!root) return;

  const slides = [...root.querySelectorAll(".hero-banner-slide")];
  const dots = [...root.querySelectorAll(".hero-banner-dots button")];
  const viewport = root.querySelector(".hero-banner-viewport");
  const title = document.getElementById("hero-gallery-title");
  const flag = document.getElementById("hero-gallery-flag");
  if (!slides.length) return;

  let index = 0;
  let timer;

  const syncViewportRatio = (slide) => {
    if (!viewport || !slide) return;
    const width = Number(slide.dataset.width);
    const height = Number(slide.dataset.height);
    if (width > 0 && height > 0) {
      viewport.style.aspectRatio = `${width} / ${height}`;
      return;
    }
    const img = slide.querySelector("img");
    if (img?.naturalWidth && img.naturalHeight) {
      viewport.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
    }
  };

  const apply = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-on", i === index);
      dot.setAttribute("aria-selected", i === index ? "true" : "false");
    });
    const active = slides[index];
    syncViewportRatio(active);
    if (title) title.textContent = active.dataset.title || "";
    if (flag) flag.textContent = active.dataset.flag || "";
  };

  const start = () => {
    window.clearInterval(timer);
    if (prefersReduced()) return;
    timer = window.setInterval(() => apply(index + 1), 5200);
  };

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      apply(i);
      start();
    });
  });

  slides.forEach((slide) => {
    const img = slide.querySelector("img");
    if (!img) return;
    if (img.complete) return;
    img.addEventListener("load", () => {
      if (slide.classList.contains("is-active")) syncViewportRatio(slide);
    }, { once: true });
  });

  apply(0);
  start();
}

function setupServiceFilters() {
  const root = document.querySelector(".service-filters");
  const grid = document.querySelector(".service-grid");
  const modal = document.getElementById("service-modal");
  const modalPanel = document.getElementById("service-modal-panel");
  const moreBtn = document.getElementById("service-more-btn");
  const moreWrap = moreBtn?.closest(".service-more-wrap");
  const cards = grid ? [...grid.querySelectorAll(".service")] : [];
  if (!root || !cards.length) return;

  cards.forEach((card) => {
    if (!card.querySelector(".service-body")) {
      const body = document.createElement("div");
      body.className = "service-body";
      const lede = card.querySelector(":scope > p:not(.service-no):not(.service-for):not(.tag)");
      const includes = card.querySelector(".service-includes");
      const link = card.querySelector(":scope > .service-contact-btn");
      if (lede) {
        lede.classList.add("service-lede");
        body.append(lede);
      }
      if (includes) body.append(includes);
      if (link) body.append(link);
      card.append(body);
    }
    if (!card.querySelector(".service-open-btn")) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "service-open-btn";
      btn.textContent = "Devamını gör";
      card.append(btn);
    }
  });

  const PAGE = 3;
  let filter = "all";
  let shown = PAGE;

  const matchesFilter = (card) => {
    const cats = (card.dataset.cat || "").split(/\s+/);
    return filter === "all" || cats.includes(filter);
  };

  const apply = () => {
    const matched = cards.filter(matchesFilter);
    if (shown > matched.length) shown = matched.length;
    matched.forEach((card, index) => {
      card.classList.toggle("is-hidden", index >= shown);
    });
    cards.filter((card) => !matchesFilter(card)).forEach((card) => {
      card.classList.add("is-hidden");
    });
    const allVisible = shown >= matched.length;
    if (moreBtn) moreBtn.hidden = allVisible;
    if (moreWrap) moreWrap.hidden = allVisible;
  };

  const MODAL_MS = prefersReduced() ? 220 : 540;

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("service-modal-open");
    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) modal.hidden = true;
    }, MODAL_MS);
  };

  const openModal = (card) => {
    if (!modal || !modalPanel) return;
    modal.classList.remove("is-open");
    modalPanel.innerHTML = "";
    ["service-no", "tag"].forEach((sel) => {
      const el = card.querySelector(`.${sel}`);
      if (el) modalPanel.append(el.cloneNode(true));
    });
    const title = card.querySelector("h3");
    if (title) {
      const clone = title.cloneNode(true);
      clone.id = "service-modal-title";
      modalPanel.append(clone);
    }
    const forEl = card.querySelector(".service-for");
    if (forEl) modalPanel.append(forEl.cloneNode(true));
    const body = card.querySelector(".service-body");
    if (body) modalPanel.append(body.cloneNode(true));

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("service-modal-open");
    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add("is-open"));
    });
  };

  grid?.addEventListener("click", (event) => {
    const openBtn = event.target.closest(".service-open-btn");
    if (!openBtn) return;
    const card = openBtn.closest(".service");
    if (card) openModal(card);
  });

  modal?.querySelectorAll("[data-service-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) closeModal();
  });

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    filter = button.dataset.filter || "all";
    shown = PAGE;
    root.querySelectorAll("button").forEach((item) => item.classList.toggle("is-on", item === button));
    apply();
  });

  moreBtn?.addEventListener("click", () => {
    const matched = cards.filter(matchesFilter);
    shown = Math.min(shown + PAGE, matched.length);
    apply();
  });

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  runBoot();
  setupChrome();
  typeTerminal();
  observeReveal();
  animateCounters();
  setupProjectTilt();
  setupTokens();
  setupCopy();
  setupPalette();
  setupCursorTrail();
  setupServiceFilters();
  setupHeroGallery();
  setupDreamSection();
  setupTickerHoverPause();
});

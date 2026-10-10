const GITHUB_USER = "memin25";

const terminalScript = [
  { kind: "cmd", text: "whoami" },
  { kind: "out", html: "Muhammed Emin Arslan<br>Full Stack Developer · İstanbul" },
  { kind: "cmd", text: "stack" },
  { kind: "out", text: "Flutter · React · Python · Dart · Flask" },
  { kind: "cmd", text: "available" },
  { kind: "out", html: '<span class="ok">true</span> — freelance &amp; iş birliği' },
];

const paletteItems = [
  { title: "Projeler", hint: "seçili işler", href: "#projeler" },
  { title: "Hakkımda", hint: "/hakkimda", href: "#hakkimda" },
  { title: "Deneyim", hint: "/deneyim", href: "#deneyim" },
  { title: "Yetkinlikler", hint: "/stack", href: "#yetkinlikler" },
  { title: "İletişim", hint: "form + kanallar", href: "#iletisim" },
  { title: "GitHub aktivite", hint: "canlı veri", href: "#github" },
  { title: "Özgeçmiş", hint: "PDF", href: "ozgecmis.html" },
  { title: "SQ Akademi", hint: "lib/features/learn/home.dart", href: "#projeler" },
  { title: "Trendyol Klonu", hint: "GitHub", href: "https://github.com/memin25/Trendyol_clone" },
  { title: "Eventify", hint: "GitHub", href: "https://github.com/memin25/Eventify_mobile_app" },
  { title: "XReport", hint: "staj · web", href: "#projeler" },
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
      button.textContent = "kopyalandı";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = "kopyala";
        button.classList.remove("is-copied");
      }, 1400);
    } catch {
      button.textContent = "seçip kopyala";
    }
  });
}

function relativeTime(date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)} dk önce`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} gün önce`;
  return date.toLocaleDateString("tr-TR");
}

async function loadGitHub() {
  const langsRoot = document.getElementById("gh-langs");
  const eventsRoot = document.getElementById("gh-events");
  if (!langsRoot || !eventsRoot) return;

  try {
    const [reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=12`),
    ]);

    if (!reposRes.ok || !eventsRes.ok) throw new Error("GitHub yanıt vermedi");

    const repos = await reposRes.json();
    const events = await eventsRes.json();

    const totals = {};
    repos.forEach((repo) => {
      if (!repo.language || repo.fork) return;
      totals[repo.language] = (totals[repo.language] || 0) + 1;
    });

    const ranked = Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const sum = ranked.reduce((acc, [, count]) => acc + count, 0) || 1;

    if (!ranked.length) {
      langsRoot.innerHTML = '<p class="gh-fallback">Henüz dil verisi yok.</p>';
    } else {
      langsRoot.innerHTML = ranked
        .map(([lang, count]) => {
          const pct = Math.round((count / sum) * 100);
          return `<div class="gh-lang"><span>${lang}<b>${pct}%</b></span><div class="gh-bar"><i style="--w:${pct}%"></i></div></div>`;
        })
        .join("");
      requestAnimationFrame(() => {
        langsRoot.querySelectorAll(".gh-bar i").forEach((bar) => {
          bar.style.width = bar.style.getPropertyValue("--w");
        });
      });
    }

    const useful = events
      .filter((event) => ["PushEvent", "CreateEvent", "PullRequestEvent"].includes(event.type))
      .slice(0, 5);

    if (!useful.length) {
      eventsRoot.innerHTML = '<li class="gh-fallback">Herkese açık son olay bulunamadı.</li>';
      return;
    }

    eventsRoot.innerHTML = useful
      .map((event) => {
        const repo = event.repo?.name?.replace(`${GITHUB_USER}/`, "") || "repo";
        const when = relativeTime(new Date(event.created_at));
        const message =
          event.type === "PushEvent"
            ? event.payload?.commits?.at(-1)?.message || "push"
            : event.type === "PullRequestEvent"
              ? event.payload?.pull_request?.title || "pull request"
              : `create ${event.payload?.ref_type || "repo"}`;
        return `<li><strong>${repo}</strong>${message}<small>${when}</small></li>`;
      })
      .join("");
  } catch {
    langsRoot.innerHTML = '<p class="gh-fallback">GitHub şu an yanıt vermiyor. Profil: memin25</p>';
    eventsRoot.innerHTML = '<li class="gh-fallback">Canlı olaylar yüklenemedi.</li>';
  }
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
  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener(
    "pointermove",
    (event) => {
      points.push({ x: event.clientX, y: event.clientY, life: 1 });
      if (points.length > 18) points.shift();
    },
    { passive: true }
  );

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
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
    if (label) label.textContent = open ? "kapat" : "menü";
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
      if (label) label.textContent = "menü";
    });
  });
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
  loadGitHub();
});

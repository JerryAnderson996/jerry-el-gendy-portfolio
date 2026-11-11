/* =========================================================
   Jerry Anderson El Gendy — interactions
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------------------------------------------------
     1. Background: agent / data-pipeline graph
     --------------------------------------------------------- */
  const canvas = $("#graph-bg");
  const ctx = canvas.getContext("2d");
  let W, H, DPR, nodes = [], packets = [], mouse = { x: -9999, y: -9999 };
  const LINK = 150;
  const COLORS = ["34,211,238", "167,139,250", "52,211,153"];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 17000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25 * DPR,
      vy: (Math.random() - 0.5) * 0.25 * DPR,
      r: (Math.random() * 1.6 + 1) * DPR,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
    packets = [];
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    const link = LINK * DPR;
    const edges = [];

    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
      // subtle mouse attraction
      const dx = mouse.x * DPR - n.x, dy = mouse.y * DPR - n.y;
      const d = Math.hypot(dx, dy);
      if (d < 180 * DPR) { n.x += dx * 0.002; n.y += dy * 0.002; }
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < link) {
          const o = (1 - d / link) * 0.35;
          ctx.strokeStyle = `rgba(148,163,184,${o})`;
          ctx.lineWidth = DPR * 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          edges.push([i, j]);
        }
      }
    }

    for (const n of nodes) {
      ctx.fillStyle = `rgba(${n.c},0.9)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }

    // data packets travelling along edges
    if (edges.length && packets.length < 14 && Math.random() < 0.08) {
      const [a, b] = edges[Math.floor(Math.random() * edges.length)];
      packets.push({ a, b, t: 0, s: 0.008 + Math.random() * 0.012, c: COLORS[Math.floor(Math.random() * 2)] });
    }
    packets = packets.filter((p) => {
      p.t += p.s;
      const A = nodes[p.a], B = nodes[p.b];
      if (!A || !B || p.t >= 1 || Math.hypot(A.x - B.x, A.y - B.y) > link) return false;
      const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 7 * DPR);
      g.addColorStop(0, `rgba(${p.c},1)`); g.addColorStop(1, `rgba(${p.c},0)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 7 * DPR, 0, Math.PI * 2); ctx.fill();
      return true;
    });

    if (!prefersReduced && !document.hidden) requestAnimationFrame(step);
  }

  resize();
  step();
  addEventListener("resize", () => { resize(); if (prefersReduced) step(); });
  addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
  document.addEventListener("visibilitychange", () => { if (!document.hidden && !prefersReduced) requestAnimationFrame(step); });

  /* ---------------------------------------------------------
     2. Hero: rotating role
     --------------------------------------------------------- */
  const roles = ["AI Engineer", "Data Engineer", "Agentic Systems Builder", "GenAI on Azure", "Intelligent Automation"];
  const roleEl = $("#roleTyper");
  (async function typeRoles() {
    if (prefersReduced) { roleEl.textContent = "AI Engineer & Data Engineer"; return; }
    let i = 0;
    while (true) {
      const word = roles[i % roles.length];
      for (let k = 0; k <= word.length; k++) { roleEl.textContent = word.slice(0, k); await sleep(65); }
      await sleep(1900);
      for (let k = word.length; k >= 0; k--) { roleEl.textContent = word.slice(0, k); await sleep(30); }
      await sleep(250);
      i++;
    }
  })();

  /* ---------------------------------------------------------
     3. Hero: agent reasoning trace
     --------------------------------------------------------- */
  const scenarios = [
    [
      '$ uv run cai_agent.py --file sinistro_0423.pdf',
      '◆ [plan]   estraggo veicoli, circostanze, schema e firme',
      '→ [tool]   content_understanding.analyze(pdf)',
      '✓ [obs]    2 veicoli · 17 campi · schema sinistro rilevato',
      '→ [tool]   detect_signatures(page=1)',
      '✓ [obs]    firma A: presente · firma B: presente',
      '◆ [think]  circostanze 8 + 13 → tamponamento in coda',
      '→ [tool]   azure_openai.summarize(dinamica)',
      '{ "veicoli": 2, "firme_ok": true,',
      '  "dinamica": "B tampona A in fase di arresto" }',
      '✔ completato in 4.1s',
    ],
    [
      '$ uv run pdf_agent.py specifiche_tecniche.pdf',
      '◆ [plan]   documento da 742 pagine → navigo per indice',
      '→ [tool]   read_toc()',
      '✓ [obs]    38 sezioni individuate',
      '→ [tool]   goto_section("4.2 Tracciati record")',
      '◆ [think]  servono solo le tabelle con codice campo',
      '→ [tool]   extract_tables(pages=[211..236])',
      '✓ [obs]    126 record validati con Pydantic',
      '{ "section": "4.2", "records": 126,',
      '  "schema": "FieldSpec", "errors": 0 }',
      '✔ completato in 38.7s',
    ],
    [
      '$ POST /api/chat  x-tenant: bank-01',
      '→ [apim]   managed identity ✓ · tenant isolato',
      '◆ [think]  domanda su policy interne → uso search',
      '→ [tool]   ai_search.query(k=5, filter="tenant eq bank-01")',
      '✓ [obs]    5 chunk rilevanti (score > 0.82)',
      '◆ [think]  sintetizzo con citazioni alle fonti',
      '→ [llm]    azure_openai.chat(context=5)',
      '{ "answer": "…", "citations": 3,',
      '  "latency_ms": 912 }',
      '✔ risposta inviata al widget',
    ],
  ];

  function lineClass(t) {
    if (t.startsWith("$")) return "c-green";
    if (t.startsWith("◆")) return "c-violet";
    if (t.startsWith("→")) return "c-cyan";
    if (t.startsWith("✓")) return "";
    if (t.startsWith("✔")) return "c-green";
    if (t.startsWith("{") || t.startsWith("  ")) return "c-yellow";
    return "";
  }

  const trace = $("#agentTrace");
  (async function runTrace() {
    if (prefersReduced) {
      trace.innerHTML = scenarios[0].map((l) => `<span class="line ${lineClass(l)}">${escapeHTML(l)}</span>`).join("");
      return;
    }
    let s = 0;
    while (true) {
      trace.innerHTML = "";
      for (const text of scenarios[s % scenarios.length]) {
        const span = document.createElement("span");
        span.className = "line " + lineClass(text);
        trace.appendChild(span);
        const speed = text.startsWith("$") ? 28 : 9;
        for (let k = 1; k <= text.length; k++) { span.textContent = text.slice(0, k); trace.scrollTop = trace.scrollHeight; await sleep(speed); }
        await sleep(text.startsWith("→") ? 520 : 220);
      }
      await sleep(3200);
      s++;
    }
  })();

  /* ---------------------------------------------------------
     4. Nav: scroll state, active link, mobile menu
     --------------------------------------------------------- */
  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 30), { passive: true });
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", links).forEach((a) => a.addEventListener("click", () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); }));

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        $$("a", links).forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("section[id]").forEach((s) => sectionObs.observe(s));

  /* ---------------------------------------------------------
     5. Reveal on scroll + counters
     --------------------------------------------------------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add("visible");
      $$("[data-count]", el).forEach(countUp);
      revealObs.unobserve(el);
      // once revealed, drop the reveal transition so hover/tilt effects stay snappy
      setTimeout(() => { el.classList.remove("reveal"); el.style.transitionDelay = ""; }, 1200);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealObs.observe(el);
  });

  function countUp(el) {
    const target = +el.dataset.count;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = prefix + target + suffix; return; }
    const start = performance.now(), dur = 1500;
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---------------------------------------------------------
     6. Project cards: glow + tilt
     --------------------------------------------------------- */
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (!prefersReduced) {
        const rx = ((y / r.height) - 0.5) * -6, ry = ((x / r.width) - 0.5) * 6;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      }
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });

  /* ---------------------------------------------------------
     7. Interactive shell
     --------------------------------------------------------- */
  const out = $("#shellOut");
  const form = $("#shellForm");
  const input = $("#shellIn");
  const history = [];
  let hIndex = -1;

  const L = "https://www.linkedin.com/in/jerry-el-gendy";
  const commands = {
    help: () => `<span class="c-violet">Comandi disponibili:</span>
  <span class="c-cyan">whoami</span>       chi sono
  <span class="c-cyan">impact</span>       metriche e risultati misurabili
  <span class="c-cyan">experience</span>   il mio percorso professionale completo
  <span class="c-cyan">projects</span>     progetti AI, agentici e hackathon
  <span class="c-cyan">skills</span>       stack tecnologico (78+ competenze)
  <span class="c-cyan">education</span>    formazione accademica e bootcamp
  <span class="c-cyan">certs</span>        licenze e certificazioni
  <span class="c-cyan">languages</span>    lingue
  <span class="c-cyan">contact</span>      come contattarmi
  <span class="c-cyan">linkedin</span>     apri il profilo LinkedIn (2.1k+ follower)
  <span class="c-cyan">clear</span>        pulisci il terminale
<span class="c-muted">Suggerimento: usa ↑ ↓ per la cronologia e Tab per l'autocompletamento.</span>`,

    whoami: () => `<span class="c-green">Jerry Anderson El Gendy</span> — AI Engineer @ Deda AI (Dedagroup) | Data Engineer · Milano
<span class="c-violet">// ENHANCE HUMAN DECISION</span>
Progetto soluzioni di Generative AI, architetture agentiche (LangChain, CrewAI, MCP)
e pipeline ETL enterprise (Azure Data Factory, SQL Server) per l'automazione di
processi bancari complessi.`,

    about: () => commands.whoami(),

    impact: () => `<span class="c-green">-30%</span> tempi di migrazione ed elaborazione flussi dati (Mediobanca su ADF)
<span class="c-green">+25%</span> efficienza di processo ETL tramite parallelizzazione cloud
<span class="c-green">-20%</span> tempi di esecuzione su query SQL Server complesse
<span class="c-cyan">700+</span> pagine tecniche mappate in JSON da agenti autonomi + Qdrant
<span class="c-violet">2.121</span> follower e <span class="c-violet">500+</span> collegamenti su LinkedIn`,

    experience: () => `<span class="c-violet">[Gen 2026 → oggi]</span>  <span class="c-green">AI Engineer</span> @ Deda AI (Dedagroup) · Full-time
                   Intelligent Automation (LLM + RPA) per Solution Bank,
                   pipeline moduli CAI (Azure Content Understanding + OpenAI),
                   chatbot RAG multi-tenant su Azure.
<span class="c-violet">[Ott 2023 → 2026]</span>  <span class="c-green">Data Engineer</span> @ Dedagroup · Apprendistato (2a 4m)
                   Pipeline ETL su Azure Data Factory per Mediobanca (-30% tempi,
                   +25% efficienza), SQL Server (-20% query time), Engage One (Centrico).
<span class="c-violet">[Mar → Ott 2023]</span>   <span class="c-green">Junior Java Developer</span> @ Gruppo SCAI · Stage (8m)
                   Formazione tecnica e sviluppo su Java, OOP, Spring Boot, REST API, SQL.`,

    projects: () => `<span class="c-cyan">01</span> Agentic PDF Intelligence System
   agenti autonomi e multi-agente su 700+ pagine → Qdrant + JSON strutturato
   <span class="c-muted">Python (uv) · LangChain · CrewAI · Qdrant · Pydantic · FastAPI</span>
<span class="c-cyan">02</span> CAI Claims Analysis Pipeline
   estrazione dati, circostanze, schema sinistro, firme, dinamica in JSON
   <span class="c-muted">Azure Content Understanding · Azure OpenAI · PyMuPDF · Pillow</span>
<span class="c-cyan">03</span> Multi-tenant RAG Chatbot on Azure
   AI Search · Functions · Container Apps · APIM · managed identity
   <span class="c-muted">agente con tool di ricerca + widget web enterprise</span>
<span class="c-cyan">04</span> WhatsCity — Hackathon Re-GenerAction (A2A)
   app partecipativa Smart City presentata ai vertici A2A
   <span class="c-muted">AI · IoT · Gamification · Sostenibilità urbana</span>`,

    skills: () => `<span class="c-violet">ai/</span>    Agenti IA · LangChain · CrewAI · MCP · Advanced RAG · LLMOps
       Azure AI Foundry &amp; Studio · Azure OpenAI · Qdrant · LLM Locali
       Fine-tuning · Prompting · Pydantic · FastAPI
<span class="c-cyan">data/</span>  Azure Data Factory · SQL Server (SSMS) · Oracle PL/SQL · MongoDB
       Alteryx · Informatica CDI · Power Automate (RPA) · Engage One
<span class="c-green">dev/</span>   Python (uv) · Java &amp; Spring Boot · Docker · Microservizi &amp; REST
       Azure Container Apps · Functions · APIM · Git · Agile/Scrum`,

    education: () => `<span class="c-green">UNINETTUNO Roma</span> — B.Sc. Ingegneria Informatica <span class="c-muted">(2023 – 2027)</span>
<span class="c-green">Generation Italy</span> — Corso Junior Java Developer 500h <span class="c-muted">(Nov 2022 – Mar 2023)</span>
<span class="c-green">Liceo Scientifico Elio Vittorini</span> — Diploma <span class="c-muted">(Milano, 2010 – 2015)</span>`,

    certs: () => `✔ AI Python for Beginners — DeepLearning.AI <span class="c-muted">(05/2026)</span>
✔ AI per Sviluppo Software — Generation <span class="c-muted">(04/2026 · Credly)</span>
✔ Guida allo sviluppo sicuro di .NET con OWASP Top 10 — Microsoft Learn <span class="c-muted">(2026)</span>
✔ Alteryx Designer Core — Alteryx <span class="c-muted">(08/2025 – 08/2027 · Credly)</span>
✔ CDI Implementation Practitioner — Informatica <span class="c-muted">(03/2025)</span>`,

    languages: () => `🇮🇹 Italiano   madrelingua
🇬🇧 Inglese    professionale
🇪🇸 Spagnolo   buono`,

    contact: () => `email     <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a>
telefono  <a href="tel:+393911883405">+39 391 188 3405</a>
linkedin  <a href="${L}" target="_blank" rel="noopener">in/jerry-el-gendy</a>`,

    linkedin: () => { window.open(L, "_blank", "noopener"); return `Apro <a href="${L}" target="_blank" rel="noopener">LinkedIn</a>…`; },
    email: () => { location.href = "mailto:elgendyjerry@gmail.com"; return "Apro il client email…"; },
    ls: () => `<span class="c-cyan">experience/</span>  <span class="c-cyan">projects/</span>  <span class="c-cyan">skills/</span>  cv.md  contact.txt`,
    date: () => new Date().toLocaleString("it-IT"),
    sudo: (args) => args.join(" ").toLowerCase().includes("hire")
      ? `<span class="c-green">[sudo] permesso concesso ✔</span>  Ottima scelta! Scrivimi a <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a> 🚀`
      : `<span class="c-pink">guest non è nel file sudoers.</span> Prova: <span class="c-cyan">sudo hire jerry</span>`,
    clear: () => { out.innerHTML = ""; return null; },
  };
  const names = Object.keys(commands);

  function print(html, cls = "") {
    const div = document.createElement("div");
    div.className = "out " + cls;
    div.innerHTML = html;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function run(raw) {
    const line = raw.trim();
    print(`<span class="c-green">guest@jerry</span><span class="c-muted">:</span><span class="c-cyan">~</span><span class="c-muted">$</span> <span class="cmd">${escapeHTML(line)}</span>`);
    if (!line) return;
    history.unshift(line); hIndex = -1;
    const [cmd, ...args] = line.split(/\s+/);
    const fn = commands[cmd.toLowerCase()];
    if (!fn) { print(`<span class="c-pink">comando non trovato: ${escapeHTML(cmd)}</span> — digita <span class="c-cyan">help</span>`); return; }
    const res = fn(args);
    if (res) print(res);
  }

  print(`<span class="c-violet">jerry-agent v1.0</span> <span class="c-muted">— runtime pronto.</span>
Digita <span class="c-cyan">help</span> per vedere i comandi, oppure clicca un suggerimento qui sotto.`);

  form.addEventListener("submit", (e) => { e.preventDefault(); run(input.value); input.value = ""; });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hIndex < history.length - 1) input.value = history[++hIndex];
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hIndex = Math.max(-1, hIndex - 1);
      input.value = hIndex >= 0 ? history[hIndex] : "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      const v = input.value.trim().toLowerCase();
      const match = names.filter((n) => n.startsWith(v));
      if (match.length === 1) input.value = match[0];
      else if (match.length > 1) print(match.join("  "), "c-muted");
    }
  });
  $("#shellBox").addEventListener("click", (e) => { if (!e.target.closest("a, button")) input.focus({ preventScroll: true }); });
  $$("#shellSuggest button").forEach((b) => b.addEventListener("click", () => { run(b.dataset.cmd); input.focus({ preventScroll: true }); }));

  /* ---------------------------------------------------------
     8. Floating AI Chatbot Widget
     --------------------------------------------------------- */
  const chatWidget = $("#chatWidget");
  const chatFab = $("#chatFab");
  const chatPanel = $("#chatPanel");
  const chatClose = $("#chatClose");
  const chatReset = $("#chatReset");
  const chatMessages = $("#chatMessages");
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chatQuick = $("#chatQuick");

  const kb = [
    {
      keys: ["ciao", "salve", "buongiorno", "buonasera", "hey", "hello", "hi", "chi sei", "presentati"],
      trace: "agent.greet() · profile_context loaded",
      reply: `Ciao! 👋 Sono l'<strong>AI Agent di Jerry Anderson El Gendy</strong>.<br><br>
Jerry è un <strong>AI Engineer @ Deda AI (Dedagroup)</strong> e <strong>Data Engineer</strong> a Milano, specializzato in <strong>Agentic AI, Pipeline ETL Enterprise e Architetture RAG</strong>.<br><br>
Chiedimi pure dei suoi <a href="#progetti">progetti AI</a>, dell'esperienza in <a href="#percorso">Deda AI e Dedagroup</a>, delle <a href="#competenze">competenze tecniche</a> o di come <a href="#contatti">contattarlo</a>!`
    },
    {
      keys: ["deda", "lavoro", "ruolo", "attuale", "oggi", "occupi", "esperienza", "carriera", "percorso", "aziend", "solution bank"],
      trace: "rag.retrieve(collection='experience', top_k=3)",
      reply: `Ecco il percorso professionale di Jerry:
<ul>
  <li><strong>AI Engineer @ Deda AI (Dedagroup)</strong> <em>(Gen 2026 – Presente · Full-time)</em>: sviluppa flussi di Intelligent Automation per <strong>Solution Bank</strong> (agenti LLM + RPA), pipeline di Document Intelligence per moduli CAI e chatbot RAG multi-tenant su Azure.</li>
  <li><strong>Data Engineer @ Dedagroup</strong> <em>(Ott 2023 – Gen 2026 · 2a 4m)</em>: pipeline ETL su Azure Data Factory per <strong>Mediobanca</strong> (<strong>-30%</strong> tempi di migrazione, <strong>+25%</strong> efficienza), ottimizzazione query SQL Server (<strong>-20%</strong> tempi) e automazioni Engage One per <strong>Centrico</strong>.</li>
  <li><strong>Junior Java Developer @ Gruppo SCAI</strong> <em>(Mar – Ott 2023)</em>: formazione tecnica e sviluppo Java, OOP, Spring Boot, REST API e SQL.</li>
</ul>`
    },
    {
      keys: ["progett", "rag", "pdf", "cai", "sinistr", "chatbot", "agent", "qdrant", "whatscity", "a2a", "hackathon"],
      trace: "rag.retrieve(collection='projects_and_agents', top_k=4)",
      reply: `Jerry ha realizzato soluzioni AI &amp; agentiche enterprise e progetti d'innovazione:
<ul>
  <li><strong>Agentic PDF Intelligence System</strong>: agenti autonomi e multi-agente (LangChain, CrewAI, Qdrant, Pydantic, FastAPI) che navigano e mappano in JSON documenti tecnici da <strong>700+ pagine</strong>.</li>
  <li><strong>CAI Claims Analysis Pipeline</strong>: analisi moduli di constatazione amichevole con <strong>Azure Content Understanding</strong> e <strong>Azure OpenAI</strong> (dati, circostanze, schema sinistro, firme e sintesi JSON).</li>
  <li><strong>Multi-tenant RAG Chatbot on Azure</strong>: architettura completa con Azure AI Search, Azure Functions, Container Apps, widget web, APIM e Managed Identity.</li>
  <li><strong>WhatsCity (Hackathon A2A Re-GenerAction)</strong>: app Smart City con AI, IoT e gamification presentata ai vertici A2A.</li>
</ul>`
    },
    {
      keys: ["risultat", "metric", "impatto", "etl", "mediobanca", "data engineer", "sql", "data factory", "adf", "percentual", "numeri", "performance"],
      trace: "sql_metrics.query(target='dedagroup_etl_kpi')",
      reply: `Come Data Engineer in Dedagroup (su flussi bancari <strong>Mediobanca</strong> e <strong>Centrico</strong>), Jerry ha ottenuto risultati misurabili:
<ul>
  <li>📉 <strong>-30% nei tempi di elaborazione e migrazione</strong> da sistemi legacy al cloud su Azure Data Factory.</li>
  <li>⚡ <strong>+25% di efficienza di processo</strong> eliminando i colli di bottiglia tramite logiche di parallelizzazione cloud.</li>
  <li>🔍 <strong>-20% nei tempi di esecuzione</strong> di query complesse su SQL Server.</li>
  <li>📄 Automazione documentale dinamica multicanale con <strong>Engage One</strong>.</li>
</ul>`
    },
    {
      keys: ["skill", "competenz", "stack", "tecnologi", "linguagg", "framework", "strument", "python", "azure", "langchain", "crewai", "mcp", "java"],
      trace: "agent.inspect_skills(total=78)",
      reply: `Lo stack tecnologico di Jerry unisce <strong>AI Engineering</strong> e <strong>Data Engineering</strong>:
<ul>
  <li><strong>AI &amp; Agentic:</strong> Agenti Autonomi, LangChain, CrewAI, protocollo MCP, Advanced RAG, Azure AI Foundry &amp; Studio, Azure OpenAI, Qdrant (Vector DB), LLMOps, LLM Locali, Fine-tuning, Pydantic, FastAPI.</li>
  <li><strong>Data &amp; Automation:</strong> Azure Data Factory, SQL Server (SSMS), Oracle PL/SQL, MongoDB, Alteryx, Informatica CDI, RPA (Power Automate), Engage One.</li>
  <li><strong>Software &amp; Cloud:</strong> Python (ecosistema <code>uv</code>), Java &amp; Spring Boot, Docker, Azure Container Apps, Azure Functions, APIM, Git, Agile/Scrum.</li>
</ul>`
    },
    {
      keys: ["certificazion", "attestat", "credly", "alteryx", "informatica", "deeplearning", "owasp"],
      trace: "rag.retrieve(collection='certifications')",
      reply: `Jerry possiede <strong>5 certificazioni e badge</strong> verificati:
<ul>
  <li>🏅 <strong>AI Python for Beginners</strong> — DeepLearning.AI (05/2026)</li>
  <li>🏅 <strong>AI per Sviluppo Software</strong> — Generation / Credly (04/2026)</li>
  <li>🏅 <strong>Sviluppo sicuro .NET con OWASP Top 10</strong> — Microsoft Learn (2026)</li>
  <li>🏅 <strong>Alteryx Designer Core</strong> — Alteryx (08/2025 – 08/2027)</li>
  <li>🏅 <strong>CDI Implementation Practitioner</strong> — Informatica (03/2025)</li>
</ul>`
    },
    {
      keys: ["studi", "universit", "laurea", "uninettuno", "istruzione", "formazione", "generation", "scuola", "liceo", "lingue", "inglese", "spagnolo"],
      trace: "rag.retrieve(collection='education_and_languages')",
      reply: `<strong>Formazione &amp; Lingue:</strong>
<ul>
  <li>🎓 <strong>B.Sc. Ingegneria Informatica</strong> — Università UNINETTUNO Roma (2023 – 2027, focus Data Engineering &amp; GenAI).</li>
  <li>💻 <strong>Bootcamp Junior Java Developer (500 ore)</strong> — Generation Italy (2022 – 2023).</li>
  <li>🌍 <strong>Lingue:</strong> Italiano (madrelingua), Inglese (professionale), Spagnolo (buono).</li>
</ul>`
    },
    {
      keys: ["contatt", "email", "mail", "telefono", "numero", "cellulare", "linkedin", "assumer", "hire", "colloquio", "collabora", "scriver", "dove"],
      trace: "tool.get_contact_card()",
      reply: `Puoi contattare Jerry direttamente qui (è a <strong>Milano</strong>, operativo in modalità ibrida/remota):
<ul>
  <li>📧 <strong>Email:</strong> <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a></li>
  <li>📱 <strong>Telefono:</strong> <a href="tel:+393911883405">+39 391 188 3405</a></li>
  <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jerry-el-gendy" target="_blank" rel="noopener">linkedin.com/in/jerry-el-gendy</a> (2.121 follower · 500+ collegamenti)</li>
</ul>`
    }
  ];

  function addBotMessage(html, traceText = "agent.respond()") {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg bot";
    wrap.innerHTML = `<span class="chat-trace">⚡ ${escapeHTML(traceText)}</span><div class="chat-bubble">${html}</div>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addUserMessage(text) {
    const wrap = document.createElement("div");
    wrap.className = "chat-msg user";
    wrap.innerHTML = `<div class="chat-bubble">${escapeHTML(text)}</div>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function findAnswer(query) {
    const q = query.toLowerCase();
    let best = null, bestScore = 0;
    for (const item of kb) {
      let score = 0;
      for (const k of item.keys) {
        if (q.includes(k)) score += k.length;
      }
      if (score > bestScore) { bestScore = score; best = item; }
    }
    if (best) return best;
    return {
      trace: "agent.fallback_router()",
      reply: `Posso raccontarti tutto su Jerry! Prova a chiedermi:
<ul>
  <li>Quali <strong>progetti Agentic AI &amp; RAG</strong> ha sviluppato</li>
  <li>Cosa fa come <strong>AI Engineer in Deda AI</strong> o i risultati ottenuti in <strong>Dedagroup</strong> (-30% tempi ETL)</li>
  <li>Il suo <strong>stack tecnologico</strong> (Python, LangChain, CrewAI, MCP, Azure, SQL) e le <strong>certificazioni</strong></li>
  <li>I suoi <strong>contatti</strong> (<a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a> · <a href="tel:+393911883405">+39 391 188 3405</a>)</li>
</ul>`
    };
  }

  let busy = false;
  async function handleQuestion(text) {
    const clean = text.trim();
    if (!clean || busy) return;
    busy = true;
    addUserMessage(clean);

    const typing = document.createElement("div");
    typing.className = "chat-msg bot";
    typing.innerHTML = `<div class="chat-typing"><i></i><i></i><i></i></div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    await sleep(prefersReduced ? 80 : 520);
    typing.remove();

    const ans = findAnswer(clean);
    addBotMessage(ans.reply, ans.trace);
    busy = false;
  }

  function initChat() {
    chatMessages.innerHTML = "";
    addBotMessage(
      `Ciao! 👋 Sono l'<strong>assistente AI di Jerry</strong>.<br>Chiedimi pure qualsiasi cosa sulle sue esperienze in <strong>Deda AI &amp; Dedagroup</strong>, sui progetti <strong>Agentic AI / RAG</strong>, sullo stack tecnico o su come contattarlo.`,
      "agent.init(model='jerry-rag-v2')"
    );
  }

  function toggleChat(force) {
    const open = typeof force === "boolean" ? force : !chatWidget.classList.contains("open");
    chatWidget.classList.toggle("open", open);
    chatFab.setAttribute("aria-expanded", open);
    chatPanel.setAttribute("aria-hidden", !open);
    if (open) setTimeout(() => chatInput.focus({ preventScroll: true }), 150);
  }

  initChat();
  chatFab.addEventListener("click", () => toggleChat());
  chatClose.addEventListener("click", () => toggleChat(false));
  chatReset.addEventListener("click", () => initChat());
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = chatInput.value;
    chatInput.value = "";
    handleQuestion(val);
  });
  $$("button", chatQuick).forEach((b) => {
    b.addEventListener("click", () => handleQuestion(b.dataset.q));
  });
  $$(".chat-messages").forEach((el) => {
    el.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^='#']");
      if (a && innerWidth < 600) toggleChat(false);
    });
  });

  /* ---------------------------------------------------------
     9. Misc: copy email, toast, year
     --------------------------------------------------------- */
  const toast = $("#toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  $("#copyEmail").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("elgendyjerry@gmail.com"); showToast("✔ Email copiata negli appunti"); }
    catch { showToast("elgendyjerry@gmail.com"); }
  });
  $("#year").textContent = new Date().getFullYear();
})();

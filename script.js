/* =========================================================
   Jerry Anderson El Gendy — Multilingual (EN/IT/DE/FR/ES)
   + Real Gemini LLM Chatbot (/api/chat) with local RAG fallback
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------------------------------------------------
     0. Multilingual Dictionary (Default: EN | IT, DE, FR, ES)
     --------------------------------------------------------- */
  let currentLang = "en";

  const I18N = {
    en: {
      nav_profile: "About", nav_journey: "Experience", nav_projects: "Projects", nav_skills: "Skills", nav_shell: "Shell", nav_contact: "Contact",
      hero_status: "AI Engineer @ <strong>Deda AI</strong> (Dedagroup)",
      hero_hello: "Hi, I'm",
      hero_lead: "Specialized in <strong>Agentic AI</strong>, <strong>Enterprise ETL Pipelines</strong>, and <strong>RAG Architectures</strong>. I design autonomous agents, multi-agent workflows, and cloud data flows that automate complex banking processes with measurable impact.",
      hero_cta_projects: "Explore projects",
      hero_meta_loc: "📍 Milan, IT (Hybrid)", hero_meta_dom: "🏦 Banking & Enterprise AI", hero_meta_cloud: "☁️ Azure AI Foundry & Data Factory",
      stat_1: "ETL migration & processing time on Azure",
      stat_2: "technical pages mapped by autonomous agents",
      stat_3: "pipeline efficiency via cloud parallelization",
      stat_4: "followers & active network on LinkedIn",
      sec_01_idx: "01 / about",
      sec_01_title: "From raw data <span class='gradient'>to autonomous agents</span>.",
      about_p1: "I am an <strong>AI Engineer</strong> with a strong background in <strong>Data Engineering</strong>. At <strong>Deda AI (Dedagroup)</strong>, I design Generative AI solutions and agentic architectures to automate complex banking processes.",
      about_p2: "At <strong>Dedagroup</strong>, I built and optimized scalable ETL pipelines on <strong>Azure Data Factory</strong> for high-profile banking clients (e.g., <strong>Mediobanca</strong>), ensuring data integrity and performance on <strong>SQL Server</strong> (cutting processing times by up to 30% and complex query execution times by 20%).",
      about_p3: "Today I combine that engineering rigor with advanced <strong>Agentic AI</strong> frameworks (<strong>LangChain, CrewAI, MCP, Qdrant</strong>): building autonomous agents to analyze 700+ page technical documentation, multi-agent semantic indexing workflows, and dynamic multi-channel document solutions (<strong>Engage One</strong> for <strong>Centrico</strong>).",
      about_quote_comment: "// Driven by continuous improvement & high-impact results",
      card_1_title: "Agentic AI & Multi-Agent",
      card_1_desc: "Autonomous agents and multi-agent workflows built with LangChain, CrewAI, MCP protocol, Function Calling, and Pydantic.",
      card_2_title: "Advanced RAG & Vector DB",
      card_2_desc: "Semantic indexing and multi-tenant retrieval on Qdrant and Azure AI Search, with enterprise security (APIM, Managed Identity).",
      card_3_title: "Enterprise ETL & SQL",
      card_3_desc: "Azure Data Factory and SQL Server pipelines for banking flows: -30% migration time, +25% efficiency, -20% query execution time.",
      card_4_title: "Intelligent & Doc Automation",
      card_4_desc: "Integrating LLM agents with RPA systems for autonomous decision-making and dynamic document solutions with Engage One.",
      sec_02_idx: "02 / experience",
      sec_02_title: "My professional <span class='gradient'>pipeline</span>.",
      sec_02_sub: "From software engineering foundations to banking data pipelines and production agentic architectures.",
      exp_1_stage: "stage: reason · act · observe (Full-time · Hybrid)",
      exp_1_date: "Jan 2026 — Present", exp_1_comp_sub: "· Dedagroup · Milan",
      exp_1_b1: "Developed <strong>Intelligent Automation</strong> workflows for <strong>Solution Bank</strong>, integrating <strong>LLM agents with RPA systems</strong> for autonomous decision-making processes.",
      exp_1_b2: "Built a <strong>CAI insurance claim analysis pipeline</strong> using <strong>Azure Content Understanding</strong> and <strong>Azure OpenAI</strong>: data extraction, circumstance and claim diagram analysis, signature detection, and dynamic JSON summarization (Python, PyMuPDF, Pillow).",
      exp_1_b3: "Implemented a <strong>multi-tenant RAG chatbot on Azure</strong>: AI Search, source-updater Azure Function, Container Apps with agent and search tools, web widget, APIM, managed identity, and access controls.",
      exp_2_stage: "stage: extract · transform · load (Apprenticeship · Hybrid)",
      exp_2_date: "Oct 2023 — Jan 2026 · 2 yrs 4 mos", exp_2_comp_sub: "· Dedabit · Milan",
      exp_2_b1: "Designed and managed <strong>ETL pipelines on Azure Data Factory</strong> to migrate complex datasets from legacy systems to the cloud for <strong>Mediobanca</strong> → <strong>-30% reduction in processing times</strong>.",
      exp_2_b2: "Resolved pipeline bottlenecks through cloud parallelization logic and resource optimization → <strong>+25% process efficiency</strong>.",
      exp_2_b3: "Maintained <strong>SQL Server</strong> databases, handled incident response, and developed optimized analytical queries → <strong>-20% execution time</strong> on complex queries.",
      exp_2_b4: "Developed <strong>dynamic multi-channel document automations</strong> with advanced scripting in <strong>Engage One</strong> for <strong>Centrico</strong>.",
      exp_3_stage: "stage: compile · build · train (Internship · Hybrid)",
      exp_3_date: "Mar 2023 — Oct 2023 · 8 mos", exp_3_comp_sub: "· IT Consulting · Milan",
      exp_3_b1: "Conducted hands-on sessions and <strong>technical training workshops</strong> with the team on core Java technologies: <strong>OOP, Spring Boot, CRUD operations, RESTful APIs</strong>, and clean coding practices.",
      exp_3_b2: "Worked with relational and NoSQL databases (Oracle SQL, PL/SQL, SQL Server, MongoDB), unit testing with JUnit, and microservices architectures.",
      edu_stage: "stage: academic & bootcamp foundation", edu_date: "Nov 2023 — Jan 2027 (expected)",
      edu_title: "B.Sc. in Computer Engineering", edu_loc: "· Rome",
      edu_note: "Focus on Data Engineering and Generative AI. Core courses: Calculus & Linear Algebra, Computer Science, Algorithms, Databases.",
      edu_gen_title: "Generation Italy — Junior Java Developer Bootcamp (500 hrs)",
      edu_gen_desc: "Java OOP, Spring Boot, MySQL, Front-End (HTML, CSS, JS), and Agile / Scrum teamwork.",
      edu_hs_title: "Liceo Scientifico Elio Vittorini — Scientific High School Diploma",
      sec_03_idx: "03 / projects & hackathons",
      sec_03_title: "<span class='gradient'>AI, Agentic &amp; Innovation</span> solutions.",
      sec_03_sub: "Production enterprise systems and innovation projects pitched to executive juries.",
      proj_1_badge: "700+ pages",
      proj_1_desc: "Autonomous AI agent and multi-agent workflow that <strong>navigates, analyzes, and maps structured JSON</strong> from complex 700+ page technical documents using reasoning, tool-use, and semantic indexing on <strong>Qdrant</strong>.",
      proj_2_desc: "Analysis pipeline for <strong>CAI car accident claim forms</strong>: data extraction, circumstance and accident diagram analysis, <strong>signature detection</strong>, and dynamic JSON incident summarization.",
      proj_3_desc: "End-to-end <strong>multi-tenant</strong> RAG chatbot: indexing on Azure AI Search with source-updater Azure Functions, agent with search tools on Container Apps, web widget, and enterprise security via <strong>APIM, Managed Identity</strong>, and access controls.",
      proj_4_desc: "Project pitched to the executive jury of <strong>A2A</strong> during the <strong>Re-GenerAction</strong> hackathon: a participatory app connecting citizens, businesses, and public administration by integrating <strong>IoT, AI, and gamification</strong> for sustainable smart cities.",
      sec_04_idx: "04 / skills & certifications",
      sec_04_title: "My tech <span class='gradient'>stack</span>.",
      certs_title: "licenses & certifications", cert_verify: "Verify credential ↗",
      langs_title: "languages",
      lang_it: "Italian", lang_it_lvl: "native",
      lang_en: "English", lang_en_lvl: "professional",
      lang_es: "Spanish", lang_es_lvl: "good",
      workflow_desc: "Tools integrated into my daily engineering and prototyping workflow:",
      sec_05_idx: "05 / shell",
      sec_05_title: "Query my <span class='gradient'>CLI agent</span>.",
      sec_05_sub: "An interactive terminal powered by my CV and LinkedIn profile data. Type <code>help</code> to start.",
      sec_06_idx: "06 / contact",
      sec_06_title: "Let's build the next <span class='gradient'>AI agent</span> together.",
      sec_06_sub: "Whether you want to design an agentic architecture, bring a RAG system into production on Azure, or scale an enterprise banking data pipeline, reach out — I'd love to connect.",
      contact_phone_label: "phone", contact_btn_email: "Send me an email", contact_btn_copy: "Copy email",
      toast_copied: "✔ Email copied to clipboard",
      chat_fab_label: "Ask Jerry's AI",
      chat_sub: "Online · Real LLM grounded on my CV",
      chat_welcome: "Hi! 👋 I'm <strong>Jerry's AI Agent</strong> (powered by Gemini LLM &amp; RAG).<br>Ask me anything in your preferred language about his work at <strong>Deda AI &amp; Dedagroup</strong>, his <strong>Agentic AI / RAG projects</strong>, tech stack, or how to get in touch!",
      chat_placeholder: "Ask anything about Jerry (in EN, IT, DE, FR, ES)…",
      q_btn_1: "🏦 Role at Deda AI", q_prompt_1: "What do you do as an AI Engineer at Deda AI?",
      q_btn_2: "🤖 AI & RAG Projects", q_prompt_2: "Which Agentic AI and RAG projects have you built?",
      q_btn_3: "📊 ETL & SQL Impact", q_prompt_3: "What measurable ETL and SQL results did you achieve at Dedagroup?",
      q_btn_4: "⚡ Tech Stack", q_prompt_4: "What is your full AI and Data Engineering tech stack?",
      q_btn_5: "📩 Contact info", q_prompt_5: "How can we contact Jerry for a role or collaboration?"
    },

    it: {
      nav_profile: "Profilo", nav_journey: "Percorso", nav_projects: "Progetti", nav_skills: "Competenze", nav_shell: "Shell", nav_contact: "Contatti",
      hero_status: "AI Engineer @ <strong>Deda AI</strong> (Dedagroup)",
      hero_hello: "Ciao, sono",
      hero_lead: "Specializzato in <strong>Agentic AI</strong>, <strong>Pipeline ETL Enterprise</strong> e <strong>Architetture RAG</strong>. Progetto agenti autonomi, workflow multi-agente e flussi dati cloud che automatizzano processi bancari complessi ad alto impatto.",
      hero_cta_projects: "Esplora i progetti",
      hero_meta_loc: "📍 Milano, IT (Ibrido)", hero_meta_dom: "🏦 Banking & Enterprise AI", hero_meta_cloud: "☁️ Azure AI Foundry & Data Factory",
      stat_1: "tempi di migrazione ed elaborazione ETL su Azure",
      stat_2: "pagine tecniche mappate da agenti autonomi",
      stat_3: "efficienza pipeline grazie a parallelizzazione cloud",
      stat_4: "follower e network attivo su LinkedIn",
      sec_01_idx: "01 / profilo",
      sec_01_title: "Dal dato <span class='gradient'>all'agente</span>.",
      about_p1: "Sono un <strong>AI Engineer</strong> con un solido background nel <strong>Data Engineering</strong>. In <strong>Deda AI (Dedagroup)</strong> progetto soluzioni di Generative AI e architetture agentiche per l'automazione di processi bancari complessi.",
      about_p2: "In <strong>Dedagroup</strong> ho costruito e ottimizzato pipeline ETL scalabili su <strong>Azure Data Factory</strong> per clienti di alto profilo (es. <strong>Mediobanca</strong>), garantendo integrità e performance su <strong>SQL Server</strong> (riducendo fino al 30% i tempi di processing e del 20% i tempi di query complesse).",
      about_p3: "Oggi unisco questa disciplina ingegneristica con i framework più avanzati di <strong>Agentic AI</strong> (<strong>LangChain, CrewAI, MCP, Qdrant</strong>): sviluppo agenti autonomi per l'analisi di documentazione tecnica oltre le 700 pagine, workflow multi-agente per l'indicizzazione semantica e soluzioni documentali dinamiche multicanale (<strong>Engage One</strong> per <strong>Centrico</strong>).",
      about_quote_comment: "// Orientato al miglioramento continuo e a risultati ad alto impatto",
      card_1_title: "Agentic AI & Multi-Agent",
      card_1_desc: "Agenti autonomi e workflow multi-agente con LangChain, CrewAI, protocollo MCP, Function Calling e Pydantic.",
      card_2_title: "Advanced RAG & Vector DB",
      card_2_desc: "Indicizzazione semantica e retrieval multi-tenant su Qdrant e Azure AI Search, con sicurezza enterprise (APIM, Managed Identity).",
      card_3_title: "Enterprise ETL & SQL",
      card_3_desc: "Pipeline su Azure Data Factory e SQL Server per il settore bancario: -30% tempi di migrazione, +25% efficienza, -20% query time.",
      card_4_title: "Intelligent & Doc Automation",
      card_4_desc: "Integrazione di agenti LLM con sistemi RPA per decisioni autonome e soluzioni documentali dinamiche con Engage One.",
      sec_02_idx: "02 / percorso",
      sec_02_title: "La mia <span class='gradient'>pipeline</span> professionale.",
      sec_02_sub: "Dalle fondamenta dello sviluppo software alle pipeline dati bancarie, fino alle architetture agentiche in produzione.",
      exp_1_stage: "stage: reason · act · observe (Full-time · Ibrido)",
      exp_1_date: "Gen 2026 — Presente", exp_1_comp_sub: "· Dedagroup · Milano",
      exp_1_b1: "Sviluppo di workflow di <strong>Intelligent Automation</strong> per <strong>Solution Bank</strong>, integrando <strong>agenti LLM con sistemi RPA</strong> per processi decisionali autonomi.",
      exp_1_b2: "Realizzazione di una pipeline di analisi dei <strong>moduli CAI</strong> con <strong>Azure Content Understanding</strong> e <strong>Azure OpenAI</strong>: estrazione dati, analisi circostanze e schema del sinistro, rilevamento firme e sintesi dinamica in JSON (Python, PyMuPDF, Pillow).",
      exp_1_b3: "Implementazione di un <strong>chatbot RAG multi-tenant su Azure</strong>: AI Search, Azure Function per aggiornamento fonti, Container Apps con agente e tool di ricerca, widget web, APIM, managed identity e controlli di accesso.",
      exp_2_stage: "stage: extract · transform · load (Apprendistato · Ibrido)",
      exp_2_date: "Ott 2023 — Gen 2026 · 2a 4m", exp_2_comp_sub: "· Dedabit · Milano",
      exp_2_b1: "Progettazione e gestione di <strong>pipeline ETL su Azure Data Factory</strong> per migrare dataset complessi da sistemi legacy al cloud per <strong>Mediobanca</strong> → <strong>-30% nei tempi di elaborazione</strong>.",
      exp_2_b2: "Ottimizzazione dei colli di bottiglia tramite logiche di parallelizzazione e migliore utilizzo delle risorse cloud → <strong>+25% di efficienza di processo</strong>.",
      exp_2_b3: "Manutenzione database <strong>SQL Server</strong>, incident response e sviluppo di query ottimizzate per analisi e trasformazione → <strong>-20% nei tempi di esecuzione</strong> su query complesse.",
      exp_2_b4: "Sviluppo di <strong>automazioni documentali dinamiche multicanale</strong> con scripting avanzato su <strong>Engage One</strong> per <strong>Centrico</strong>.",
      exp_3_stage: "stage: compile · build · train (Stage · Ibrido)",
      exp_3_date: "Mar 2023 — Ott 2023 · 8m", exp_3_comp_sub: "· Consulenza Informatica · Milano",
      exp_3_b1: "Conduzione di sessioni pratiche e workshop di <strong>formazione tecnica</strong> con il team su tecnologie Java enterprise: <strong>OOP, Spring Boot, operazioni CRUD, RESTful API</strong> e best practice di sviluppo.",
      exp_3_b2: "Lavoro su database relazionali e NoSQL (Oracle SQL, PL/SQL, SQL Server, MongoDB), testing con JUnit e architetture a microservizi.",
      edu_stage: "stage: formazione accademica & bootcamp", edu_date: "Nov 2023 — Gen 2027 (prevista)",
      edu_title: "Ingegneria Informatica (B.Sc.)", edu_loc: "· Roma",
      edu_note: "Focus su Ingegneria dei Dati e AI Generativa. Esami chiave: Calcolo e Algebra Lineare, Informatica, Algoritmi, Basi di Dati.",
      edu_gen_title: "Generation Italy — Corso Junior Java Developer (500 ore)",
      edu_gen_desc: "Programmazione OOP in Java, Spring Boot, MySQL, Front-End (HTML, CSS, JS) e lavoro in team con metodologia Agile / Scrum.",
      edu_hs_title: "Liceo Scientifico Elio Vittorini — Diploma Scientifico",
      sec_03_idx: "03 / progetti & hackathon",
      sec_03_title: "Soluzioni <span class='gradient'>AI, agentiche &amp; innovazione</span>.",
      sec_03_sub: "Sistemi enterprise sviluppati in produzione e progetti d'innovazione presentati in hackathon.",
      proj_1_badge: "700+ pagine",
      proj_1_desc: "Agente AI autonomo e workflow multi-agente che <strong>naviga, analizza e mappa in JSON strutturato</strong> documentazione tecnica complessa di oltre 700 pagine, con ragionamento, tool-use e indicizzazione semantica su <strong>Qdrant</strong>.",
      proj_2_desc: "Pipeline di analisi dei <strong>moduli CAI</strong> (constatazione amichevole): estrazione dati, analisi delle circostanze e dello schema del sinistro, <strong>rilevamento delle firme</strong> e sintesi dinamica dell'incidente in JSON.",
      proj_3_desc: "Chatbot RAG <strong>multi-tenant</strong> end-to-end: indicizzazione su AI Search con Azure Function di aggiornamento fonti, agente con tool di ricerca su Container Apps, widget web e sicurezza enterprise con <strong>APIM, managed identity</strong> e controlli di accesso.",
      proj_4_desc: "Progetto presentato davanti alla giuria e ai vertici di <strong>A2A</strong> durante l'hackathon <strong>Re-GenerAction</strong>: un'app partecipativa che connette cittadini, imprese e PA integrando <strong>IoT, AI e gamification</strong> per città più sostenibili.",
      sec_04_idx: "04 / competenze & certificazioni",
      sec_04_title: "Il mio <span class='gradient'>stack</span>.",
      certs_title: "licenze & certificazioni", cert_verify: "Verifica credenziale ↗",
      langs_title: "lingue",
      lang_it: "Italiano", lang_it_lvl: "madrelingua",
      lang_en: "Inglese", lang_en_lvl: "professionale",
      lang_es: "Spagnolo", lang_es_lvl: "buono",
      workflow_desc: "Strumenti integrati nel mio flusso quotidiano di sviluppo e prototipazione:",
      sec_05_idx: "05 / shell",
      sec_05_title: "Interroga il mio <span class='gradient'>agente CLI</span>.",
      sec_05_sub: "Un terminale interattivo alimentato dai dati del mio CV e profilo LinkedIn. Digita <code>help</code> per iniziare.",
      sec_06_idx: "06 / contatti",
      sec_06_title: "Costruiamo il prossimo <span class='gradient'>agente</span> insieme.",
      sec_06_sub: "Che si tratti di progettare un'architettura agentica, portare un sistema RAG in produzione su Azure o scalare una pipeline dati bancaria, scrivimi: rispondo volentieri.",
      contact_phone_label: "telefono", contact_btn_email: "Inviami un'email", contact_btn_copy: "Copia email",
      toast_copied: "✔ Email copiata negli appunti",
      chat_fab_label: "Chiedi all'AI di Jerry",
      chat_sub: "Online · Vero LLM basato sul mio CV",
      chat_welcome: "Ciao! 👋 Sono l'<strong>AI Agent di Jerry</strong> (alimentato da Gemini LLM &amp; RAG).<br>Chiedimi pure qualsiasi cosa sulle sue esperienze in <strong>Deda AI &amp; Dedagroup</strong>, sui progetti <strong>Agentic AI / RAG</strong>, sullo stack tecnico o su come contattarlo!",
      chat_placeholder: "Fai una domanda su Jerry (in EN, IT, DE, FR, ES)…",
      q_btn_1: "🏦 Ruolo in Deda AI", q_prompt_1: "Di cosa ti occupi come AI Engineer in Deda AI?",
      q_btn_2: "🤖 Progetti AI & RAG", q_prompt_2: "Quali progetti Agentic AI e RAG hai sviluppato?",
      q_btn_3: "📊 Risultati ETL & SQL", q_prompt_3: "Che risultati misurabili hai ottenuto su ETL e SQL in Dedagroup?",
      q_btn_4: "⚡ Tech Stack", q_prompt_4: "Qual è il tuo stack tecnologico completo tra AI e Data Engineering?",
      q_btn_5: "📩 Contatti", q_prompt_5: "Come possiamo contattare Jerry per una collaborazione?"
    },

    de: {
      nav_profile: "Profil", nav_journey: "Erfahrung", nav_projects: "Projekte", nav_skills: "Skills", nav_shell: "Shell", nav_contact: "Kontakt",
      hero_status: "AI Engineer @ <strong>Deda AI</strong> (Dedagroup)",
      hero_hello: "Hallo, ich bin",
      hero_lead: "Spezialisiert auf <strong>Agentic AI</strong>, <strong>Enterprise-ETL-Pipelines</strong> und <strong>RAG-Architekturen</strong>. Ich entwickle autonome Agenten, Multi-Agenten-Workflows und Cloud-Datenpipelines zur intelligenten Automatisierung komplexer Bankprozesse.",
      hero_cta_projects: "Projekte entdecken",
      hero_meta_loc: "📍 Mailand, IT (Hybrid)", hero_meta_dom: "🏦 Banking & Enterprise AI", hero_meta_cloud: "☁️ Azure AI Foundry & Data Factory",
      stat_1: "Migrations- & ETL-Verarbeitungszeit auf Azure",
      stat_2: "technische Seiten durch autonome Agenten kartiert",
      stat_3: "Pipeline-Effizienz durch Cloud-Parallelisierung",
      stat_4: "Follower & aktives Netzwerk auf LinkedIn",
      sec_01_idx: "01 / profil",
      sec_01_title: "Von Rohdaten <span class='gradient'>zu autonomen Agenten</span>.",
      about_p1: "Ich bin <strong>AI Engineer</strong> mit einem starken Hintergrund im <strong>Data Engineering</strong>. Bei <strong>Deda AI (Dedagroup)</strong> entwerfe ich Generative-AI-Lösungen und agentische Architekturen zur Automatisierung komplexer Bankprozesse.",
      about_p2: "Bei <strong>Dedagroup</strong> habe ich skalierbare ETL-Pipelines auf <strong>Azure Data Factory</strong> für führende Bankkunden (z. B. <strong>Mediobanca</strong>) entwickelt und optimiert sowie Datenintegrität und Performance auf <strong>SQL Server</strong> sichergestellt (-30 % Verarbeitungszeit, -20 % Abfragezeit).",
      about_p3: "Heute verbinde ich diese Engineering-Disziplin mit modernen <strong>Agentic-AI-Frameworks</strong> (<strong>LangChain, CrewAI, MCP, Qdrant</strong>): autonome Agenten für über 700-seitige technische Dokumentationen, Multi-Agenten-Workflows für semantische Indizierung und dynamische Dokumentenlösungen (<strong>Engage One</strong> für <strong>Centrico</strong>).",
      about_quote_comment: "// Angetrieben von kontinuierlicher Verbesserung & messbarem Impact",
      card_1_title: "Agentic AI & Multi-Agent",
      card_1_desc: "Autonome Agenten und Multi-Agenten-Workflows mit LangChain, CrewAI, MCP-Protokoll, Function Calling und Pydantic.",
      card_2_title: "Advanced RAG & Vector DB",
      card_2_desc: "Semantische Indizierung und mandantenfähiges Retrieval auf Qdrant und Azure AI Search mit Enterprise-Sicherheit (APIM, Managed Identity).",
      card_3_title: "Enterprise ETL & SQL",
      card_3_desc: "Azure Data Factory- und SQL Server-Pipelines für den Bankensektor: -30 % Migrationszeit, +25 % Effizienz, -20 % Abfragezeit.",
      card_4_title: "Intelligent & Doc Automation",
      card_4_desc: "Integration von LLM-Agenten mit RPA-Systemen für autonome Entscheidungen sowie dynamische Dokumentenautomatisierung mit Engage One.",
      sec_02_idx: "02 / erfahrung",
      sec_02_title: "Meine berufliche <span class='gradient'>Pipeline</span>.",
      sec_02_sub: "Von den Grundlagen der Softwareentwicklung über Bankdaten-Pipelines bis zu produktiven Agenten-Architekturen.",
      exp_1_stage: "stage: reason · act · observe (Vollzeit · Hybrid)",
      exp_1_date: "Jan 2026 — Heute", exp_1_comp_sub: "· Dedagroup · Mailand",
      exp_1_b1: "Entwicklung von <strong>Intelligent-Automation</strong>-Workflows für die <strong>Solution Bank</strong> durch Integration von <strong>LLM-Agenten mit RPA-Systemen</strong> für autonome Entscheidungsprozesse.",
      exp_1_b2: "Aufbau einer <strong>CAI-Schadensformular-Analysepipeline</strong> mit <strong>Azure Content Understanding</strong> und <strong>Azure OpenAI</strong>: Datenextraktion, Unfallskizzen-Analyse, Unterschriftenerkennung und JSON-Zusammenfassung (Python, PyMuPDF, Pillow).",
      exp_1_b3: "Implementierung eines <strong>mandantenfähigen RAG-Chatbots auf Azure</strong>: AI Search, Azure Functions, Container Apps mit Such-Tools, Web-Widget, APIM, Managed Identity und Zugriffskontrollen.",
      exp_2_stage: "stage: extract · transform · load (Berufsausbildung · Hybrid)",
      exp_2_date: "Okt 2023 — Jan 2026 · 2 J. 4 Mon.", exp_2_comp_sub: "· Dedabit · Mailand",
      exp_2_b1: "Konzeption und Verwaltung von <strong>ETL-Pipelines auf Azure Data Factory</strong> zur Cloud-Migration komplexer Bankdaten für <strong>Mediobanca</strong> → <strong>-30 % Verarbeitungszeit</strong>.",
      exp_2_b2: "Beseitigung von Pipeline-Engpässen durch Parallelisierungslogik in der Cloud → <strong>+25 % Prozesseffizienz</strong>.",
      exp_2_b3: "Wartung von <strong>SQL Server</strong>-Datenbanken, Incident Response und Abfrageoptimierung → <strong>-20 % Ausführungszeit</strong> bei komplexen Queries.",
      exp_2_b4: "Entwicklung <strong>dynamischer Multichannel-Dokumentenautomatisierungen</strong> mit <strong>Engage One</strong> für <strong>Centrico</strong>.",
      exp_3_stage: "stage: compile · build · train (Praktikum · Hybrid)",
      exp_3_date: "Mär 2023 — Okt 2023 · 8 Mon.", exp_3_comp_sub: "· IT-Beratung · Mailand",
      exp_3_b1: "Durchführung von Praxis-Workshops und <strong>technischem Training</strong> im Team zu Java-Technologien: <strong>OOP, Spring Boot, CRUD, RESTful APIs</strong> und Clean Code.",
      exp_3_b2: "Arbeit mit relationalen und NoSQL-Datenbanken (Oracle SQL, PL/SQL, SQL Server, MongoDB), JUnit-Tests und Microservices.",
      edu_stage: "stage: studium & bootcamp", edu_date: "Nov 2023 — Jan 2027 (erwartet)",
      edu_title: "B.Sc. Informatik & Technische Informatik", edu_loc: "· Rom",
      edu_note: "Fokus auf Data Engineering und Generative AI. Kernfächer: Analysis & Lineare Algebra, Informatik, Algorithmen, Datenbanken.",
      edu_gen_title: "Generation Italy — Junior Java Developer Bootcamp (500 Std.)",
      edu_gen_desc: "Java OOP, Spring Boot, MySQL, Front-End (HTML, CSS, JS) und Agile / Scrum Teamwork.",
      edu_hs_title: "Liceo Scientifico Elio Vittorini — Abitur (Naturwissenschaftliches Gymnasium)",
      sec_03_idx: "03 / projekte & hackathons",
      sec_03_title: "<span class='gradient'>AI-, Agentic- &amp; Innovations</span>-Lösungen.",
      sec_03_sub: "Produktive Enterprise-Systeme und Innovationsprojekte.",
      proj_1_badge: "700+ Seiten",
      proj_1_desc: "Autonomer KI-Agent und Multi-Agenten-Workflow, der komplexe technische Dokumente mit <strong>über 700 Seiten analysiert und in strukturiertes JSON</strong> überführt – mittels Tool-Use und semantischer Indizierung auf <strong>Qdrant</strong>.",
      proj_2_desc: "Analyse-Pipeline für <strong>CAI-Kfz-Schadensformulare</strong>: Datenextraktion, Analyse von Unfallumständen und Skizzen, <strong>Unterschriftenerkennung</strong> und dynamische JSON-Synthese.",
      proj_3_desc: "Mandantenfähiger End-to-End-<strong>RAG-Chatbot auf Azure</strong>: AI Search, Azure Functions, Container Apps, Web-Widget sowie Enterprise-Security über <strong>APIM und Managed Identity</strong>.",
      proj_4_desc: "Vor dem Vorstand von <strong>A2A</strong> beim Hackathon <strong>Re-GenerAction</strong> präsentiertes Projekt: eine Smart-City-App, die Bürger, Unternehmen und Verwaltung über <strong>IoT, KI und Gamification</strong> vernetzt.",
      sec_04_idx: "04 / kompetenzen & zertifikate",
      sec_04_title: "Mein Tech-<span class='gradient'>Stack</span>.",
      certs_title: "lizenzen & zertifizierungen", cert_verify: "Zertifikat prüfen ↗",
      langs_title: "sprachen",
      lang_it: "Italienisch", lang_it_lvl: "Muttersprache",
      lang_en: "Englisch", lang_en_lvl: "Verhandlungssicher",
      lang_es: "Spanisch", lang_es_lvl: "Gut",
      workflow_desc: "Tools in meinem täglichen Engineering- und Prototyping-Workflow:",
      sec_05_idx: "05 / shell",
      sec_05_title: "Meinen <span class='gradient'>CLI-Agenten</span> abfragen.",
      sec_05_sub: "Ein interaktives Terminal mit meinen CV- und LinkedIn-Daten. Tippe <code>help</code> zum Starten.",
      sec_06_idx: "06 / kontakt",
      sec_06_title: "Lass uns den nächsten <span class='gradient'>KI-Agenten</span> bauen.",
      sec_06_sub: "Ob agentische Architektur, produktives RAG-System auf Azure oder skalierbare Bankdaten-Pipeline – schreib mir gerne!",
      contact_phone_label: "telefon", contact_btn_email: "E-Mail senden", contact_btn_copy: "E-Mail kopieren",
      toast_copied: "✔ E-Mail in die Zwischenablage kopiert",
      chat_fab_label: "Frag Jerrys KI",
      chat_sub: "Online · Echtes LLM mit meinem CV",
      chat_welcome: "Hallo! 👋 Ich bin <strong>Jerrys KI-Agent</strong> (powered by Gemini LLM &amp; RAG).<br>Frag mich gerne auf Deutsch, Englisch oder Italienisch nach seiner Arbeit bei <strong>Deda AI &amp; Dedagroup</strong>, seinen <strong>KI-/RAG-Projekten</strong> oder Kontaktdaten!",
      chat_placeholder: "Frag etwas über Jerry (auf DE, EN, IT, FR, ES)…",
      q_btn_1: "🏦 Rolle bei Deda AI", q_prompt_1: "Was machst du als AI Engineer bei Deda AI?",
      q_btn_2: "🤖 KI- & RAG-Projekte", q_prompt_2: "Welche Agentic-AI- und RAG-Projekte hast du entwickelt?",
      q_btn_3: "📊 ETL- & SQL-Ergebnisse", q_prompt_3: "Welche messbaren ETL- und SQL-Ergebnisse hast du bei Dedagroup erzielt?",
      q_btn_4: "⚡ Tech-Stack", q_prompt_4: "Wie sieht dein gesamter AI- und Data-Engineering-Tech-Stack aus?",
      q_btn_5: "📩 Kontakt", q_prompt_5: "Wie können wir Jerry für eine Zusammenarbeit kontaktieren?"
    },

    fr: {
      nav_profile: "Profil", nav_journey: "Parcours", nav_projects: "Projets", nav_skills: "Compétences", nav_shell: "Shell", nav_contact: "Contact",
      hero_status: "AI Engineer @ <strong>Deda AI</strong> (Dedagroup)",
      hero_hello: "Bonjour, je suis",
      hero_lead: "Spécialisé en <strong>IA Agentique</strong>, <strong>Pipelines ETL Enterprise</strong> et <strong>Architectures RAG</strong>. Je conçois des agents autonomes, des workflows multi-agents et des flux de données cloud pour automatiser les processus bancaires complexes.",
      hero_cta_projects: "Découvrir les projets",
      hero_meta_loc: "📍 Milan, IT (Hybride)", hero_meta_dom: "🏦 Banking & Enterprise AI", hero_meta_cloud: "☁️ Azure AI Foundry & Data Factory",
      stat_1: "temps de migration et traitement ETL sur Azure",
      stat_2: "pages techniques cartographiées par des agents IA",
      stat_3: "efficacité des pipelines via parallélisation cloud",
      stat_4: "abonnés et réseau actif sur LinkedIn",
      sec_01_idx: "01 / profil",
      sec_01_title: "De la donnée brute <span class='gradient'>à l'agent autonome</span>.",
      about_p1: "Je suis <strong>AI Engineer</strong> avec un solide parcours en <strong>Data Engineering</strong>. Chez <strong>Deda AI (Dedagroup)</strong>, je conçois des solutions d'IA générative et des architectures agentiques pour automatiser des processus bancaires complexes.",
      about_p2: "Chez <strong>Dedagroup</strong>, j'ai construit et optimisé des pipelines ETL évolutifs sur <strong>Azure Data Factory</strong> pour des clients bancaires de premier plan (ex. <strong>Mediobanca</strong>), garantissant l'intégrité et la performance sur <strong>SQL Server</strong> (-30 % sur les temps de traitement et -20 % sur les requêtes complexes).",
      about_p3: "Aujourd'hui, j'allie cette rigueur d'ingénierie aux frameworks d'<strong>IA Agentique</strong> (<strong>LangChain, CrewAI, MCP, Qdrant</strong>) : agents autonomes analysant plus de 700 pages de documentation technique, workflows multi-agents d'indexation sémantique et solutions documentaires dynamiques (<strong>Engage One</strong> pour <strong>Centrico</strong>).",
      about_quote_comment: "// Guidé par l'amélioration continue et des résultats à fort impact",
      card_1_title: "IA Agentique & Multi-Agents",
      card_1_desc: "Agents autonomes et workflows multi-agents avec LangChain, CrewAI, protocole MCP, Function Calling et Pydantic.",
      card_2_title: "Advanced RAG & Vector DB",
      card_2_desc: "Indexation sémantique et recherche multi-tenant sur Qdrant et Azure AI Search, avec sécurité entreprise (APIM, Managed Identity).",
      card_3_title: "Enterprise ETL & SQL",
      card_3_desc: "Pipelines Azure Data Factory et SQL Server pour le secteur bancaire : -30 % temps de migration, +25 % efficacité, -20 % temps de requête.",
      card_4_title: "Intelligent & Doc Automation",
      card_4_desc: "Intégration d'agents LLM avec des systèmes RPA pour des décisions autonomes et automatisation documentaire via Engage One.",
      sec_02_idx: "02 / parcours",
      sec_02_title: "Mon <span class='gradient'>pipeline</span> professionnel.",
      sec_02_sub: "Des fondations du développement logiciel aux pipelines de données bancaires et aux architectures agentiques en production.",
      exp_1_stage: "stage: reason · act · observe (Temps plein · Hybride)",
      exp_1_date: "Jan 2026 — Présent", exp_1_comp_sub: "· Dedagroup · Milan",
      exp_1_b1: "Développement de workflows d'<strong>Intelligent Automation</strong> pour <strong>Solution Bank</strong>, intégrant des <strong>agents LLM avec des systèmes RPA</strong> pour la prise de décision autonome.",
      exp_1_b2: "Création d'un pipeline d'analyse de <strong>constats amiables CAI</strong> avec <strong>Azure Content Understanding</strong> et <strong>Azure OpenAI</strong> : extraction de données, analyse des circonstances et du croquis, détection de signatures et synthèse JSON (Python, PyMuPDF, Pillow).",
      exp_1_b3: "Déploiement d'un <strong>chatbot RAG multi-tenant sur Azure</strong> : AI Search, Azure Functions, Container Apps avec agent et outils de recherche, widget web, APIM, Managed Identity et contrôle d'accès.",
      exp_2_stage: "stage: extract · transform · load (Apprentissage · Hybride)",
      exp_2_date: "Oct 2023 — Jan 2026 · 2 ans 4 mois", exp_2_comp_sub: "· Dedabit · Milan",
      exp_2_b1: "Conception et gestion de <strong>pipelines ETL sur Azure Data Factory</strong> pour migrer des flux bancaires complexes vers le cloud pour <strong>Mediobanca</strong> → <strong>-30 % sur les temps de traitement</strong>.",
      exp_2_b2: "Optimisation des goulots d'étranglement par parallélisation cloud → <strong>+25 % d'efficacité de processus</strong>.",
      exp_2_b3: "Maintenance de bases <strong>SQL Server</strong>, gestion d'incidents et optimisation de requêtes → <strong>-20 % sur les temps d'exécution</strong>.",
      exp_2_b4: "Développement de <strong>solutions documentaires dynamiques multicanales</strong> sur <strong>Engage One</strong> pour <strong>Centrico</strong>.",
      exp_3_stage: "stage: compile · build · train (Stage · Hybride)",
      exp_3_date: "Mars 2023 — Oct 2023 · 8 mois", exp_3_comp_sub: "· Conseil IT · Milan",
      exp_3_b1: "Animation d'ateliers pratiques et de <strong>formations techniques</strong> avec l'équipe sur l'écosystème Java : <strong>POO, Spring Boot, CRUD, API RESTful</strong> et bonnes pratiques.",
      exp_3_b2: "Travail sur bases relationnelles et NoSQL (Oracle SQL, PL/SQL, SQL Server, MongoDB), tests JUnit et microservices.",
      edu_stage: "stage: formation académique & bootcamp", edu_date: "Nov 2023 — Jan 2027 (prévu)",
      edu_title: "Licence (B.Sc.) en Ingénierie Informatique", edu_loc: "· Rome",
      edu_note: "Spécialisation Data Engineering et IA Générative. Cours clés : Calcul & Algèbre Linéaire, Informatique, Algorithmes, Bases de Données.",
      edu_gen_title: "Generation Italy — Bootcamp Junior Java Developer (500 h)",
      edu_gen_desc: "Java POO, Spring Boot, MySQL, Front-End (HTML, CSS, JS) et travail d'équipe Agile / Scrum.",
      edu_hs_title: "Liceo Scientifico Elio Vittorini — Baccalauréat Scientifique",
      sec_03_idx: "03 / projets & hackathons",
      sec_03_title: "Solutions <span class='gradient'>IA, Agentiques &amp; Innovation</span>.",
      sec_03_sub: "Systèmes d'entreprise en production et projets d'innovation présentés devant des jurys exécutifs.",
      proj_1_badge: "700+ pages",
      proj_1_desc: "Agent IA autonome et workflow multi-agents qui <strong>parcourt, analyse et structure en JSON</strong> des documents techniques de plus de 700 pages grâce au raisonnement, au tool-use et à l'indexation sémantique sur <strong>Qdrant</strong>.",
      proj_2_desc: "Pipeline d'analyse de <strong>constats d'accident CAI</strong> : extraction de données, analyse des circonstances et du schéma du sinistre, <strong>détection des signatures</strong> et synthèse dynamique en JSON.",
      proj_3_desc: "Chatbot RAG <strong>multi-tenant</strong> de bout en bout sur Azure : AI Search, Azure Functions, Container Apps, widget web et sécurité entreprise via <strong>APIM et Managed Identity</strong>.",
      proj_4_desc: "Projet présenté devant le jury et la direction d'<strong>A2A</strong> lors du hackathon <strong>Re-GenerAction</strong> : une application participative connectant citoyens, entreprises et administration via <strong>IoT, IA et gamification</strong>.",
      sec_04_idx: "04 / compétences & certifications",
      sec_04_title: "Mon <span class='gradient'>stack</span> technique.",
      certs_title: "licences & certifications", cert_verify: "Vérifier le certificat ↗",
      langs_title: "langues",
      lang_it: "Italien", lang_it_lvl: "langue maternelle",
      lang_en: "Anglais", lang_en_lvl: "professionnel",
      lang_es: "Espagnol", lang_es_lvl: "bon niveau",
      workflow_desc: "Outils intégrés dans mon flux quotidien de développement et prototypage :",
      sec_05_idx: "05 / shell",
      sec_05_title: "Interroger mon <span class='gradient'>agent CLI</span>.",
      sec_05_sub: "Un terminal interactif alimenté par mon CV et mon profil LinkedIn. Tapez <code>help</code> pour commencer.",
      sec_06_idx: "06 / contact",
      sec_06_title: "Construisons votre prochain <span class='gradient'>agent IA</span>.",
      sec_06_sub: "Pour concevoir une architecture agentique, déployer un système RAG en production sur Azure ou faire évoluer un pipeline de données bancaires, écrivez-moi !",
      contact_phone_label: "téléphone", contact_btn_email: "M'envoyer un e-mail", contact_btn_copy: "Copier l'e-mail",
      toast_copied: "✔ E-mail copié dans le presse-papiers",
      chat_fab_label: "Parler à l'IA de Jerry",
      chat_sub: "En ligne · Vrai LLM basé sur mon CV",
      chat_welcome: "Bonjour ! 👋 Je suis l'<strong>Agent IA de Jerry</strong> (propulsé par Gemini LLM &amp; RAG).<br>Posez-moi vos questions en français, anglais ou italien sur son rôle chez <strong>Deda AI &amp; Dedagroup</strong>, ses <strong>projets IA / RAG</strong> ou ses coordonnées !",
      chat_placeholder: "Posez une question sur Jerry (en FR, EN, IT, DE, ES)…",
      q_btn_1: "🏦 Rôle chez Deda AI", q_prompt_1: "Que fais-tu en tant qu'AI Engineer chez Deda AI ?",
      q_btn_2: "🤖 Projets IA & RAG", q_prompt_2: "Quels projets d'IA agentique et RAG as-tu développés ?",
      q_btn_3: "📊 Résultats ETL & SQL", q_prompt_3: "Quels résultats mesurables as-tu obtenus sur les pipelines ETL et SQL chez Dedagroup ?",
      q_btn_4: "⚡ Stack Technique", q_prompt_4: "Quel est ton stack technologique complet en IA et Data Engineering ?",
      q_btn_5: "📩 Contact", q_prompt_5: "Comment pouvons-nous contacter Jerry pour une opportunité ?"
    },

    es: {
      nav_profile: "Perfil", nav_journey: "Experiencia", nav_projects: "Proyectos", nav_skills: "Habilidades", nav_shell: "Shell", nav_contact: "Contacto",
      hero_status: "AI Engineer @ <strong>Deda AI</strong> (Dedagroup)",
      hero_hello: "Hola, soy",
      hero_lead: "Especializado en <strong>IA Agéntica</strong>, <strong>Pipelines ETL Enterprise</strong> y <strong>Arquitecturas RAG</strong>. Diseño agentes autónomos, flujos multi-agente y pipelines de datos en la nube que automatizan procesos bancarios complejos con alto impacto.",
      hero_cta_projects: "Explorar proyectos",
      hero_meta_loc: "📍 Milán, IT (Híbrido)", hero_meta_dom: "🏦 Banking & Enterprise AI", hero_meta_cloud: "☁️ Azure AI Foundry & Data Factory",
      stat_1: "tiempo de migración y procesamiento ETL en Azure",
      stat_2: "páginas técnicas mapeadas por agentes autónomos",
      stat_3: "eficiencia de pipelines mediante paralelización cloud",
      stat_4: "seguidores y red activa en LinkedIn",
      sec_01_idx: "01 / perfil",
      sec_01_title: "Del dato bruto <span class='gradient'>al agente autónomo</span>.",
      about_p1: "Soy un <strong>AI Engineer</strong> con una sólida trayectoria en <strong>Data Engineering</strong>. En <strong>Deda AI (Dedagroup)</strong> diseño soluciones de IA Generativa y arquitecturas agénticas para automatizar procesos bancarios complejos.",
      about_p2: "En <strong>Dedagroup</strong> construí y optimicé pipelines ETL escalables en <strong>Azure Data Factory</strong> para clientes bancarios de primer nivel (ej. <strong>Mediobanca</strong>), garantizando la integridad y el rendimiento en <strong>SQL Server</strong> (-30 % en tiempos de procesamiento y -20 % en consultas complejas).",
      about_p3: "Hoy combino esa disciplina de ingeniería con los frameworks más avanzados de <strong>IA Agéntica</strong> (<strong>LangChain, CrewAI, MCP, Qdrant</strong>): agentes autónomos para analizar documentación técnica de más de 700 páginas, flujos multi-agente de indexación semántica y soluciones documentales dinámicas (<strong>Engage One</strong> para <strong>Centrico</strong>).",
      about_quote_comment: "// Impulsado por la mejora continua y resultados de alto impacto",
      card_1_title: "IA Agéntica y Multi-Agente",
      card_1_desc: "Agentes autónomos y flujos multi-agente con LangChain, CrewAI, protocolo MCP, Function Calling y Pydantic.",
      card_2_title: "Advanced RAG & Vector DB",
      card_2_desc: "Indexación semántica y recuperación multi-tenant en Qdrant y Azure AI Search con seguridad empresarial (APIM, Managed Identity).",
      card_3_title: "Enterprise ETL & SQL",
      card_3_desc: "Pipelines en Azure Data Factory y SQL Server para banca: -30 % tiempo de migración, +25 % eficiencia, -20 % tiempo de consulta.",
      card_4_title: "Intelligent & Doc Automation",
      card_4_desc: "Integración de agentes LLM con sistemas RPA para decisiones autónomas y automatización documental dinámica con Engage One.",
      sec_02_idx: "02 / experiencia",
      sec_02_title: "Mi <span class='gradient'>pipeline</span> profesional.",
      sec_02_sub: "Desde las bases del desarrollo de software hasta pipelines de datos bancarios y arquitecturas agénticas en producción.",
      exp_1_stage: "stage: reason · act · observe (Tiempo completo · Híbrido)",
      exp_1_date: "Ene 2026 — Presente", exp_1_comp_sub: "· Dedagroup · Milán",
      exp_1_b1: "Desarrollo de flujos de <strong>Intelligent Automation</strong> para <strong>Solution Bank</strong>, integrando <strong>agentes LLM con sistemas RPA</strong> para la toma de decisiones autónoma.",
      exp_1_b2: "Creación de un pipeline de análisis de <strong>partes amistosos CAI</strong> con <strong>Azure Content Understanding</strong> y <strong>Azure OpenAI</strong>: extracción de datos, análisis de circunstancias y croquis del siniestro, detección de firmas y resumen dinámico en JSON (Python, PyMuPDF, Pillow).",
      exp_1_b3: "Implementación de un <strong>chatbot RAG multi-tenant en Azure</strong>: AI Search, Azure Functions, Container Apps con agente y herramientas de búsqueda, widget web, APIM, Managed Identity y control de acceso.",
      exp_2_stage: "stage: extract · transform · load (Aprendizaje · Híbrido)",
      exp_2_date: "Oct 2023 — Ene 2026 · 2 años 4 meses", exp_2_comp_sub: "· Dedabit · Milán",
      exp_2_b1: "Diseño y gestión de <strong>pipelines ETL en Azure Data Factory</strong> para migrar conjuntos de datos complejos hacia la nube para <strong>Mediobanca</strong> → <strong>-30 % en tiempos de procesamiento</strong>.",
      exp_2_b2: "Optimización de cuellos de botella mediante paralelización en la nube → <strong>+25 % de eficiencia de proceso</strong>.",
      exp_2_b3: "Mantenimiento de bases de datos <strong>SQL Server</strong>, respuesta a incidentes y optimización de consultas → <strong>-20 % en tiempos de ejecución</strong>.",
      exp_2_b4: "Desarrollo de <strong>automatizaciones documentales dinámicas multicanal</strong> con <strong>Engage One</strong> para <strong>Centrico</strong>.",
      exp_3_stage: "stage: compile · build · train (Prácticas · Híbrido)",
      exp_3_date: "Mar 2023 — Oct 2023 · 8 meses", exp_3_comp_sub: "· Consultoría IT · Milán",
      exp_3_b1: "Impartición de sesiones prácticas y <strong>formación técnica</strong> con el equipo sobre tecnologías Java: <strong>POO, Spring Boot, operaciones CRUD, APIs RESTful</strong> y buenas prácticas.",
      exp_3_b2: "Trabajo con bases de datos relacionales y NoSQL (Oracle SQL, PL/SQL, SQL Server, MongoDB), pruebas con JUnit y microservicios.",
      edu_stage: "stage: formación académica y bootcamp", edu_date: "Nov 2023 — Ene 2027 (previsto)",
      edu_title: "Grado (B.Sc.) en Ingeniería Informática", edu_loc: "· Roma",
      edu_note: "Enfoque en Ingeniería de Datos e IA Generativa. Asignaturas clave: Cálculo y Álgebra Lineal, Informática, Algoritmos, Bases de Datos.",
      edu_gen_title: "Generation Italy — Bootcamp Junior Java Developer (500 horas)",
      edu_gen_desc: "Java POO, Spring Boot, MySQL, Front-End (HTML, CSS, JS) y trabajo en equipo con metodología Agile / Scrum.",
      edu_hs_title: "Liceo Scientifico Elio Vittorini — Bachillerato Científico",
      sec_03_idx: "03 / proyectos y hackathons",
      sec_03_title: "Soluciones de <span class='gradient'>IA, Agéntica e Innovación</span>.",
      sec_03_sub: "Sistemas empresariales en producción y proyectos de innovación presentados ante jurados directivos.",
      proj_1_badge: "700+ páginas",
      proj_1_desc: "Agente de IA autónomo y flujo multi-agente que <strong>navega, analiza y mapea en JSON estructurado</strong> documentos técnicos de más de 700 páginas mediante razonamiento, uso de herramientas e indexación semántica en <strong>Qdrant</strong>.",
      proj_2_desc: "Pipeline de análisis de <strong>formularios de siniestros CAI</strong>: extracción de datos, análisis de circunstancias y esquema del accidente, <strong>detección de firmas</strong> y síntesis dinámica en JSON.",
      proj_3_desc: "Chatbot RAG <strong>multi-tenant</strong> integral en Azure: AI Search, Azure Functions, Container Apps, widget web y seguridad empresarial con <strong>APIM y Managed Identity</strong>.",
      proj_4_desc: "Proyecto presentado ante el jurado directivo de <strong>A2A</strong> durante el hackathon <strong>Re-GenerAction</strong>: una app participativa que conecta ciudadanos, empresas y administración integrando <strong>IoT, IA y gamificación</strong>.",
      sec_04_idx: "04 / habilidades y certificaciones",
      sec_04_title: "Mi <span class='gradient'>stack</span> tecnológico.",
      certs_title: "licencias y certificaciones", cert_verify: "Verificar credencial ↗",
      langs_title: "idiomas",
      lang_it: "Italiano", lang_it_lvl: "nativo",
      lang_en: "Inglés", lang_en_lvl: "profesional",
      lang_es: "Español", lang_es_lvl: "bueno",
      workflow_desc: "Herramientas integradas en mi flujo diario de ingeniería y prototipado:",
      sec_05_idx: "05 / shell",
      sec_05_title: "Consulta mi <span class='gradient'>agente CLI</span>.",
      sec_05_sub: "Una terminal interactiva alimentada por los datos de mi CV y LinkedIn. Escribe <code>help</code> para empezar.",
      sec_06_idx: "06 / contacto",
      sec_06_title: "Construyamos el próximo <span class='gradient'>agente IA</span> juntos.",
      sec_06_sub: "Ya sea para diseñar una arquitectura agéntica, llevar un sistema RAG a producción en Azure o escalar un pipeline de datos bancarios, escríbeme.",
      contact_phone_label: "teléfono", contact_btn_email: "Enviarme un correo", contact_btn_copy: "Copiar correo",
      toast_copied: "✔ Correo copiado al portapapeles",
      chat_fab_label: "Pregunta a la IA de Jerry",
      chat_sub: "En línea · LLM real basado en mi CV",
      chat_welcome: "¡Hola! 👋 Soy el <strong>Agente IA de Jerry</strong> (impulsado por Gemini LLM y RAG).<br>¡Pregúntame lo que quieras sobre su experiencia en <strong>Deda AI y Dedagroup</strong>, sus <strong>proyectos de IA Agéntica / RAG</strong>, su stack técnico o cómo contactarlo!",
      chat_placeholder: "Pregunta sobre Jerry (en ES, EN, IT, DE, FR)…",
      q_btn_1: "🏦 Rol en Deda AI", q_prompt_1: "¿Qué haces como AI Engineer en Deda AI?",
      q_btn_2: "🤖 Proyectos IA y RAG", q_prompt_2: "¿Qué proyectos de IA agéntica y RAG has desarrollado?",
      q_btn_3: "📊 Impacto ETL y SQL", q_prompt_3: "¿Qué resultados medibles lograste en ETL y SQL en Dedagroup?",
      q_btn_4: "⚡ Tech Stack", q_prompt_4: "¿Cuál es tu stack tecnológico completo de IA y Data Engineering?",
      q_btn_5: "📩 Contacto", q_prompt_5: "¿Cómo podemos contactar a Jerry para una colaboración?"
    }
  };

  function applyLanguage(lang, resetChat = false) {
    if (!I18N[lang]) lang = "en";
    currentLang = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem("jerry_lang", lang); } catch {}

    const dict = I18N[lang];
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (dict[key] !== undefined) el.setAttribute("placeholder", dict[key]);
    });
    $$("[data-i18n-q]").forEach((el) => {
      const key = el.getAttribute("data-i18n-q");
      if (dict[key] !== undefined) el.setAttribute("data-q", dict[key]);
    });
    $$(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });

    if (resetChat && typeof initChat === "function") {
      initChat();
    }
  }

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
  const roles = ["AI Engineer", "Data Engineer", "Agentic Systems Builder", "Enterprise RAG Architect", "Intelligent Automation"];
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
      '$ uv run cai_agent.py --file claim_0423.pdf',
      '◆ [plan]   extract vehicles, circumstances, diagram & signatures',
      '→ [tool]   content_understanding.analyze(pdf)',
      '✓ [obs]    2 vehicles · 17 fields · accident diagram detected',
      '→ [tool]   detect_signatures(page=1)',
      '✓ [obs]    signature A: present · signature B: present',
      '◆ [think]  boxes 8 + 13 → rear-end collision in queue',
      '→ [tool]   azure_openai.summarize(dynamics)',
      '{ "vehicles": 2, "signatures_valid": true,',
      '  "summary": "Vehicle B rear-ended Vehicle A while stopping" }',
      '✔ completed in 4.1s',
    ],
    [
      '$ uv run pdf_agent.py technical_specs_742p.pdf',
      '◆ [plan]   742-page document → navigate via TOC & Qdrant',
      '→ [tool]   read_toc() & qdrant.semantic_search()',
      '✓ [obs]    38 sections indexed in Qdrant vector DB',
      '→ [tool]   goto_section("4.2 Record Layouts")',
      '◆ [think]  extract field-code tables and validate schema',
      '→ [tool]   extract_tables(pages=[211..236])',
      '✓ [obs]    126 records validated with Pydantic',
      '{ "section": "4.2", "records": 126,',
      '  "schema": "FieldSpec", "validation_errors": 0 }',
      '✔ completed in 38.7s',
    ],
    [
      '$ POST /api/chat  x-tenant: bank-01',
      '→ [apim]   managed identity ✓ · tenant isolated',
      '◆ [think]  internal policy query → invoke Azure AI Search',
      '→ [tool]   ai_search.query(k=5, filter="tenant eq bank-01")',
      '✓ [obs]    5 relevant chunks retrieved (score > 0.82)',
      '◆ [think]  synthesize grounded answer with source citations',
      '→ [llm]    azure_openai.chat(context=5)',
      '{ "answer": "…", "citations": 3,',
      '  "latency_ms": 912 }',
      '✔ response streamed to web widget',
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
     7. Interactive CLI shell
     --------------------------------------------------------- */
  const out = $("#shellOut");
  const form = $("#shellForm");
  const input = $("#shellIn");
  const history = [];
  let hIndex = -1;

  const L = "https://www.linkedin.com/in/jerry-el-gendy";
  const G = "https://github.com/JerryAnderson996";
  const commands = {
    help: () => `<span class="c-violet">Available commands:</span>
  <span class="c-cyan">whoami</span>       about Jerry Anderson El Gendy
  <span class="c-cyan">impact</span>       key metrics &amp; benchmarks
  <span class="c-cyan">experience</span>   career timeline
  <span class="c-cyan">projects</span>     AI, Agentic &amp; Hackathon projects
  <span class="c-cyan">skills</span>       78+ technical skills
  <span class="c-cyan">education</span>    academic &amp; bootcamp background
  <span class="c-cyan">certs</span>        licenses &amp; certifications
  <span class="c-cyan">languages</span>    spoken languages
  <span class="c-cyan">contact</span>      email, phone, LinkedIn &amp; GitHub
  <span class="c-cyan">github</span>       open GitHub profile
  <span class="c-cyan">clear</span>        clear terminal
<span class="c-muted">Tip: use ↑ ↓ for command history and Tab for autocompletion.</span>`,

    whoami: () => `<span class="c-green">Jerry Anderson El Gendy</span> — AI Engineer @ Deda AI (Dedagroup) | Data Engineer · Milan
<span class="c-violet">// ENHANCE HUMAN DECISION</span>
Designs Generative AI solutions, autonomous agent architectures (LangChain, CrewAI, MCP)
and enterprise ETL pipelines (Azure Data Factory, SQL Server) for complex banking processes.`,

    about: () => commands.whoami(),

    impact: () => `<span class="c-green">-30%</span> ETL data migration &amp; processing time (Mediobanca on Azure Data Factory)
<span class="c-green">+25%</span> pipeline efficiency via cloud parallelization
<span class="c-green">-20%</span> execution time on complex SQL Server queries
<span class="c-cyan">700+</span> technical pages mapped into structured JSON by autonomous agents + Qdrant
<span class="c-violet">2,121</span> followers &amp; <span class="c-violet">500+</span> connections on LinkedIn`,

    experience: () => `<span class="c-violet">[Jan 2026 → Present]</span> <span class="c-green">AI Engineer</span> @ Deda AI (Dedagroup) · Full-time
                      Intelligent Automation (LLM + RPA) for Solution Bank,
                      CAI claim pipeline (Azure Content Understanding + OpenAI),
                      multi-tenant RAG chatbot on Azure.
<span class="c-violet">[Oct 2023 → 2026]</span>    <span class="c-green">Data Engineer</span> @ Dedagroup · Apprenticeship (2y 4m)
                      ETL pipelines on Azure Data Factory for Mediobanca (-30% time,
                      +25% efficiency), SQL Server (-20% query time), Engage One (Centrico).
<span class="c-violet">[Mar → Oct 2023]</span>     <span class="c-green">Junior Java Developer</span> @ Gruppo SCAI · Internship (8m)
                      Technical training &amp; development on Java, OOP, Spring Boot, REST API, SQL.`,

    projects: () => `<span class="c-cyan">01</span> Agentic PDF Intelligence System
   autonomous &amp; multi-agent workflow on 700+ pages → Qdrant + structured JSON
   <span class="c-muted">Python (uv) · LangChain · CrewAI · Qdrant · Pydantic · FastAPI</span>
<span class="c-cyan">02</span> CAI Claims Analysis Pipeline
   data extraction, circumstances, accident diagram, signatures, JSON summary
   <span class="c-muted">Azure Content Understanding · Azure OpenAI · PyMuPDF · Pillow</span>
<span class="c-cyan">03</span> Multi-tenant RAG Chatbot on Azure
   AI Search · Functions · Container Apps · APIM · Managed Identity
   <span class="c-muted">agent with search tools + enterprise web widget</span>
<span class="c-cyan">04</span> WhatsCity — Re-GenerAction Hackathon (A2A)
   participatory Smart City app pitched to A2A executive jury
   <span class="c-muted">AI · IoT · Gamification · Urban sustainability</span>`,

    skills: () => `<span class="c-violet">ai/</span>    Autonomous Agents · LangChain · CrewAI · MCP · Advanced RAG · LLMOps
       Azure AI Foundry &amp; Studio · Azure OpenAI · Qdrant · Local LLMs
       Fine-tuning · Prompting · Pydantic · FastAPI
<span class="c-cyan">data/</span>  Azure Data Factory · SQL Server (SSMS) · Oracle PL/SQL · MongoDB
       Alteryx · Informatica CDI · Power Automate (RPA) · Engage One
<span class="c-green">dev/</span>   Python (uv) · Java &amp; Spring Boot · Docker · Microservices &amp; REST
       Azure Container Apps · Functions · APIM · Git · Agile/Scrum`,

    education: () => `<span class="c-green">UNINETTUNO Rome</span> — B.Sc. in Computer Engineering <span class="c-muted">(2023 – 2027)</span>
<span class="c-green">Generation Italy</span> — Junior Java Developer Bootcamp 500h <span class="c-muted">(Nov 2022 – Mar 2023)</span>
<span class="c-green">Liceo Scientifico Elio Vittorini</span> — Scientific High School Diploma <span class="c-muted">(Milan, 2010 – 2015)</span>`,

    certs: () => `✔ AI Python for Beginners — DeepLearning.AI <span class="c-muted">(05/2026)</span>
✔ AI for Software Development — Generation <span class="c-muted">(04/2026 · Credly)</span>
✔ Secure .NET Development with OWASP Top 10 — Microsoft Learn <span class="c-muted">(2026)</span>
✔ Alteryx Designer Core — Alteryx <span class="c-muted">(08/2025 – 08/2027 · Credly)</span>
✔ CDI Implementation Practitioner — Informatica <span class="c-muted">(03/2025)</span>`,

    languages: () => `🇮🇹 Italian   native
🇬🇧 English   professional
🇪🇸 Spanish   good`,

    contact: () => `email     <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a>
phone     <a href="tel:+393911883405">+39 391 188 3405</a>
linkedin  <a href="${L}" target="_blank" rel="noopener">in/jerry-el-gendy</a>
github    <a href="${G}" target="_blank" rel="noopener">github.com/JerryAnderson996</a>`,

    linkedin: () => { window.open(L, "_blank", "noopener"); return `Opening <a href="${L}" target="_blank" rel="noopener">LinkedIn</a>…`; },
    github: () => { window.open(G, "_blank", "noopener"); return `Opening <a href="${G}" target="_blank" rel="noopener">GitHub</a>…`; },
    email: () => { location.href = "mailto:elgendyjerry@gmail.com"; return "Opening email client…"; },
    ls: () => `<span class="c-cyan">experience/</span>  <span class="c-cyan">projects/</span>  <span class="c-cyan">skills/</span>  cv.md  contact.txt`,
    date: () => new Date().toLocaleString(),
    sudo: (args) => args.join(" ").toLowerCase().includes("hire")
      ? `<span class="c-green">[sudo] access granted ✔</span>  Great choice! Reach out at <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a> 🚀`
      : `<span class="c-pink">guest is not in the sudoers file.</span> Try: <span class="c-cyan">sudo hire jerry</span>`,
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
    if (!fn) { print(`<span class="c-pink">command not found: ${escapeHTML(cmd)}</span> — type <span class="c-cyan">help</span>`); return; }
    const res = fn(args);
    if (res) print(res);
  }

  print(`<span class="c-violet">jerry-agent v2.0</span> <span class="c-muted">— runtime ready.</span>
Type <span class="c-cyan">help</span> to list commands, or click a suggestion below.`);

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
     8. Floating AI Chatbot Widget (Real Gemini LLM + Fallback)
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
  const chatHistory = [];

  function formatMarkdownToHTML(md) {
    let html = escapeHTML(md);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/(elgendyjerry@gmail\.com)/g, '<a href="mailto:$1">$1</a>');
    html = html.replace(/(https?:\/\/[^\s<)]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

    const lines = html.split(/\r?\n/);
    let outLines = [];
    let inList = false;
    for (const line of lines) {
      const m = line.match(/^\s*[-*•]\s+(.+)/);
      if (m) {
        if (!inList) { outLines.push("<ul>"); inList = true; }
        outLines.push(`<li>${m[1]}</li>`);
      } else {
        if (inList) { outLines.push("</ul>"); inList = false; }
        if (line.trim()) outLines.push(`<p style="margin:4px 0">${line}</p>`);
      }
    }
    if (inList) outLines.push("</ul>");
    return outLines.join("");
  }

  // Local multilingual fallback KB in case offline or API quota reached
  const localKB = [
    {
      keys: ["deda", "role", "ruolo", "rolle", "rôle", "rol", "work", "lavoro", "arbeit", "travail", "trabajo", "experience", "esperienz", "erfahrung", "expérience", "experiencia", "solution bank"],
      trace: "rag.retrieve(collection='experience', top_k=3)",
      reply: `<ul>
        <li><strong>AI Engineer @ Deda AI (Dedagroup)</strong> <em>(Jan 2026 – Present)</em>: Intelligent Automation (LLM agents + RPA) for <strong>Solution Bank</strong>, CAI claim pipeline (Azure Content Understanding + OpenAI), and multi-tenant RAG chatbot on Azure.</li>
        <li><strong>Data Engineer @ Dedagroup</strong> <em>(Oct 2023 – Jan 2026)</em>: Azure Data Factory ETL pipelines for <strong>Mediobanca</strong> (<strong>-30%</strong> processing time, <strong>+25%</strong> efficiency), SQL Server optimization (<strong>-20%</strong> query time), and Engage One automations for <strong>Centrico</strong>.</li>
        <li><strong>Junior Java Developer @ Gruppo SCAI</strong> <em>(Mar – Oct 2023)</em>: Java OOP, Spring Boot, REST APIs, and SQL training &amp; development.</li>
      </ul>`
    },
    {
      keys: ["project", "progett", "projekt", "projet", "proyecto", "rag", "pdf", "cai", "qdrant", "whatscity", "a2a", "hackathon", "agent"],
      trace: "rag.retrieve(collection='projects_and_agents', top_k=4)",
      reply: `<ul>
        <li><strong>Agentic PDF Intelligence System</strong>: Autonomous &amp; multi-agent system (LangChain, CrewAI, Qdrant, Pydantic, FastAPI) mapping <strong>700+ page</strong> technical PDFs into structured JSON.</li>
        <li><strong>CAI Claims Analysis Pipeline</strong>: Insurance claim analysis with <strong>Azure Content Understanding</strong> &amp; <strong>Azure OpenAI</strong> (data, diagram, signature detection, JSON summary).</li>
        <li><strong>Multi-tenant RAG Chatbot on Azure</strong>: Azure AI Search, Functions, Container Apps, APIM, Managed Identity.</li>
        <li><strong>WhatsCity (A2A Re-GenerAction Hackathon)</strong>: Smart City app integrating AI, IoT, and gamification pitched to A2A executives.</li>
      </ul>`
    },
    {
      keys: ["etl", "sql", "metric", "result", "risultat", "impact", "ergebnis", "résultat", "resultado", "mediobanca", "data factory", "adf", "%"],
      trace: "sql_metrics.query(target='dedagroup_etl_kpi')",
      reply: `<ul>
        <li>📉 <strong>-30% migration &amp; processing time</strong> on Azure Data Factory pipelines for <strong>Mediobanca</strong>.</li>
        <li>⚡ <strong>+25% process efficiency</strong> via cloud parallelization and bottleneck resolution.</li>
        <li>🔍 <strong>-20% execution time</strong> on complex analytical SQL Server queries.</li>
        <li>📄 Dynamic multi-channel document automation with <strong>Engage One</strong> for <strong>Centrico</strong>.</li>
      </ul>`
    },
    {
      keys: ["skill", "stack", "tech", "competenz", "python", "azure", "langchain", "crewai", "mcp", "cert"],
      trace: "agent.inspect_skills(total=78)",
      reply: `<ul>
        <li><strong>AI &amp; Agentic:</strong> Autonomous Agents, LangChain, CrewAI, MCP, Advanced RAG, Azure AI Foundry &amp; OpenAI, Qdrant, LLMOps, Local LLMs, Fine-tuning, Pydantic, FastAPI.</li>
        <li><strong>Data &amp; Automation:</strong> Azure Data Factory, SQL Server, Oracle PL/SQL, MongoDB, Alteryx, Informatica CDI, RPA (Power Automate), Engage One.</li>
        <li><strong>Certifications:</strong> DeepLearning.AI (AI Python), Generation (AI for SW Dev), Microsoft Learn (OWASP .NET), Alteryx Designer Core, Informatica CDI.</li>
      </ul>`
    },
    {
      keys: ["contact", "contatt", "kontakt", "contacto", "email", "mail", "phone", "telefono", "linkedin", "github", "repo", "code", "hire", "assum"],
      trace: "tool.get_contact_card()",
      reply: `<ul>
        <li>📧 <strong>Email:</strong> <a href="mailto:elgendyjerry@gmail.com">elgendyjerry@gmail.com</a></li>
        <li>📱 <strong>Phone:</strong> <a href="tel:+393911883405">+39 391 188 3405</a></li>
        <li>💼 <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/jerry-el-gendy" target="_blank" rel="noopener">linkedin.com/in/jerry-el-gendy</a> (2,121 followers · 500+ connections)</li>
        <li>💻 <strong>GitHub:</strong> <a href="https://github.com/JerryAnderson996" target="_blank" rel="noopener">github.com/JerryAnderson996</a></li>
      </ul>`
    }
  ];

  function addBotMessage(html, traceText = "gemini-2.5-flash · rag") {
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

  function findLocalAnswer(query) {
    const q = query.toLowerCase();
    let best = null, bestScore = 0;
    for (const item of localKB) {
      let score = 0;
      for (const k of item.keys) if (q.includes(k)) score += k.length;
      if (score > bestScore) { bestScore = score; best = item; }
    }
    return best || localKB[0];
  }

  /* ---------------------------------------------------------
     8b. Interview Booking Agent (Human-in-the-loop via Gmail)
     --------------------------------------------------------- */
  const BOOK_I18N = {
    en: { q_btn_book: "📅 Book an interview", b_intro: "Great! Fill in the form below: Jerry will receive your request on Gmail and confirm it personally. ✅", b_title: "Interview request", b_name: "Full name *", b_company: "Company", b_email: "Your email *", b_date: "Date (Mon–Fri) *", b_slot: "Time slot (CET)", b_s1: "12:00 – 12:30", b_s2: "12:30 – 13:00", b_s3: "12:00 – 13:00 (1 hour)", b_s4: "Other time (to be agreed)", b_custom: "Proposed time (e.g. Tue 17:30)", b_notes: "Role / notes", b_submit: "Send request", b_sending: "Sending…", b_err_fields: "Please fill in name, a valid email and a date.", b_err_weekend: "Please pick a weekday (Monday–Friday).", b_err_rate: "Too many requests. Please try again later.", b_err: "Something went wrong. You can email Jerry directly at elgendyjerry@gmail.com.", b_ok: "✅ <strong>Request sent!</strong><br>Jerry has received your interview request on Gmail for <strong>{date}</strong> · <strong>{slot}</strong>. Once he approves it you'll receive a confirmation and a Google Calendar invite at <strong>{email}</strong>." },
    it: { q_btn_book: "📅 Prenota un colloquio", b_intro: "Perfetto! Compila il modulo qui sotto: Jerry riceverà la richiesta su Gmail e la confermerà personalmente. ✅", b_title: "Richiesta di colloquio", b_name: "Nome e cognome *", b_company: "Azienda", b_email: "La tua email *", b_date: "Data (Lun–Ven) *", b_slot: "Fascia oraria (CET)", b_s1: "12:00 – 12:30", b_s2: "12:30 – 13:00", b_s3: "12:00 – 13:00 (1 ora)", b_s4: "Altro orario (da concordare)", b_custom: "Orario proposto (es. Mar 17:30)", b_notes: "Posizione / note", b_submit: "Invia richiesta", b_sending: "Invio in corso…", b_err_fields: "Inserisci nome, un'email valida e una data.", b_err_weekend: "Scegli un giorno feriale (lunedì–venerdì).", b_err_rate: "Troppe richieste. Riprova più tardi.", b_err: "Qualcosa è andato storto. Puoi scrivere direttamente a elgendyjerry@gmail.com.", b_ok: "✅ <strong>Richiesta inviata!</strong><br>Jerry ha ricevuto su Gmail la tua richiesta di colloquio per <strong>{date}</strong> · <strong>{slot}</strong>. Appena la approva riceverai conferma e invito Google Calendar su <strong>{email}</strong>." },
    de: { q_btn_book: "📅 Interview buchen", b_intro: "Super! Fülle das Formular aus: Jerry erhält deine Anfrage per Gmail und bestätigt sie persönlich. ✅", b_title: "Interview-Anfrage", b_name: "Vollständiger Name *", b_company: "Unternehmen", b_email: "Deine E-Mail *", b_date: "Datum (Mo–Fr) *", b_slot: "Zeitfenster (MEZ)", b_s1: "12:00 – 12:30", b_s2: "12:30 – 13:00", b_s3: "12:00 – 13:00 (1 Stunde)", b_s4: "Andere Zeit (nach Absprache)", b_custom: "Vorgeschlagene Zeit (z. B. Di 17:30)", b_notes: "Position / Notizen", b_submit: "Anfrage senden", b_sending: "Wird gesendet…", b_err_fields: "Bitte Name, gültige E-Mail und Datum angeben.", b_err_weekend: "Bitte einen Werktag wählen (Montag–Freitag).", b_err_rate: "Zu viele Anfragen. Bitte später erneut versuchen.", b_err: "Etwas ist schiefgelaufen. Schreib Jerry direkt an elgendyjerry@gmail.com.", b_ok: "✅ <strong>Anfrage gesendet!</strong><br>Jerry hat deine Interview-Anfrage für <strong>{date}</strong> · <strong>{slot}</strong> per Gmail erhalten. Nach seiner Freigabe erhältst du eine Bestätigung und eine Google-Calendar-Einladung an <strong>{email}</strong>." },
    fr: { q_btn_book: "📅 Réserver un entretien", b_intro: "Parfait ! Remplissez le formulaire : Jerry recevra votre demande sur Gmail et la confirmera personnellement. ✅", b_title: "Demande d'entretien", b_name: "Nom complet *", b_company: "Entreprise", b_email: "Votre e-mail *", b_date: "Date (lun–ven) *", b_slot: "Créneau (CET)", b_s1: "12:00 – 12:30", b_s2: "12:30 – 13:00", b_s3: "12:00 – 13:00 (1 heure)", b_s4: "Autre horaire (à convenir)", b_custom: "Horaire proposé (ex. mar 17:30)", b_notes: "Poste / notes", b_submit: "Envoyer la demande", b_sending: "Envoi…", b_err_fields: "Merci d'indiquer nom, e-mail valide et date.", b_err_weekend: "Choisissez un jour ouvré (lundi–vendredi).", b_err_rate: "Trop de demandes. Réessayez plus tard.", b_err: "Une erreur est survenue. Écrivez directement à elgendyjerry@gmail.com.", b_ok: "✅ <strong>Demande envoyée !</strong><br>Jerry a reçu votre demande d'entretien sur Gmail pour le <strong>{date}</strong> · <strong>{slot}</strong>. Dès validation, vous recevrez une confirmation et une invitation Google Agenda à <strong>{email}</strong>." },
    es: { q_btn_book: "📅 Reservar entrevista", b_intro: "¡Perfecto! Rellena el formulario: Jerry recibirá tu solicitud en Gmail y la confirmará personalmente. ✅", b_title: "Solicitud de entrevista", b_name: "Nombre completo *", b_company: "Empresa", b_email: "Tu email *", b_date: "Fecha (lun–vie) *", b_slot: "Franja horaria (CET)", b_s1: "12:00 – 12:30", b_s2: "12:30 – 13:00", b_s3: "12:00 – 13:00 (1 hora)", b_s4: "Otro horario (a acordar)", b_custom: "Horario propuesto (ej. mar 17:30)", b_notes: "Puesto / notas", b_submit: "Enviar solicitud", b_sending: "Enviando…", b_err_fields: "Indica nombre, un email válido y una fecha.", b_err_weekend: "Elige un día laborable (lunes–viernes).", b_err_rate: "Demasiadas solicitudes. Inténtalo más tarde.", b_err: "Algo salió mal. Puedes escribir a elgendyjerry@gmail.com.", b_ok: "✅ <strong>¡Solicitud enviada!</strong><br>Jerry ha recibido en Gmail tu solicitud de entrevista para el <strong>{date}</strong> · <strong>{slot}</strong>. Cuando la apruebe recibirás confirmación e invitación de Google Calendar en <strong>{email}</strong>." },
  };
  Object.keys(BOOK_I18N).forEach((l) => Object.assign(I18N[l], BOOK_I18N[l]));

  const BOOK_INTENT = /\b(book|booking|schedule|interview|meeting|appointment|call\s+with|colloquio|prenot|appuntament|fissare|incontro|termin|vorstellungsgespr|gespräch|entretien|rendez-vous|réserver|entrevista|reservar|cita|reunión)\b/i;

  function nextWeekday() {
    const d = new Date();
    do { d.setDate(d.getDate() + 1); } while (d.getDay() === 0 || d.getDay() === 6);
    return d.toISOString().slice(0, 10);
  }

  function showBookingCard() {
    const t = I18N[currentLang] || I18N.en;
    addBotMessage(t.b_intro, "agent.tool_select('book_interview')");
    const wrap = document.createElement("div");
    wrap.className = "chat-msg bot booking-msg";
    const minDate = new Date().toISOString().slice(0, 10);
    wrap.innerHTML = `
      <form class="booking-card" novalidate>
        <div class="booking-head mono">📅 ${escapeHTML(t.b_title)}</div>
        <label>${escapeHTML(t.b_name)}<input name="name" required maxlength="120" autocomplete="name" /></label>
        <label>${escapeHTML(t.b_company)}<input name="company" maxlength="120" autocomplete="organization" /></label>
        <label>${escapeHTML(t.b_email)}<input name="email" type="email" required maxlength="160" autocomplete="email" /></label>
        <div class="booking-row">
          <label>${escapeHTML(t.b_date)}<input name="date" type="date" required min="${minDate}" value="${nextWeekday()}" /></label>
          <label>${escapeHTML(t.b_slot)}
            <select name="slot">
              <option value="12:00 – 12:30 CET">${t.b_s1}</option>
              <option value="12:30 – 13:00 CET">${t.b_s2}</option>
              <option value="12:00–13:00 CET">${t.b_s3}</option>
              <option value="custom">${escapeHTML(t.b_s4)}</option>
            </select>
          </label>
        </div>
        <label class="booking-custom" hidden>${escapeHTML(t.b_custom)}<input name="customTime" maxlength="120" /></label>
        <label>${escapeHTML(t.b_notes)}<textarea name="notes" rows="2" maxlength="500"></textarea></label>
        <input name="website" class="booking-hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <p class="booking-error" role="alert"></p>
        <button type="submit" class="booking-submit">${escapeHTML(t.b_submit)} →</button>
      </form>`;
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const form = $("form", wrap);
    const slotSel = form.elements.slot;
    const customBox = $(".booking-custom", form);
    const errEl = $(".booking-error", form);
    const btn = $(".booking-submit", form);
    slotSel.addEventListener("change", () => { customBox.hidden = slotSel.value !== "custom"; });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      errEl.textContent = "";
      const f = form.elements;
      if (f.website.value) return; // honeypot (bots)
      const data = {
        name: f.name.value.trim(),
        company: f.company.value.trim(),
        email: f.email.value.trim(),
        date: f.date.value,
        slot: slotSel.value === "custom" ? "Custom (to be agreed)" : slotSel.value,
        customTime: slotSel.value === "custom" ? f.customTime.value.trim() : "",
        notes: f.notes.value.trim(),
        lang: currentLang,
      };
      if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !data.date) {
        errEl.textContent = t.b_err_fields; return;
      }
      const day = new Date(data.date + "T12:00:00").getDay();
      if (day === 0 || day === 6) { errEl.textContent = t.b_err_weekend; return; }

      btn.disabled = true; btn.textContent = t.b_sending;
      try {
        const resp = await fetch("/api/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (resp.status === 429) throw new Error("rate");
        const json = await resp.json().catch(() => ({}));
        if (!resp.ok || !json.ok) throw new Error("fail");
        wrap.remove();
        const slotLabel = data.customTime ? data.customTime : data.slot;
        addBotMessage(
          t.b_ok.replace("{date}", escapeHTML(data.date)).replace("{slot}", escapeHTML(slotLabel)).replace("{email}", escapeHTML(data.email)),
          json.trace || "agent.tool_call('book_interview', status='pending_gmail_approval')"
        );
      } catch (err) {
        errEl.textContent = err.message === "rate" ? t.b_err_rate : t.b_err;
        btn.disabled = false; btn.textContent = t.b_submit + " →";
      }
    });
  }

  let busy = false;
  async function handleQuestion(text) {
    const clean = text.trim();
    if (!clean || busy) return;
    if (BOOK_INTENT.test(clean)) {
      addUserMessage(clean);
      showBookingCard();
      return;
    }
    busy = true;
    addUserMessage(clean);

    const typing = document.createElement("div");
    typing.className = "chat-msg bot";
    typing.innerHTML = `<div class="chat-typing"><i></i><i></i><i></i></div>`;
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const resp = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          history: chatHistory.slice(-6),
          lang: currentLang,
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data && data.reply) {
          typing.remove();
          chatHistory.push({ role: "user", text: clean });
          chatHistory.push({ role: "model", text: data.reply });
          addBotMessage(formatMarkdownToHTML(data.reply), data.trace || `${data.model || "gemini"} · rag`);
          busy = false;
          return;
        }
      }
    } catch {}

    // Fallback to local RAG KB if offline or running via file://
    await sleep(prefersReduced ? 80 : 380);
    typing.remove();
    const ans = findLocalAnswer(clean);
    addBotMessage(ans.reply, ans.trace);
    busy = false;
  }

  function initChat() {
    chatMessages.innerHTML = "";
    chatHistory.length = 0;
    const dict = I18N[currentLang] || I18N.en;
    addBotMessage(dict.chat_welcome, "gemini-llm · agent.init()");
  }

  function toggleChat(force) {
    const open = typeof force === "boolean" ? force : !chatWidget.classList.contains("open");
    chatWidget.classList.toggle("open", open);
    chatFab.setAttribute("aria-expanded", open);
    chatPanel.setAttribute("aria-hidden", !open);
    if (open) setTimeout(() => chatInput.focus({ preventScroll: true }), 150);
  }

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
    if (b.id === "quickBook") {
      b.addEventListener("click", () => { addUserMessage(b.textContent); showBookingCard(); });
      return;
    }
    b.addEventListener("click", () => handleQuestion(b.getAttribute("data-q")));
  });
  $$(".chat-messages").forEach((el) => {
    el.addEventListener("click", (e) => {
      const a = e.target.closest("a[href^='#']");
      if (a && innerWidth < 600) toggleChat(false);
    });
  });

  /* ---------------------------------------------------------
     9. Language Switcher + Misc
     --------------------------------------------------------- */
  $$(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => applyLanguage(btn.dataset.lang, true));
  });

  // Default to English ("en") as requested
  applyLanguage("en", true);

  const toast = $("#toast");
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove("show"), 2200);
  }
  $("#copyEmail").addEventListener("click", async () => {
    const dict = I18N[currentLang] || I18N.en;
    try { await navigator.clipboard.writeText("elgendyjerry@gmail.com"); showToast(dict.toast_copied); }
    catch { showToast("elgendyjerry@gmail.com"); }
  });
  $("#year").textContent = new Date().getFullYear();
})();

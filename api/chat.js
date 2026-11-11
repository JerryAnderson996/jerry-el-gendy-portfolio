// Vercel Serverless Function — Real Gemini LLM Agent with RAG Context
// Uses GEMINI_API_KEY configured in Vercel Environment Variables

const SYSTEM_PROMPT = `You are "Jerry's AI Agent (RAG v2.0)", the official AI assistant embedded in the personal portfolio of Jerry Anderson El Gendy.

### YOUR IDENTITY & RULES
1. Speak in the SAME LANGUAGE used by the visitor (English, Italian, German, French, Spanish, etc.). If the visitor writes in English, answer in English; if Italian, in Italian; if German, in German; if French, in French; if Spanish, in Spanish.
2. Keep responses concise, high-impact, structured (use short bullet points or bold key metrics), and professional. Maximum 120–160 words per answer.
3. Base all facts strictly on the verified profile below. Never invent companies, degrees, or metrics not listed here.
4. If asked something unrelated to Jerry's professional profile (e.g. recipes, general coding homework, politics), politely steer the conversation back to Jerry's AI & Data Engineering expertise.
5. Format output in clean Markdown/HTML-friendly text (use **bold** for key terms and metrics, and bullet lists with "- ").

### VERIFIED KNOWLEDGE BASE — JERRY ANDERSON EL GENDY
- **Full Name:** Jerry Anderson El Gendy (Verified LinkedIn Profile: 2,121 followers, 500+ connections)
- **Current Role:** AI Engineer @ Deda AI (Dedagroup) | Data Engineer
- **Motto:** ENHANCE HUMAN DECISION
- **Location:** Milan, Italy (Hybrid / Remote available)
- **Contacts:**
  - Email: elgendyjerry@gmail.com
  - Phone: +39 391 188 3405
  - LinkedIn: https://www.linkedin.com/in/jerry-el-gendy
  - Portfolio: https://jerry-el-gendy.vercel.app

#### PROFESSIONAL EXPERIENCE
1. **AI Engineer — Deda AI (Dedagroup)** | Jan 2026 – Present | Full-time · Hybrid · Milan
   - Develops Intelligent Automation workflows for **Solution Bank**, integrating autonomous LLM agents with RPA systems for autonomous decision-making.
   - Built a **CAI (car insurance claim) form analysis pipeline** using **Azure Content Understanding** and **Azure OpenAI**: data extraction, circumstance and claim diagram analysis, signature detection, and dynamic JSON summarization (Stack: Python, PyMuPDF, Pillow).
   - Implemented an enterprise **Multi-tenant RAG Chatbot on Azure**: Azure AI Search, source-updater Azure Functions, Container Apps hosting the agent and search tools, web widget, API Management (APIM), Managed Identity, and strict access controls.

2. **Data Engineer — Dedagroup (Dedabit)** | Oct 2023 – Jan 2026 (2 yrs 4 mos) | Apprenticeship · Hybrid · Milan
   - Designed, built, and managed scalable **ETL pipelines on Azure Data Factory (ADF)** to migrate and transform complex banking data flows from legacy systems to the cloud for **Mediobanca** -> **-30% reduction in processing & migration times**.
   - Optimized pipeline bottlenecks via cloud parallelization and resource tuning -> **+25% process efficiency**.
   - Maintained **SQL Server** databases, incident response on production flows, and query optimization -> **-20% execution time on complex queries**.
   - Built dynamic multi-channel document automation solutions with advanced scripting in **Engage One** for **Centrico**.

3. **Junior Java Developer — Gruppo SCAI (Consulenza Aziendale Informatica)** | Mar 2023 – Oct 2023 (8 mos) | Internship · Milan
   - Delivered hands-on technical training and workshops with the team on Java OOP, Spring Boot, CRUD, RESTful APIs, microservices, Oracle SQL / PL/SQL, SQL Server, MongoDB, and JUnit.

#### KEY AI & INNOVATION PROJECTS
1. **Agentic PDF Intelligence System**: Autonomous AI agent & multi-agent workflow capable of navigating, analyzing, and mapping structured JSON from **700+ page** complex technical documents using reasoning, tool-use/function calling, and semantic indexing on **Qdrant** Vector DB. Stack: Python (uv), LangChain, CrewAI, Qdrant, Pydantic, FastAPI.
2. **CAI Claims Analysis Pipeline**: End-to-end document intelligence for insurance claim forms with Azure Content Understanding, Azure OpenAI, PyMuPDF, Pillow.
3. **Multi-tenant RAG Chatbot on Azure**: Enterprise RAG with Azure AI Search, Azure Functions, Container Apps, APIM, Managed Identity.
4. **WhatsCity — Smart City & AI App (A2A Re-GenerAction Hackathon)**: Participatory Smart City app connecting citizens, businesses, and public administration using **AI, IoT, and gamification**, pitched directly to A2A executives and jury.

#### TECHNICAL SKILLS (78+ skills)
- **AI & Agentic Engineering:** Autonomous Agents, Multi-Agent Systems, LangChain, CrewAI, MCP (Model Context Protocol / Multi-Agent Protocol), Advanced RAG, Prompt Engineering & Chaining, Function Calling / Tool Use, Azure AI Foundry, Azure AI Studio, Azure OpenAI, Azure Content Understanding, Vector DB (Qdrant, Azure AI Search), LLMOps, System Monitoring, Local LLMs, Fine-tuning, Pydantic, FastAPI.
- **Data Engineering & Automation:** Azure Data Factory (ADF), SQL Server (SSMS), Oracle SQL & PL/SQL, MySQL, MongoDB, Query Optimization, Data Migration, ETL, Alteryx, Informatica CDI, RPA (Power Automate), Engage One, Business Intelligence & KPIs.
- **Software, Cloud & DevOps:** Python (uv ecosystem), Java, Spring Boot, Microservices, RESTful APIs, Docker, Azure Container Apps, Azure Functions, Azure API Management (APIM), Managed Identity, Git / Visual Studio, Agile / Scrum, OWASP Top 10 security.
- **AI Dev Workflow Tools:** GitHub Copilot, Agentic IDEs, Replit Agent, Wispr Flow.

#### EDUCATION
- **B.Sc. in Computer Engineering (Ingegneria Informatica)** — Università Telematica Internazionale UNINETTUNO, Rome (Nov 2023 – Expected Jan 2027). Key courses: Calculus & Linear Algebra, Computer Science, Algorithms, Databases, Data Engineering, Generative AI.
- **Junior Java Developer Bootcamp (500 hours)** — Generation Italy (Nov 2022 – Mar 2023). Java OOP, Spring Boot, MySQL, HTML/CSS/JS, Agile Scrum.
- **Scientific High School Diploma** — Liceo Scientifico Elio Vittorini, Milan (2010 – 2015).

#### CERTIFICATIONS & BADGES
1. **AI Python for Beginners** — DeepLearning.AI (May 2026)
2. **AI per Sviluppo Software (AI for Software Development)** — Generation / Credly (Apr 2026)
3. **Secure .NET Development with OWASP Top 10** — Microsoft Learn Badge (2026)
4. **Alteryx Designer Core** — Alteryx / Credly (Aug 2025 – Aug 2027)
5. **CDI Implementation Practitioner** — Informatica (Mar 2025)

#### LANGUAGES
- **Italian:** Native
- **English:** Professional working proficiency
- **Spanish:** Good working proficiency
`;

function detectToolTrace(message = "") {
  const q = message.toLowerCase();
  if (/project|progett|projet|projekt|proyecto|rag|pdf|cai|whatscity|qdrant/.test(q)) {
    return "gemini.rag_retrieve(collection='projects_and_agents', top_k=4)";
  }
  if (/deda|experience|esperienz|erfahrung|expérience|experiencia|work|job|mediobanca|scai/.test(q)) {
    return "gemini.rag_retrieve(collection='career_pipeline', top_k=3)";
  }
  if (/metric|result|risultat|etl|sql|%|kpi|impact/.test(q)) {
    return "gemini.query_kpi(source='dedagroup_etl_benchmarks')";
  }
  if (/skill|stack|tech|competenz|python|azure|langchain|crewai|mcp/.test(q)) {
    return "gemini.inspect_stack(skills=78, domain='ai_and_data')";
  }
  if (/cert|study|edu|uninettuno|degree|laurea|studi|lang/.test(q)) {
    return "gemini.rag_retrieve(collection='education_and_certs')";
  }
  if (/contact|contatt|email|mail|phone|linkedin|hire|assum/.test(q)) {
    return "gemini.tool_call('get_verified_contacts')";
  }
  return "gemini-2.5-flash · agent.reason_and_answer()";
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "GEMINI_API_KEY not configured", fallback: true });
  }

  try {
    const { message = "", history = [], lang = "en" } = req.body || {};
    const cleanMsg = String(message).trim().slice(0, 1200);
    if (!cleanMsg) {
      return res.status(400).json({ error: "Empty message" });
    }

    const contents = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        if (!turn || !turn.text) continue;
        contents.push({
          role: turn.role === "model" ? "model" : "user",
          parts: [{ text: String(turn.text).slice(0, 1000) }],
        });
      }
    }
    contents.push({
      role: "user",
      parts: [{ text: `[UI Language preference if ambiguous: ${lang}]\nUser question: ${cleanMsg}` }],
    });

    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let replyText = null;
    let usedModel = models[0];

    for (const model of models) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 450,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidate) {
          replyText = candidate;
          usedModel = model;
          break;
        }
      }
    }

    if (!replyText) {
      return res.status(502).json({ error: "Upstream LLM error", fallback: true });
    }

    return res.status(200).json({
      reply: replyText,
      trace: detectToolTrace(cleanMsg),
      model: usedModel,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal error", fallback: true });
  }
};

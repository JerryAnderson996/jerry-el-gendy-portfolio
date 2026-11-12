// Vercel Edge Function — Interview Booking Agent (/api/book)
// Sends an instant approval email to elgendyjerry@gmail.com with:
//  - Recruiter Name, Company, Email, Requested Date & Time Slot (Mon–Fri 12:00–13:00 or custom), Notes
//  - [✅ Approve & Add to Google Calendar (inviting recruiter)] button
//  - [✉️ Approve via Pre-filled Email] button
//  - [🔄 Propose Another Time] button

export const config = {
  runtime: "edge",
};

const ALLOWED_ORIGINS = [
  "https://jerry-el-gendy.vercel.app",
  "https://jerry-el-gendy-portfolio.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Rate limiter for booking submissions (max 5 requests per 15 min per IP)
const bookingRateStore = new Map();

function checkBookingRate(ip) {
  const now = Date.now();
  const windowStart = now - 900_000;
  let list = bookingRateStore.get(ip) || [];
  list = list.filter((t) => t > windowStart);
  if (list.length >= 5) return false;
  list.push(now);
  bookingRateStore.set(ip, list);
  return true;
}

function toGoogleCalendarDates(dateStr, slotStr) {
  // dateStr: YYYY-MM-DD
  const cleanDate = (dateStr || "").replace(/-/g, "");
  if (!/^\d{8}$/.test(cleanDate)) return "";
  let startHHMM = "120000";
  let endHHMM = "123000";
  const s = (slotStr || "").replace(/\s/g, "");
  if (s.startsWith("12:30")) {
    startHHMM = "123000";
    endHHMM = "130000";
  } else if (s.startsWith("12:00–13:00") || s.startsWith("12:00-13:00")) {
    startHHMM = "120000";
    endHHMM = "130000";
  }
  return `${cleanDate}T${startHHMM}/${cleanDate}T${endHHMM}`;
}

function buildCalendarApprovalUrl({ name, company, email, date, slot, customTime, notes }) {
  const title = `Interview: Jerry Anderson El Gendy × ${company ? `${name} (${company})` : name}`;
  const timeInfo = customTime ? `${slot} (${customTime})` : slot;
  const details = [
    `Interview / Collaboration call with ${name}${company ? ` from ${company}` : ""}.`,
    `Recruiter Email: ${email}`,
    `Requested Slot: ${date} · ${timeInfo} (CET)`,
    notes ? `Notes / Role: ${notes}` : "",
    "",
    "Confirmed via Jerry's Portfolio AI Agent (https://jerry-el-gendy.vercel.app)",
  ]
    .filter(Boolean)
    .join("\n");

  const dates = toGoogleCalendarDates(date, slot);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
    add: email,
    ctz: "Europe/Rome",
    trp: "true",
  });
  if (dates) params.set("dates", dates);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export default async function handler(req) {
  const origin = req.headers.get("origin") || "";
  const referer = req.headers.get("referer") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  const headers = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });
  }

  const isSameSite =
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o) || referer.startsWith(o)) ||
    origin.endsWith(".vercel.app");
  if (!isSameSite) {
    return new Response(JSON.stringify({ error: "Forbidden origin" }), { status: 403, headers });
  }

  const clientIp = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown")
    .split(",")[0]
    .trim();
  if (!checkBookingRate(clientIp)) {
    return new Response(JSON.stringify({ error: "Too many booking requests. Please try again later." }), {
      status: 429,
      headers,
    });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = String(body.name || "").trim().slice(0, 120);
    const company = String(body.company || "").trim().slice(0, 120);
    const email = String(body.email || "").trim().slice(0, 160);
    const date = String(body.date || "").trim().slice(0, 40);
    const slot = String(body.slot || "12:00 – 12:30 CET").trim().slice(0, 80);
    const customTime = String(body.customTime || "").trim().slice(0, 120);
    const notes = String(body.notes || "").trim().slice(0, 500);

    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !date) {
      return new Response(JSON.stringify({ error: "Please provide a valid name, email, and date." }), {
        status: 400,
        headers,
      });
    }

    const gcalUrl = buildCalendarApprovalUrl({ name, company, email, date, slot, customTime, notes });
    const displaySlot = customTime ? `${slot} — Proposed: ${customTime}` : slot;

    const approveMailSubject = encodeURIComponent(
      `Confirmed: Interview with Jerry Anderson El Gendy (${date} · ${customTime || slot})`
    );
    const approveMailBody = encodeURIComponent(
      `Hi ${name},\n\nThank you for reaching out via my AI portfolio! I'm happy to confirm our interview/call for:\n\n📅 Date: ${date}\n⏰ Time: ${displaySlot} (CET / Europe/Rome)\n\nI'm sending over the calendar invite shortly.\n\nBest regards,\nJerry Anderson El Gendy\nAI Engineer & Data Engineer\n+39 391 188 3405\nhttps://jerry-el-gendy.vercel.app`
    );
    const rescheduleMailSubject = encodeURIComponent(
      `Re: Interview Request with Jerry Anderson El Gendy (${company || name})`
    );
    const rescheduleMailBody = encodeURIComponent(
      `Hi ${name},\n\nThank you for your interview request on my portfolio for ${date} (${displaySlot}).\n\nI'd love to connect! Could we instead schedule it for [PROPOSE NEW DATE/TIME, e.g. Mon–Fri 12:00–13:00 CET]?\n\nBest regards,\nJerry Anderson El Gendy\n+39 391 188 3405`
    );

    const approveMailto = `mailto:${email}?subject=${approveMailSubject}&body=${approveMailBody}`;
    const rescheduleMailto = `mailto:${email}?subject=${rescheduleMailSubject}&body=${rescheduleMailBody}`;

    // Deliver notification to Jerry's Gmail via Web3Forms (if configured) or FormSubmit (with 7s timeout)
    let delivered = false;
    const web3Key = process.env.WEB3FORMS_ACCESS_KEY;

    const formPayload = {
      _subject: `[Approval Needed] Colloquio richiesto da ${name}${company ? ` (${company})` : ""} - ${date}`,
      _template: "table",
      _replyto: email,
      Recruiter: name,
      Azienda: company || "Non specificata",
      Email_Recruiter: email,
      Data_Richiesta: date,
      Fascia_Oraria: displaySlot,
      Note_Posizione: notes || "Nessuna nota aggiuntiva",
      Approva_Google_Calendar: gcalUrl,
      Approva_Email: approveMailto,
      Proponi_Altro_Orario: rescheduleMailto,
    };

    if (web3Key) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 5000);
      try {
        const wResp = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          signal: ctrl.signal,
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: web3Key,
            subject: `🗓️ [Interview Approval Needed] ${name}${company ? ` (${company})` : ""} — ${date} (${displaySlot})`,
            from_name: "Jerry's Portfolio AI Agent",
            replyto: email,
            Name: name,
            Company: company || "—",
            "Recruiter Email": email,
            "Requested Date": date,
            "Time Slot": displaySlot,
            "Role / Notes": notes || "—",
            "✅ APPROVE & SEND GOOGLE CALENDAR INVITE": gcalUrl,
            "✉️ APPROVE VIA EMAIL": approveMailto,
            "🔄 PROPOSE ANOTHER TIME": rescheduleMailto,
          }),
        });
        delivered = wResp.ok;
      } catch {} finally { clearTimeout(t); }
    }

    if (!delivered) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 7000);
      try {
        const fsResp = await fetch("https://formsubmit.co/ajax/elgendyjerry@gmail.com", {
          method: "POST",
          signal: ctrl.signal,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Origin: "https://jerry-el-gendy.vercel.app",
            Referer: "https://jerry-el-gendy.vercel.app/",
            "User-Agent": "Mozilla/5.0 (compatible; JerryPortfolioAgent/1.0)",
          },
          body: JSON.stringify(formPayload),
        });
        if (fsResp.ok) {
          const fsJson = await fsResp.json().catch(() => ({}));
          delivered = fsJson.success === "true" || fsJson.success === true;
        }
      } catch {} finally { clearTimeout(t); }
    }

    return new Response(
      JSON.stringify({
        ok: true,
        delivered,
        clientDeliveryUrl: delivered ? undefined : "https://formsubmit.co/ajax/elgendyjerry@gmail.com",
        clientPayload: delivered ? undefined : formPayload,
        trace: "agent.tool_call('book_interview', status='pending_gmail_approval')",
        summary: { name, company, email, date, displaySlot },
      }),
      { status: 200, headers }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Could not process booking request." }), {
      status: 500,
      headers,
    });
  }
}

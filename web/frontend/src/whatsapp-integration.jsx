import { useState, useEffect, useRef } from "react";

// ============================================================
// BACKEND SETUP GUIDE (Node.js / Express)
// ============================================================
// This component includes a full visual reference of the
// backend architecture alongside the chat widget UI.
// ============================================================

const MOCK_FAQS = [
  { id: 1, question: "How do I reset my password?", answer: "Go to Settings → Account → Reset Password. You'll receive an email within 2 minutes." },
  { id: 2, question: "What are your support hours?", answer: "Our team is available Mon–Fri, 9AM–6PM. This WhatsApp bot is available 24/7." },
  { id: 3, question: "How do I update my membership?", answer: "Visit the Membership tab in your dashboard or reply UPGRADE to get our current plans." },
  { id: 4, question: "Can I cancel anytime?", answer: "Yes! Cancel from your account page or type CANCEL to start the process here." },
];

const QUICK_REPLIES = ["🔐 Reset Password", "📋 My Membership", "💬 Talk to Agent", "❓ FAQs"];

function simulateBotReply(message) {
  const lower = message.toLowerCase();
  if (lower.includes("password") || lower.includes("reset")) return MOCK_FAQS[0].answer;
  if (lower.includes("hour") || lower.includes("support")) return MOCK_FAQS[1].answer;
  if (lower.includes("member") || lower.includes("plan") || lower.includes("upgrade")) return MOCK_FAQS[2].answer;
  if (lower.includes("cancel")) return MOCK_FAQS[3].answer;
  if (lower.includes("faq") || lower.includes("help")) return "Here are common questions:\n\n" + MOCK_FAQS.map((f, i) => `${i + 1}. ${f.question}`).join("\n");
  if (lower.includes("agent") || lower.includes("human")) return "Connecting you to a live agent... 🔄\nTypically responds within 5 minutes during business hours.";
  return "Thanks for reaching out! 😊 I didn't quite catch that. Try asking about your membership, password reset, or type FAQ for a full list of topics I can help with.";
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Backend Code Snippet Viewer ────────────────────────────
const CODE_SNIPPETS = {
  server: `// server.js — Express Webhook for Twilio WhatsApp
const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Webhook endpoint (set in Twilio console)
app.post('/webhook/whatsapp', async (req, res) => {
  const twiml = new twilio.twiml.MessagingResponse();
  const incomingMsg = req.body.Body?.toLowerCase();
  const from = req.body.From; // whatsapp:+1234567890

  // Fetch member data from your DB
  const member = await db.members.findOne({ phone: from });
  const name = member?.name || 'there';

  let reply = \`Hi \${name}! 👋 How can I help you today?\`;

  if (incomingMsg.includes('password')) {
    reply = 'To reset your password, visit: https://yourapp.com/reset';
  } else if (incomingMsg.includes('member')) {
    reply = \`Your plan: \${member?.plan}\\nRenews: \${member?.renewalDate}\`;
  }

  twiml.message(reply);
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(3001, () => console.log('Webhook running on :3001'));`,

  outbound: `// sendMessage.js — Send outbound WhatsApp messages
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendWhatsAppMessage(to, body) {
  const message = await client.messages.create({
    from: 'whatsapp:+14155238886', // Twilio Sandbox / Your number
    to:   \`whatsapp:\${to}\`,
    body: body,
  });
  return message.sid;
}

// Send a notification (e.g., membership renewal reminder)
sendWhatsAppMessage(
  '+1234567890',
  '⚠️ Your membership renews in 3 days. Reply MANAGE to update.'
);`,

  env: `# .env — Environment Variables
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# Your DB connection (example: MongoDB)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mydb

# Webhook URL (use ngrok locally, your domain in prod)
WEBHOOK_URL=https://yourapp.com/webhook/whatsapp`,

  frontend: `// useWhatsApp.js — React Hook for integration
import { useState, useCallback } from 'react';

export function useWhatsApp() {
  const [status, setStatus] = useState('idle');

  const sendMessage = useCallback(async (phone, message) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phone, body: message }),
      });
      const data = await res.json();
      setStatus('sent');
      return data.sid;
    } catch (err) {
      setStatus('error');
      throw err;
    }
  }, []);

  return { sendMessage, status };
}`,
};

function CodeBlock({ code, label }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: "#0d1117", borderRadius: 10, overflow: "hidden", border: "1px solid #30363d", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 14px", background: "#161b22", borderBottom: "1px solid #30363d" }}>
        <span style={{ color: "#8b949e", fontSize: 12, fontFamily: "monospace" }}>{label}</span>
        <button onClick={copy} style={{ background: copied ? "#238636" : "#21262d", color: copied ? "#fff" : "#8b949e", border: "1px solid #30363d", borderRadius: 6, padding: "3px 10px", fontSize: 11, cursor: "pointer", transition: "all .2s" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "14px 16px", overflowX: "auto", fontSize: 11.5, lineHeight: 1.65, color: "#e6edf3", fontFamily: "'Fira Code', 'Courier New', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Architecture Diagram ────────────────────────────────────
function ArchDiagram() {
  const nodes = [
    { label: "React Web App", sub: "Chat Widget UI", color: "#3b82f6", icon: "⚛️" },
    { label: "Express Server", sub: "Webhook Handler", color: "#8b5cf6", icon: "🖥️" },
    { label: "Twilio BSP", sub: "WhatsApp API", color: "#10b981", icon: "📡" },
    { label: "Member Database", sub: "MongoDB / SQL", color: "#f59e0b", icon: "🗄️" },
    { label: "WhatsApp", sub: "End User", color: "#25d366", icon: "💬" },
  ];
  const arrows = [
    { from: 0, to: 1, label: "REST API" },
    { from: 1, to: 2, label: "Twilio SDK" },
    { from: 2, to: 4, label: "WA Message" },
    { from: 4, to: 2, label: "User Reply" },
    { from: 2, to: 1, label: "Webhook POST" },
    { from: 1, to: 3, label: "DB Query" },
  ];
  return (
    <div style={{ background: "#0d1117", borderRadius: 12, padding: 24, border: "1px solid #30363d", marginBottom: 24 }}>
      <h3 style={{ color: "#e6edf3", margin: "0 0 20px", fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }}>// SYSTEM ARCHITECTURE</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginBottom: 20 }}>
        {nodes.map((n, i) => (
          <div key={i} style={{ background: "#161b22", border: `1.5px solid ${n.color}40`, borderRadius: 10, padding: "12px 16px", textAlign: "center", minWidth: 110, position: "relative" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{n.icon}</div>
            <div style={{ color: n.color, fontSize: 12, fontWeight: 700, fontFamily: "monospace" }}>{n.label}</div>
            <div style={{ color: "#6e7681", fontSize: 10, marginTop: 3 }}>{n.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        {arrows.map((a, i) => (
          <div key={i} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 20, padding: "3px 10px", fontSize: 10, color: "#8b949e", fontFamily: "monospace" }}>
            {nodes[a.from].label.split(" ")[0]} → {nodes[a.to].label.split(" ")[0]}: <span style={{ color: "#58a6ff" }}>{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chat Widget ─────────────────────────────────────────────
function ChatWidget() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "👋 Hi there! I'm your Member Support Assistant.\n\nHow can I help you today? You can also reach us on WhatsApp anytime.", time: new Date(), status: "read" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [phoneLinked, setPhoneLinked] = useState(false);
  const [phone, setPhone] = useState("");
  const [linkStep, setLinkStep] = useState("idle"); // idle | input | verified
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (from, text, extra = {}) => {
    const msg = { id: Date.now() + Math.random(), from, text, time: new Date(), status: from === "user" ? "sent" : "read", ...extra };
    setMessages(prev => [...prev, msg]);
    return msg;
  };

  const send = async (text) => {
    if (!text.trim()) return;
    setInput("");
    addMessage("user", text);
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 700));
    setIsTyping(false);
    const reply = simulateBotReply(text);
    addMessage("bot", reply);
  };

  const handleQuickReply = (label) => {
    const clean = label.replace(/^[^\w\s]+ ?/, "");
    send(clean);
  };

  const linkWhatsApp = () => {
    if (!phone.trim()) return;
    setLinkStep("verified");
    setPhoneLinked(true);
    setTimeout(() => {
      addMessage("bot", `✅ WhatsApp linked to ${phone}!\n\nYou'll now receive updates & can continue this conversation on WhatsApp. A test message has been sent.`);
    }, 500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #075e54 0%, #128c7e 100%)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 11, height: 11, background: "#25d366", borderRadius: "50%", border: "2px solid #075e54" }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>Member Support</div>
          <div style={{ color: "#dcf8c6", fontSize: 11 }}>Powered by WhatsApp Business API</div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <button title="Link WhatsApp" onClick={() => setLinkStep(l => l === "idle" ? "input" : "idle")} style={{ background: "none", border: "none", color: phoneLinked ? "#dcf8c6" : "rgba(255,255,255,.7)", cursor: "pointer", fontSize: 18 }}>{phoneLinked ? "📱✓" : "📱"}</button>
        </div>
      </div>

      {/* WhatsApp Link Banner */}
      {linkStep === "input" && (
        <div style={{ background: "#e7fbe6", borderBottom: "1px solid #c3f1c3", padding: "12px 16px" }}>
          <div style={{ fontSize: 12, color: "#075e54", fontWeight: 700, marginBottom: 8 }}>📲 Link your WhatsApp number</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 234 567 8900"
              style={{ flex: 1, border: "1.5px solid #25d366", borderRadius: 8, padding: "6px 10px", fontSize: 13, outline: "none", background: "#fff" }}
            />
            <button onClick={linkWhatsApp} style={{ background: "#25d366", color: "#fff", border: "none", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Link</button>
          </div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 5 }}>We'll send a confirmation via Twilio WhatsApp API</div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", background: "#ece5dd", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8b8a2' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", display: "flex", flexDirection: "column", gap: 4 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", marginBottom: 4 }}>
            <div style={{
              maxWidth: "75%",
              background: msg.from === "user" ? "#dcf8c6" : "#fff",
              borderRadius: msg.from === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              padding: "8px 12px",
              boxShadow: "0 1px 2px rgba(0,0,0,.12)",
              position: "relative",
            }}>
              <div style={{ fontSize: 13.5, color: "#111", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{msg.text}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 4, marginTop: 3 }}>
                <span style={{ fontSize: 10, color: "#999" }}>{formatTime(msg.time)}</span>
                {msg.from === "user" && <span style={{ fontSize: 11, color: "#34b7f1" }}>✓✓</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
            <div style={{ background: "#fff", borderRadius: "12px 12px 12px 2px", padding: "10px 14px", boxShadow: "0 1px 2px rgba(0,0,0,.12)", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, background: "#999", borderRadius: "50%", animation: "bounce 1s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick Replies */}
      <div style={{ background: "#f0f2f5", padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid #e0e0e0" }}>
        {QUICK_REPLIES.map(qr => (
          <button key={qr} onClick={() => handleQuickReply(qr)} style={{ background: "#fff", border: "1.5px solid #25d366", color: "#075e54", borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600, transition: "all .15s", fontFamily: "inherit" }}
            onMouseOver={e => { e.target.style.background = "#25d366"; e.target.style.color = "#fff"; }}
            onMouseOut={e => { e.target.style.background = "#fff"; e.target.style.color = "#075e54"; }}>
            {qr}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ background: "#f0f2f5", padding: "10px 12px", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, background: "#fff", borderRadius: 24, display: "flex", alignItems: "center", padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,.1)" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && send(input)}
            placeholder="Type a message..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: 14, background: "transparent", fontFamily: "inherit", color: "#111" }}
          />
        </div>
        <button onClick={() => send(input)} style={{ width: 44, height: 44, borderRadius: "50%", background: input.trim() ? "#25d366" : "#b2bec3", border: "none", color: "#fff", fontSize: 18, cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", flexShrink: 0 }}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ─── Setup Checklist ─────────────────────────────────────────
function Checklist() {
  const steps = [
    { done: false, label: "Create Twilio account & get Account SID + Auth Token", link: "https://twilio.com" },
    { done: false, label: "Enable Twilio WhatsApp Sandbox or apply for official number" },
    { done: false, label: "Set Webhook URL in Twilio Console → Messaging → WhatsApp" },
    { done: false, label: "Install dependencies: npm install twilio express dotenv" },
    { done: false, label: "Configure .env with Twilio credentials" },
    { done: false, label: "Run webhook server and expose via ngrok for local dev" },
    { done: false, label: "Connect your member database for personalized responses" },
    { done: false, label: "Go live: Switch from sandbox to production WhatsApp number" },
  ];
  const [checked, setChecked] = useState(steps.map(() => false));
  const toggle = (i) => setChecked(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div style={{ background: "#0d1117", borderRadius: 12, padding: 20, border: "1px solid #30363d" }}>
      <h3 style={{ color: "#e6edf3", margin: "0 0 16px", fontSize: 14, fontFamily: "monospace", letterSpacing: 1 }}>// SETUP CHECKLIST</h3>
      {steps.map((s, i) => (
        <div key={i} onClick={() => toggle(i)} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: i < steps.length - 1 ? "1px solid #21262d" : "none", cursor: "pointer" }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checked[i] ? "#238636" : "#30363d"}`, background: checked[i] ? "#238636" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, transition: "all .2s" }}>
            {checked[i] && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
          </div>
          <span style={{ color: checked[i] ? "#6e7681" : "#e6edf3", fontSize: 13, textDecoration: checked[i] ? "line-through" : "none", transition: "all .2s" }}>
            {i + 1}. {s.label}
            {s.link && <a href={s.link} onClick={e => e.stopPropagation()} target="_blank" rel="noopener noreferrer" style={{ color: "#58a6ff", marginLeft: 6, fontSize: 11 }}>→ open</a>}
          </span>
        </div>
      ))}
      <div style={{ marginTop: 12, height: 6, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${(checked.filter(Boolean).length / steps.length) * 100}%`, background: "linear-gradient(90deg, #238636, #2ea043)", borderRadius: 3, transition: "width .4s" }} />
      </div>
      <div style={{ color: "#6e7681", fontSize: 11, marginTop: 6, fontFamily: "monospace" }}>{checked.filter(Boolean).length}/{steps.length} steps complete</div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("preview");
  const tabs = [
    { id: "preview", label: "💬 Chat Preview" },
    { id: "server", label: "🖥️ Webhook Server" },
    { id: "outbound", label: "📤 Send Message" },
    { id: "frontend", label: "⚛️ React Hook" },
    { id: "env", label: "🔐 Environment" },
    { id: "setup", label: "✅ Setup Guide" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#010409", color: "#e6edf3", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0d1117; }
        ::-webkit-scrollbar-thumb { background: #30363d; border-radius: 3px; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-5px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid #21262d", padding: "18px 32px", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#25d366", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💬</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: "#e6edf3" }}>WhatsApp Business API</div>
          <div style={{ fontSize: 12, color: "#6e7681" }}>Twilio Integration — React Web App</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {["Twilio BSP", "Member Support", "React + Express"].map(tag => (
            <span key={tag} style={{ background: "#21262d", border: "1px solid #30363d", color: "#8b949e", borderRadius: 20, padding: "3px 10px", fontSize: 11 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #21262d", padding: "0 32px", display: "flex", gap: 2, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: "none", border: "none", borderBottom: activeTab === t.id ? "2px solid #25d366" : "2px solid transparent", color: activeTab === t.id ? "#e6edf3" : "#6e7681", padding: "12px 16px", cursor: "pointer", fontSize: 13, fontWeight: activeTab === t.id ? 700 : 400, fontFamily: "inherit", whiteSpace: "nowrap", transition: "color .2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>
        {activeTab === "preview" && (
          <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 28, alignItems: "start" }}>
            {/* Chat Widget */}
            <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,.5)", border: "1px solid #30363d", height: 580, display: "flex", flexDirection: "column", animation: "fadeIn .5s ease" }}>
              <ChatWidget />
            </div>
            {/* Info */}
            <div style={{ animation: "fadeIn .5s ease .1s both" }}>
              <h2 style={{ color: "#e6edf3", margin: "0 0 8px", fontSize: 22 }}>Chat Widget Preview</h2>
              <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 24px", lineHeight: 1.7 }}>
                This widget simulates your WhatsApp Business API integration. In production, messages route through Twilio → your Express webhook → member database → back to the user on WhatsApp.
              </p>
              <ArchDiagram />
              <div style={{ background: "#161b22", borderRadius: 10, padding: 16, border: "1px solid #30363d" }}>
                <div style={{ color: "#f0883e", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>⚡ Key Capabilities</div>
                {[
                  ["Real-time bidirectional messaging", "Webhook listens for incoming WhatsApp messages and replies instantly"],
                  ["Member data personalization", "Query your DB by phone number for personalized greetings & info"],
                  ["Quick reply buttons", "Send interactive buttons via WhatsApp Business template messages"],
                  ["Outbound notifications", "Trigger messages from your app (e.g. renewal reminders, alerts)"],
                  ["Multi-agent handoff", "Route complex issues to a human agent seamlessly"],
                ].map(([title, desc]) => (
                  <div key={title} style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                    <div style={{ color: "#25d366", fontSize: 16, flexShrink: 0 }}>✓</div>
                    <div>
                      <div style={{ color: "#e6edf3", fontSize: 13, fontWeight: 600 }}>{title}</div>
                      <div style={{ color: "#6e7681", fontSize: 12 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === "server" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{ color: "#e6edf3", margin: "0 0 6px" }}>Webhook Server</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px" }}>Express.js server that Twilio calls when a user sends a WhatsApp message. Add your business logic here.</p>
            <CodeBlock code={CODE_SNIPPETS.server} label="server.js" />
          </div>
        )}
        {activeTab === "outbound" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{ color: "#e6edf3", margin: "0 0 6px" }}>Send Outbound Messages</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px" }}>Trigger WhatsApp messages from your app — great for notifications, reminders, and alerts.</p>
            <CodeBlock code={CODE_SNIPPETS.outbound} label="sendMessage.js" />
          </div>
        )}
        {activeTab === "frontend" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{ color: "#e6edf3", margin: "0 0 6px" }}>React Integration Hook</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px" }}>A reusable React hook to send WhatsApp messages from your frontend via your backend API.</p>
            <CodeBlock code={CODE_SNIPPETS.frontend} label="useWhatsApp.js" />
          </div>
        )}
        {activeTab === "env" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{ color: "#e6edf3", margin: "0 0 6px" }}>Environment Variables</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px" }}>Configure these in your <code style={{ background: "#21262d", padding: "1px 5px", borderRadius: 4, fontSize: 13 }}>.env</code> file. Never commit secrets to version control.</p>
            <CodeBlock code={CODE_SNIPPETS.env} label=".env" />
            <div style={{ background: "#161b22", border: "1px solid #f0883e40", borderRadius: 10, padding: 14 }}>
              <div style={{ color: "#f0883e", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠️ Security Reminders</div>
              <ul style={{ color: "#8b949e", fontSize: 13, margin: 0, paddingLeft: 18, lineHeight: 2 }}>
                <li>Add <code style={{ background: "#21262d", padding: "1px 4px", borderRadius: 3 }}>.env</code> to your <code style={{ background: "#21262d", padding: "1px 4px", borderRadius: 3 }}>.gitignore</code></li>
                <li>Validate Twilio webhook signatures using <code style={{ background: "#21262d", padding: "1px 4px", borderRadius: 3 }}>twilio.validateRequest()</code></li>
                <li>Use HTTPS for all production webhook endpoints</li>
                <li>Rotate tokens immediately if ever exposed</li>
              </ul>
            </div>
          </div>
        )}
        {activeTab === "setup" && (
          <div style={{ animation: "fadeIn .4s ease" }}>
            <h2 style={{ color: "#e6edf3", margin: "0 0 6px" }}>Setup Guide</h2>
            <p style={{ color: "#8b949e", fontSize: 14, margin: "0 0 20px" }}>Follow these steps to go from zero to a live WhatsApp integration. Click each step to mark it complete.</p>
            <Checklist />
          </div>
        )}
      </div>
    </div>
  );
}

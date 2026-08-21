import React, { useState, useEffect, useCallback, useRef } from "react";
import { storage } from "./storage";
import {
  Sparkles, BookOpen, Wrench, Rocket, Star, User, LayoutDashboard,
  ShieldCheck, X, Menu, Check, ChevronRight, ChevronLeft, Play, MessageSquare,
  Bell, CreditCard, LogOut, Loader2, ArrowRight, TrendingUp, Users, DollarSign,
  Plus, Trash2, Edit3, Video, FileText, Image as ImageIcon, Megaphone,
  Zap, Award, Clock, BarChart3, Settings, Heart, Send
} from "lucide-react";

/* ============================================================
   GLOBAL STYLE
   ============================================================ */
const GlobalStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

    .cai * { box-sizing: border-box; }
    .cai {
      --bg: #08080C;
      --bg-elev: #111117;
      --bg-card: #15151D;
      --bg-card-hover: #1B1B25;
      --border: rgba(255,255,255,0.08);
      --border-strong: rgba(255,255,255,0.18);
      --text: #F5F5F8;
      --text-dim: rgba(245,245,248,0.62);
      --text-faint: rgba(245,245,248,0.36);
      --violet: #7C5CFC;
      --blue: #4C7BFF;
      --green: #34D399;
      --amber: #FBBF24;
      --grad: linear-gradient(135deg, #7C5CFC, #4C7BFF);
      font-family: 'Inter', sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    .cai h1, .cai h2, .cai h3, .cai .display { font-family: 'Space Grotesk', sans-serif; }
    .cai .mono { font-family: 'JetBrains Mono', monospace; }
    .cai ::selection { background: var(--violet); color: #fff; }
    .cai a { color: inherit; text-decoration: none; }
    .cai button { font-family: inherit; cursor: pointer; }
    .cai input, .cai select, .cai textarea { font-family: inherit; }

    .cai-shell { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
    @media (max-width: 640px) { .cai-shell { padding: 0 16px; } }

    /* Nav */
    .cai-nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(8,8,12,0.85); backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border);
    }
    .cai-nav-inner { display:flex; align-items:center; justify-content:space-between; height: 68px; }
    .cai-logo { display:flex; align-items:center; gap:9px; font-weight:700; font-size:16.5px; }
    .cai-logo-mark {
      width:30px; height:30px; border-radius:9px; background: var(--grad);
      display:flex; align-items:center; justify-content:center; flex-shrink:0;
    }
    .cai-nav-links { display:flex; align-items:center; gap:4px; }
    @media (max-width: 800px) { .cai-nav-links { display:none; } }
    .cai-mobile-tabs { display:none; }
    @media (max-width: 800px) {
      .cai-mobile-tabs { display:flex; gap:6px; padding:10px 16px; overflow-x:auto; border-bottom:1px solid var(--border); }
    }
    .cai-nav-link {
      font-size:14px; font-weight:500; color: var(--text-dim);
      padding:9px 14px; border-radius:9px; transition: all .15s ease;
      display:flex; align-items:center; gap:6px; background:none; border:none;
    }
    .cai-nav-link:hover { color: var(--text); background: rgba(255,255,255,0.05); }
    .cai-nav-link.active { color: var(--text); background: rgba(124,92,252,0.14); }
    .cai-nav-right { display:flex; align-items:center; gap:10px; }
    .cai-icon-btn {
      width:38px; height:38px; border-radius:10px; border:1px solid var(--border);
      background: var(--bg-card); display:flex; align-items:center; justify-content:center;
      color: var(--text-dim); position:relative; transition: all .15s ease;
    }
    .cai-icon-btn:hover { border-color: var(--border-strong); color: var(--text); }
    .cai-badge-dot {
      position:absolute; top:-3px; right:-3px; width:9px; height:9px; border-radius:50%;
      background: var(--violet); border:2px solid var(--bg);
    }

    /* Buttons */
    .cai-btn {
      font-weight:600; font-size:14.5px; padding:12px 22px; border-radius:11px;
      border:none; display:inline-flex; align-items:center; gap:8px; transition: all .18s ease;
    }
    .cai-btn-primary { background: var(--grad); color:#fff; }
    .cai-btn-primary:hover { filter:brightness(1.1); transform: translateY(-1px); box-shadow: 0 10px 24px -10px rgba(124,92,252,0.5); }
    .cai-btn-ghost { background: var(--bg-card); color: var(--text); border:1px solid var(--border); }
    .cai-btn-ghost:hover { border-color: var(--border-strong); background: var(--bg-card-hover); }
    .cai-btn-sm { padding:8px 14px; font-size:13px; border-radius:8px; }
    .cai-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none !important; }
    .cai-btn-block { width:100%; justify-content:center; }

    /* Cards */
    .cai-card {
      background: var(--bg-card); border:1px solid var(--border); border-radius:16px;
      transition: border-color .18s ease, transform .18s ease;
    }
    .cai-card.hoverable:hover { border-color: var(--border-strong); transform: translateY(-2px); }

    /* Hero */
    .cai-hero { padding: 76px 0 60px; position:relative; overflow:hidden; }
    .cai-hero-glow {
      position:absolute; top:-200px; left:50%; transform:translateX(-50%);
      width:900px; height:500px; border-radius:50%;
      background: radial-gradient(circle, rgba(124,92,252,0.22), transparent 65%);
      pointer-events:none;
    }
    .cai-eyebrow {
      display:inline-flex; align-items:center; gap:8px; font-size:12.5px; font-weight:600;
      color: var(--violet); background: rgba(124,92,252,0.12); border:1px solid rgba(124,92,252,0.25);
      padding:7px 14px; border-radius:99px; margin-bottom:24px;
    }
    .cai-hero h1 { font-size: clamp(38px, 5.6vw, 64px); line-height:1.04; font-weight:700; margin-bottom:20px; }
    .cai-hero h1 .grad-text {
      background: var(--grad); -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .cai-hero p.sub { font-size:18px; color: var(--text-dim); max-width:560px; margin-bottom:34px; line-height:1.55; }
    .cai-hero-actions { display:flex; gap:14px; flex-wrap:wrap; }
    .cai-hero-grid { display:grid; grid-template-columns:1.1fr 0.9fr; gap:48px; align-items:center; position:relative; }
    @media (max-width: 860px) { .cai-hero-grid { grid-template-columns:1fr; gap:40px; } }
    .cai-detail-grid { display:grid; grid-template-columns:1fr 340px; gap:40px; }
    @media (max-width: 860px) { .cai-detail-grid { grid-template-columns:1fr; } }
    .cai-tool-inner-grid { display:grid; grid-template-columns:220px 1fr; gap:32px; }
    @media (max-width: 800px) { .cai-tool-inner-grid { grid-template-columns:1fr; } }

    /* Section */
    .cai-section { padding: 76px 0; }
    .cai-section-head { max-width:600px; margin-bottom:44px; }
    .cai-section-eyebrow { font-size:12.5px; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; color: var(--blue); margin-bottom:12px; }
    .cai-section h2 { font-size: clamp(26px, 3.4vw, 38px); font-weight:700; margin-bottom:12px; }
    .cai-section p.desc { color: var(--text-dim); font-size:15.5px; line-height:1.6; }

    .cai-grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .cai-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:18px; }
    @media (max-width:900px) { .cai-grid-3, .cai-grid-4 { grid-template-columns:repeat(2,1fr); } }
    @media (max-width:640px) { .cai-grid-3, .cai-grid-4 { grid-template-columns:1fr; } }

    /* Solution cards */
    .cai-solution-card { padding:28px; }
    .cai-solution-icon {
      width:46px; height:46px; border-radius:12px; background: rgba(124,92,252,0.12);
      display:flex; align-items:center; justify-content:center; color: var(--violet); margin-bottom:18px;
    }
    .cai-solution-card h3 { font-size:18px; font-weight:700; margin-bottom:8px; }
    .cai-solution-card p { color: var(--text-dim); font-size:14px; line-height:1.55; margin-bottom:16px; }

    /* Live AI preview (signature element) */
    .cai-live-card {
      background: var(--bg-elev); border:1px solid var(--border); border-radius:18px;
      padding:22px; position:relative; overflow:hidden;
    }
    .cai-live-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
    .cai-live-dot { width:8px; height:8px; border-radius:50%; background: var(--green); animation: pulse-dot 1.6s infinite; }
    @keyframes pulse-dot { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
    .cai-live-label { font-size:12px; color: var(--text-faint); font-family:'JetBrains Mono', monospace; }
    .cai-live-field { margin-bottom:14px; }
    .cai-live-field-label { font-size:11px; color: var(--text-faint); font-family:'JetBrains Mono', monospace; text-transform:uppercase; margin-bottom:6px; }
    .cai-live-field-value { font-size:14.5px; color: var(--text); min-height:20px; line-height:1.5; }
    .cai-live-field-value .cursor { display:inline-block; width:2px; height:14px; background: var(--violet); margin-left:2px; animation: blink .9s step-end infinite; vertical-align:middle; }
    @keyframes blink { 50% { opacity:0; } }

    /* Formation / service cards */
    .cai-thumb {
      height:140px; border-radius:12px; margin-bottom:16px; position:relative; overflow:hidden;
      display:flex; align-items:center; justify-content:center;
    }
    .cai-thumb-icon { color: rgba(255,255,255,0.9); opacity:0.85; }
    .cai-thumb::after { content:''; position:absolute; inset:0; background: linear-gradient(160deg, rgba(255,255,255,0.08), transparent); }
    .cai-pill { font-size:11px; font-weight:600; padding:4px 10px; border-radius:99px; background: rgba(255,255,255,0.1); color: var(--text-dim); }
    .cai-meta-row { display:flex; align-items:center; gap:14px; font-size:12.5px; color: var(--text-faint); margin:12px 0; }
    .cai-meta-row span { display:flex; align-items:center; gap:5px; }
    .cai-price { font-size:20px; font-weight:700; font-family:'Space Grotesk',sans-serif; }
    .cai-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:16px; padding-top:16px; border-top:1px solid var(--border); }

    .cai-stars { display:flex; gap:2px; color: var(--amber); }

    /* Tabs */
    .cai-tabs { display:flex; gap:8px; margin-bottom:32px; flex-wrap:wrap; }
    .cai-tab {
      padding:10px 18px; border-radius:99px; font-size:13.5px; font-weight:600;
      background: var(--bg-card); border:1px solid var(--border); color: var(--text-dim);
    }
    .cai-tab.active { background: var(--grad); color:#fff; border-color:transparent; }

    /* AI tool panel */
    .cai-tool-grid { display:grid; grid-template-columns: 380px 1fr; gap:28px; }
    @media (max-width:900px) { .cai-tool-grid { grid-template-columns:1fr; } }
    .cai-field { margin-bottom:16px; }
    .cai-field label { display:block; font-size:13px; font-weight:600; margin-bottom:7px; color: var(--text-dim); }
    .cai-input, .cai-select, .cai-textarea {
      width:100%; background: var(--bg-elev); border:1px solid var(--border); border-radius:10px;
      padding:11px 13px; color: var(--text); font-size:14px; outline:none; transition: border-color .15s ease;
    }
    .cai-input:focus, .cai-select:focus, .cai-textarea:focus { border-color: var(--violet); }
    .cai-textarea { resize:vertical; min-height:80px; }
    .cai-result-panel { background: var(--bg-elev); border:1px solid var(--border); border-radius:16px; padding:28px; min-height:420px; }
    .cai-result-block { margin-bottom:22px; }
    .cai-result-block-label {
      font-family:'JetBrains Mono',monospace; font-size:11px; color: var(--violet); text-transform:uppercase;
      letter-spacing:0.06em; margin-bottom:8px; display:flex; align-items:center; gap:8px;
    }
    .cai-result-block-body { font-size:14.5px; line-height:1.65; color: var(--text); white-space:pre-wrap; }
    .cai-hashtag-list { display:flex; flex-wrap:wrap; gap:8px; }
    .cai-hashtag { background: rgba(76,123,255,0.14); color: var(--blue); padding:5px 12px; border-radius:99px; font-size:13px; font-family:'JetBrains Mono',monospace; }
    .cai-empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; min-height:380px; text-align:center; color: var(--text-faint); }

    /* Dashboard */
    .cai-dash-grid { display:grid; grid-template-columns: 220px 1fr; gap:32px; }
    @media (max-width:800px) { .cai-dash-grid { grid-template-columns:1fr; } }
    .cai-dash-nav button {
      display:flex; align-items:center; gap:10px; width:100%; text-align:left; padding:10px 14px;
      border-radius:10px; background:none; border:none; color: var(--text-dim); font-size:14px; font-weight:500;
      margin-bottom:4px;
    }
    .cai-dash-nav button.active { background: rgba(124,92,252,0.12); color: var(--text); }
    .cai-dash-nav button:hover:not(.active) { background: rgba(255,255,255,0.04); }
    .cai-progress-track { height:7px; background: var(--bg-elev); border-radius:99px; overflow:hidden; margin-top:8px; }
    .cai-progress-fill { height:100%; background: var(--grad); border-radius:99px; transition: width .4s ease; }

    .cai-stat-card { padding:22px; }
    .cai-stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
    .cai-stat-value { font-family:'Space Grotesk',sans-serif; font-size:28px; font-weight:700; }
    .cai-stat-label { font-size:13px; color: var(--text-faint); margin-top:4px; }

    /* Modal */
    .cai-modal-backdrop {
      position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter: blur(4px);
      display:flex; align-items:center; justify-content:center; z-index:200; padding:20px;
    }
    .cai-modal {
      background: var(--bg-card); border:1px solid var(--border-strong); border-radius:18px;
      padding:32px; max-width:420px; width:100%; position:relative;
    }
    .cai-modal-close { position:absolute; top:18px; right:18px; color: var(--text-faint); background:none; border:none; }

    /* Toast */
    .cai-toast-wrap { position:fixed; bottom:24px; right:24px; z-index:300; display:flex; flex-direction:column; gap:10px; }
    .cai-toast {
      background: var(--bg-card); border:1px solid var(--border-strong); border-radius:12px; padding:14px 18px;
      display:flex; align-items:center; gap:10px; font-size:13.5px; box-shadow:0 20px 40px -10px rgba(0,0,0,0.5);
      animation: toast-in .25s ease;
    }
    @keyframes toast-in { from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:translateY(0);} }

    .cai-footer { border-top:1px solid var(--border); padding:48px 0 28px; margin-top:40px; }
    .cai-footer-inner { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; font-size:12.5px; color: var(--text-faint); }
    .cai-footer-top { display:grid; grid-template-columns:1.4fr 1fr 1fr; gap:32px; margin-bottom:36px; }
    @media (max-width:700px) { .cai-footer-top { grid-template-columns:1fr; gap:28px; } }
    .cai-footer-col h4 { font-size:12.5px; text-transform:uppercase; letter-spacing:0.05em; color: var(--text-faint); margin-bottom:14px; }
    .cai-footer-col a, .cai-footer-col button { display:block; background:none; border:none; text-align:left; color: var(--text-dim); font-size:13.5px; padding:5px 0; }
    .cai-footer-col a:hover, .cai-footer-col button:hover { color: var(--text); }
    .cai-footer-legal-note { font-size:11.5px; color: var(--text-faint); line-height:1.6; max-width:520px; }

    .cai-legal-page { max-width:760px; }
    .cai-legal-page h1 { font-size:28px; font-weight:700; margin-bottom:8px; }
    .cai-legal-page .updated { font-size:12.5px; color: var(--text-faint); margin-bottom:32px; }
    .cai-legal-page h2 { font-size:17px; font-weight:700; margin:28px 0 10px; }
    .cai-legal-page p, .cai-legal-page li { font-size:14.5px; line-height:1.7; color: var(--text-dim); }
    .cai-legal-page ul { padding-left:20px; margin:8px 0; }
    .cai-legal-disclaimer { background: rgba(251,191,36,0.1); border:1px solid rgba(251,191,36,0.3); border-radius:10px; padding:16px 18px; font-size:13px; color: var(--amber); margin-bottom:28px; line-height:1.55; }

    .cai-cookie-banner {
      position:fixed; bottom:0; left:0; right:0; z-index:250;
      background: var(--bg-card); border-top:1px solid var(--border-strong);
      padding:16px 24px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;
    }
    .cai-cookie-banner p { font-size:13px; color: var(--text-dim); max-width:640px; }

    .cai-chat-bubble {
      position:fixed; bottom:24px; right:24px; z-index:180;
      width:56px; height:56px; border-radius:50%; background: var(--grad);
      display:flex; align-items:center; justify-content:center; border:none; color:#fff;
      box-shadow:0 12px 28px -8px rgba(124,92,252,0.55); cursor:pointer;
    }
    .cai-chat-window {
      position:fixed; bottom:92px; right:24px; z-index:180;
      width:360px; max-width:calc(100vw - 32px); height:480px; max-height:70vh;
      background: var(--bg-card); border:1px solid var(--border-strong); border-radius:18px;
      display:flex; flex-direction:column; overflow:hidden; box-shadow:0 30px 60px -15px rgba(0,0,0,0.6);
    }
    .cai-chat-head { padding:16px 18px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
    .cai-chat-body { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:10px; }
    .cai-chat-msg { max-width:80%; padding:10px 13px; border-radius:12px; font-size:13.5px; line-height:1.45; }
    .cai-chat-msg.user { align-self:flex-end; background: var(--grad); color:#fff; border-bottom-right-radius:4px; }
    .cai-chat-msg.ai, .cai-chat-msg.admin { align-self:flex-start; background: var(--bg-elev); border:1px solid var(--border); border-bottom-left-radius:4px; }
    .cai-chat-msg.admin { border-color: var(--violet); }
    .cai-chat-msg-tag { font-size:10px; text-transform:uppercase; color: var(--text-faint); margin-bottom:3px; }
    .cai-chat-input-row { padding:12px; border-top:1px solid var(--border); display:flex; gap:8px; }
    .cai-chat-input-row input { flex:1; }

    .cai-badge-level { font-size:11px; font-weight:600; padding:4px 9px; border-radius:6px; }
    .cai-empty-row { text-align:center; padding:60px 20px; color: var(--text-faint); }
  `}</style>
);

/* ============================================================
   STORAGE HELPERS (acts as the app's "database" for this prototype)
   ============================================================ */
async function storeGet(key, shared = false, fallback = null) {
  try {
    const r = await storage.get(key, shared);
    return r ? JSON.parse(r.value) : fallback;
  } catch {
    return fallback;
  }
}
async function storeSet(key, value, shared = false) {
  try {
    await storage.set(key, JSON.stringify(value), shared);
    return true;
  } catch {
    return false;
  }
}

/* ============================================================
   SEED DATA
   ============================================================ */
const SEED_FORMATIONS = [
  { id: "f1", title: "Maîtriser l'IA", desc: "Apprendre à utiliser ChatGPT et les outils IA pour créer et développer une activité.", level: "Débutant", duration: "4h30", modules: 8, price: 79, icon: "Sparkles", color: "#7C5CFC", rating: 4.7, reviews: 128 },
  { id: "f2", title: "Créer du contenu avec l'IA", desc: "Apprendre à créer des vidéos, scripts, visuels et publications avec l'IA.", level: "Débutant", duration: "5h15", modules: 10, price: 99, icon: "Video", color: "#4C7BFF", rating: 4.8, reviews: 203 },
  { id: "f3", title: "Lancer son produit digital", desc: "Apprendre à créer, vendre et promouvoir un produit numérique.", level: "Intermédiaire", duration: "6h00", modules: 12, price: 129, icon: "Rocket", color: "#34D399", rating: 4.6, reviews: 94 },
  { id: "f4", title: "Développer son TikTok", desc: "Apprendre à créer une stratégie de contenu et développer son audience.", level: "Débutant", duration: "3h45", modules: 7, price: 69, icon: "TrendingUp", color: "#FBBF24", rating: 4.9, reviews: 311 },
];

const SEED_SERVICES = [
  { id: "s1", title: "Création de contenu TikTok", category: "Création de contenu", desc: "10 vidéos courtes prêtes à publier, scriptées et montées.", provider: "Studio Nova", rating: 4.8, reviews: 56, prices: { Basic: 149, Standard: 299, Premium: 549 } },
  { id: "s2", title: "Montage vidéo professionnel", category: "Montage vidéo", desc: "Montage dynamique avec sous-titres, transitions et habillage.", provider: "CutLab", rating: 4.7, reviews: 88, prices: { Basic: 39, Standard: 89, Premium: 179 } },
  { id: "s3", title: "Création de logo", category: "Création de logo", desc: "Identité visuelle complète avec déclinaisons et charte.", provider: "Formae Studio", rating: 4.9, reviews: 142, prices: { Basic: 59, Standard: 129, Premium: 249 } },
  { id: "s4", title: "Site internet sur-mesure", category: "Création de site internet", desc: "Site vitrine ou boutique, responsive, livré clé en main.", provider: "Webforge", rating: 4.6, reviews: 61, prices: { Basic: 399, Standard: 799, Premium: 1499 } },
  { id: "s5", title: "Stratégie marketing digital", category: "Marketing", desc: "Audit, plan d'action et calendrier de contenu sur-mesure.", provider: "Growth Room", rating: 4.7, reviews: 47, prices: { Basic: 199, Standard: 449, Premium: 899 } },
  { id: "s6", title: "Automatisation de workflows", category: "Automatisation", desc: "Automatise tes tâches répétitives avec des workflows sur-mesure.", provider: "FlowOps", rating: 4.8, reviews: 33, prices: { Basic: 149, Standard: 349, Premium: 699 } },
];

const ICONS = { Sparkles, Video, Rocket, TrendingUp, Megaphone, Wrench };

/* ============================================================
   AI CALL HELPER
   ============================================================ */
async function callClaudeJSON(promptText, onCreditsUpdate) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ prompt: promptText }),
  });
  const data = await res.json();
  if (res.status === 402) {
    if (onCreditsUpdate) onCreditsUpdate(0);
    throw new Error("insufficient_credits");
  }
  if (!res.ok) throw new Error(data.error || `AI request failed (${res.status})`);
  if (onCreditsUpdate && typeof data.credits === "number") onCreditsUpdate(data.credits);

  const text = data.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(clean);
  } catch {
    return { _raw: text };
  }
}

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, icon) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, icon }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);
  return { toasts, push };
}

/* ============================================================
   NAV
   ============================================================ */
function NotificationsPanel({ open, notifications, onClose }) {
  if (!open) return null;
  return (
    <div className="cai-card" style={{ position: "absolute", top: 54, right: 0, width: 320, maxHeight: 400, overflowY: "auto", zIndex: 150, padding: 8 }}>
      {notifications.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "var(--text-faint)", fontSize: 13.5 }}>Aucune notification pour l'instant.</div>
      ) : (
        notifications.map((n) => (
          <div key={n.id} style={{ padding: "12px 12px", borderBottom: "1px solid var(--border)", display: "flex", gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : "var(--violet)", marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13.5, lineHeight: 1.45 }}>{n.message}</div>
              <div style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 3 }}>{new Date(n.date).toLocaleString("fr-FR")}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Nav({ page, setPage, session, setShowAuth, notifications, notifOpen, setNotifOpen, onOpenNotifs, onLogout }) {
  const links = [
    { id: "home", label: "Accueil" },
    { id: "formations", label: "Formations" },
    { id: "services", label: "Services" },
    { id: "ai-tools", label: "AI Tools" },
    ...(session?.isAdmin ? [{ id: "admin", label: "Admin" }] : []),
  ];
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <nav className="cai-nav">
      <div className="cai-shell cai-nav-inner">
        <button className="cai-logo" onClick={() => setPage("home")} style={{ background: "none", border: "none" }}>
          <span className="cai-logo-mark"><Sparkles size={16} color="#fff" /></span>
          Creator AI
        </button>
        <div className="cai-nav-links">
          {links.map((l) => (
            <button key={l.id} className={`cai-nav-link ${page === l.id ? "active" : ""}`} onClick={() => setPage(l.id)}>
              {l.label}
            </button>
          ))}
        </div>
        <div className="cai-nav-right">
          {session && (
            <div style={{ position: "relative" }}>
              <button className="cai-icon-btn" onClick={onOpenNotifs} title="Notifications">
                <Bell size={16} />
                {unread > 0 && <span className="cai-badge-dot" />}
              </button>
              <NotificationsPanel open={notifOpen} notifications={notifications} onClose={() => setNotifOpen(false)} />
            </div>
          )}
          {session ? (
            <>
              <div className="mono" style={{ fontSize: 12.5, color: "var(--violet)", display: "flex", alignItems: "center", gap: 5 }}>
                <Zap size={13} /> {session.credits}
              </div>
              <button className="cai-btn cai-btn-ghost cai-btn-sm" onClick={() => setPage("dashboard")}>
                <User size={14} /> {session.firstName}
              </button>
              <button className="cai-icon-btn" onClick={onLogout} title="Déconnexion"><LogOut size={15} /></button>
            </>
          ) : (
            <button className="cai-btn cai-btn-primary cai-btn-sm" onClick={() => setShowAuth(true)}>
              Connexion
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ============================================================
   AUTH MODAL — real accounts: email/password (hashed server-side)
   or Google Sign-In. Session persists via httpOnly cookie.
   ============================================================ */
function GoogleButton({ onCredential }) {
  const ref = useRef(null);
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !window.google || !ref.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp) => onCredential(resp.credential),
    });
    window.google.accounts.id.renderButton(ref.current, {
      theme: "filled_black", size: "large", width: 340, text: "continue_with", shape: "pill",
    });
  }, [onCredential]);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) return null;
  return <div ref={ref} style={{ display: "flex", justifyContent: "center", marginBottom: 18 }} />;
}

function AuthModal({ onClose, onAuth, push }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ firstName: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password || (mode === "signup" && !form.firstName)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode === "login" ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        push(data.error || "Une erreur est survenue.");
        setBusy(false);
        return;
      }
      onAuth(data);
      push(mode === "login" ? `Bon retour, ${data.firstName}` : `Bienvenue ${data.firstName} — compte créé`, <Check size={15} color="#34D399" />);
      onClose();
    } catch {
      push("Connexion au serveur impossible. Réessaie.");
    }
    setBusy(false);
  };

  const handleGoogleCredential = useCallback(async (credential) => {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) { push(data.error || "Connexion Google impossible."); setBusy(false); return; }
      onAuth(data);
      push(`Bienvenue ${data.firstName}`, <Check size={15} color="#34D399" />);
      onClose();
    } catch {
      push("Connexion Google impossible.");
    }
    setBusy(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="cai-modal-backdrop" onClick={onClose}>
      <div className="cai-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cai-modal-close" onClick={onClose}><X size={18} /></button>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 22 }}>
          {mode === "login" ? "Reconnecte-toi — ta session reste active à ta prochaine visite." : "10 crédits IA offerts à la création du compte."}
        </p>

        <GoogleButton onCredential={handleGoogleCredential} />
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "0 0 18px" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 11.5, color: "var(--text-faint)" }}>ou avec un email</span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        {mode === "signup" && (
          <div className="cai-field">
            <label>Prénom</label>
            <input className="cai-input" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Alex" />
          </div>
        )}
        <div className="cai-field">
          <label>Email</label>
          <input className="cai-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="toi@exemple.com" />
        </div>
        <div className="cai-field">
          <label>Mot de passe</label>
          <input className="cai-input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>
        <button className="cai-btn cai-btn-primary cai-btn-block" onClick={submit} disabled={busy} style={{ marginTop: 8 }}>
          {busy ? <Loader2 size={15} className="spin" /> : mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-faint)", marginTop: 16 }}>
          {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
          <button style={{ background: "none", border: "none", color: "var(--violet)", fontWeight: 600 }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function LiveAIPreview() {
  const demos = [
    { platform: "TikTok", niche: "Fitness", hook: "J'ai testé 5h de sport par semaine pendant 30 jours…" },
    { platform: "Instagram", niche: "Cuisine", hook: "Personne ne fait ce plat comme ça, et voici pourquoi." },
    { platform: "YouTube", niche: "Business en ligne", hook: "J'ai gagné 0€ pendant 6 mois, puis ça a changé." },
  ];
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let i = 0;
    setText("");
    setPhase("typing");
    const target = demos[idx].hook;
    const interval = setInterval(() => {
      i++;
      setText(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(interval);
        setTimeout(() => setIdx((v) => (v + 1) % demos.length), 1800);
      }
    }, 32);
    return () => clearInterval(interval);
  }, [idx]);

  return (
    <div className="cai-live-card">
      <div className="cai-live-head">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="cai-live-dot" />
          <span className="cai-live-label">AI CONTENT CREATOR — live</span>
        </div>
        <Sparkles size={15} color="var(--violet)" />
      </div>
      <div className="cai-live-field">
        <div className="cai-live-field-label">Plateforme</div>
        <div className="cai-live-field-value">{demos[idx].platform}</div>
      </div>
      <div className="cai-live-field">
        <div className="cai-live-field-label">Niche</div>
        <div className="cai-live-field-value">{demos[idx].niche}</div>
      </div>
      <div className="cai-live-field">
        <div className="cai-live-field-label">Hook généré</div>
        <div className="cai-live-field-value">{text}<span className="cursor" /></div>
      </div>
    </div>
  );
}

function Home({ setPage }) {
  const solutions = [
    { icon: <BookOpen size={22} />, title: "Formations", desc: "Des parcours pratiques pour maîtriser l'IA et développer ton activité, module par module.", cta: "Voir les formations", page: "formations" },
    { icon: <Wrench size={22} />, title: "Services", desc: "Fais appel à des prestataires vérifiés pour ton contenu, ton branding ou ton site.", cta: "Voir les services", page: "services" },
    { icon: <Sparkles size={22} />, title: "Outils IA", desc: "Génère scripts, hooks, visuels et publicités en quelques secondes.", cta: "Essayer les outils", page: "ai-tools" },
  ];
  const why = [
    { icon: <Zap size={18} />, text: "Simple à utiliser" },
    { icon: <Users size={18} />, text: "Accessible aux débutants" },
    { icon: <Sparkles size={18} />, text: "Outils IA intégrés" },
    { icon: <BookOpen size={18} />, text: "Formations pratiques" },
    { icon: <Award size={18} />, text: "Services professionnels" },
  ];
  return (
    <>
      <header className="cai-hero">
        <div className="cai-hero-glow" />
        <div className="cai-shell cai-hero-grid">
          <div>
            <div className="cai-eyebrow"><Sparkles size={13} /> Plateforme tout-en-un</div>
            <h1>Crée. Apprends.<br /><span className="grad-text">Développe ton activité</span><br />avec l'IA.</h1>
            <p className="sub">Formations, services professionnels et outils IA réunis au même endroit pour créer du contenu et lancer ton activité, sans repartir de zéro à chaque étape.</p>
            <div className="cai-hero-actions">
              <button className="cai-btn cai-btn-primary" onClick={() => setPage("formations")}>Découvrir les formations <ArrowRight size={15} /></button>
              <button className="cai-btn cai-btn-ghost" onClick={() => setPage("services")}>Découvrir les services</button>
              <button className="cai-btn cai-btn-ghost" onClick={() => setPage("ai-tools")}>Essayer les outils IA</button>
            </div>
          </div>
          <LiveAIPreview />
        </div>
      </header>

      <section className="cai-section">
        <div className="cai-shell">
          <div className="cai-section-head">
            <div className="cai-section-eyebrow">Nos solutions</div>
            <h2>Tout ce qu'il faut pour avancer</h2>
          </div>
          <div className="cai-grid-3">
            {solutions.map((s) => (
              <div key={s.title} className="cai-card hoverable cai-solution-card" onClick={() => setPage(s.page)} style={{ cursor: "pointer" }}>
                <div className="cai-solution-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span style={{ color: "var(--violet)", fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>{s.cta} <ChevronRight size={14} /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cai-section" style={{ paddingTop: 0 }}>
        <div className="cai-shell">
          <div className="cai-section-head">
            <div className="cai-section-eyebrow">Pourquoi Creator AI ?</div>
            <h2>Pensé pour aller vite</h2>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {why.map((w) => (
              <div key={w.text} className="cai-card" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px" }}>
                <span style={{ color: "var(--violet)" }}>{w.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{w.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ============================================================
   FORMATIONS
   ============================================================ */
function FormationCard({ f, owned, onOpen }) {
  const Icon = ICONS[f.icon] || Sparkles;
  const levelColor = f.level === "Débutant" ? "#34D399" : f.level === "Intermédiaire" ? "#FBBF24" : "#FF6B6B";
  return (
    <div className="cai-card hoverable" style={{ padding: 20, cursor: "pointer" }} onClick={() => onOpen(f)}>
      <div className="cai-thumb" style={{ background: `linear-gradient(135deg, ${f.color}33, ${f.color}11)` }}>
        <Icon size={34} className="cai-thumb-icon" style={{ color: f.color }} />
      </div>
      <span className="cai-badge-level" style={{ background: `${levelColor}22`, color: levelColor }}>{f.level}</span>
      <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: "12px 0 6px" }}>{f.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.5 }}>{f.desc}</p>
      <div className="cai-meta-row">
        <span><Clock size={13} /> {f.duration}</span>
        <span><BookOpen size={13} /> {f.modules} modules</span>
      </div>
      <div className="cai-card-footer">
        <span className="cai-price">{f.price} €</span>
        {owned ? (
          <span className="cai-btn cai-btn-ghost cai-btn-sm"><Check size={13} /> Acquise</span>
        ) : (
          <span className="cai-btn cai-btn-primary cai-btn-sm">Acheter</span>
        )}
      </div>
    </div>
  );
}

function FormationDetail({ f, owned, onBuy, onBack, reviews, onReview }) {
  const Icon = ICONS[f.icon] || Sparkles;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const avg = reviews.length ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : f.rating;
  return (
    <div className="cai-section">
      <div className="cai-shell">
        <button className="cai-btn cai-btn-ghost cai-btn-sm" onClick={onBack} style={{ marginBottom: 24 }}><ChevronLeft size={14} /> Retour</button>
        <div className="cai-detail-grid">
          <div>
            <div className="cai-thumb" style={{ height: 220, background: `linear-gradient(135deg, ${f.color}33, ${f.color}11)` }}>
              <Icon size={56} style={{ color: f.color }} />
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 700, margin: "24px 0 10px" }}>{f.title}</h1>
            <p style={{ color: "var(--text-dim)", fontSize: 15.5, lineHeight: 1.6, marginBottom: 18 }}>{f.desc}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 30 }}>
              <div className="cai-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill={i < Math.round(avg) ? "currentColor" : "none"} />)}</div>
              <span style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{avg} ({reviews.length + f.reviews} avis)</span>
            </div>

            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 14 }}>Avis</h3>
            {reviews.length === 0 && <p className="cai-empty-row" style={{ padding: "20px 0" }}>Aucun avis pour l'instant.</p>}
            {reviews.map((r, i) => (
              <div key={i} className="cai-card" style={{ padding: 16, marginBottom: 10 }}>
                <div className="cai-stars" style={{ marginBottom: 6 }}>{Array.from({ length: 5 }).map((_, j) => <Star key={j} size={12} fill={j < r.rating ? "currentColor" : "none"} />)}</div>
                <p style={{ fontSize: 13.5, color: "var(--text-dim)" }}>{r.comment}</p>
              </div>
            ))}
            {owned && (
              <div className="cai-card" style={{ padding: 18, marginTop: 14 }}>
                <label style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, display: "block" }}>Laisser un avis</label>
                <div className="cai-stars" style={{ marginBottom: 10, cursor: "pointer" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill={i < rating ? "currentColor" : "none"} onClick={() => setRating(i + 1)} />
                  ))}
                </div>
                <textarea className="cai-textarea" placeholder="Ton commentaire…" value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="cai-btn cai-btn-primary cai-btn-sm" style={{ marginTop: 10 }} onClick={() => { onReview(rating, comment); setComment(""); }}>Publier l'avis</button>
              </div>
            )}
          </div>
          <div>
            <div className="cai-card" style={{ padding: 24, position: "sticky", top: 90 }}>
              <div className="cai-price" style={{ fontSize: 30, marginBottom: 4 }}>{f.price} €</div>
              <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 20 }}>Paiement unique · accès à vie</p>
              {owned ? (
                <button className="cai-btn cai-btn-ghost cai-btn-block"><Check size={15} /> Formation acquise</button>
              ) : (
                <button className="cai-btn cai-btn-primary cai-btn-block" onClick={onBuy}><CreditCard size={15} /> Acheter</button>
              )}
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                {[`${f.modules} modules`, f.duration + " de contenu", "Accès mobile & ordinateur", "Mises à jour incluses"].map((t) => (
                  <div key={t} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--text-dim)" }}><Check size={14} color="var(--green)" /> {t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Formations({ formations, owned, onBuy, reviewsMap, onReview }) {
  const [selected, setSelected] = useState(null);
  const [level, setLevel] = useState("Tous");
  const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
  const filtered = level === "Tous" ? formations : formations.filter((f) => f.level === level);

  if (selected) {
    return (
      <FormationDetail
        f={selected}
        owned={owned.includes(selected.id)}
        onBuy={() => onBuy(selected)}
        onBack={() => setSelected(null)}
        reviews={reviewsMap[selected.id] || []}
        onReview={(rating, comment) => onReview(selected.id, rating, comment)}
      />
    );
  }

  return (
    <div className="cai-section">
      <div className="cai-shell">
        <div className="cai-section-head">
          <div className="cai-section-eyebrow">Marketplace</div>
          <h2>Formations</h2>
          <p className="desc">Des parcours pratiques, pensés pour être appliqués immédiatement.</p>
        </div>
        <div className="cai-tabs">
          {levels.map((l) => (
            <button key={l} className={`cai-tab ${level === l ? "active" : ""}`} onClick={() => setLevel(l)}>{l}</button>
          ))}
        </div>
        <div className="cai-grid-3">
          {filtered.map((f) => (
            <FormationCard key={f.id} f={f} owned={owned.includes(f.id)} onOpen={setSelected} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SERVICES
   ============================================================ */
function ServiceCard({ s, onOrder }) {
  const [formula, setFormula] = useState("Standard");
  return (
    <div className="cai-card" style={{ padding: 20 }}>
      <div className="cai-thumb" style={{ background: "linear-gradient(135deg, rgba(76,123,255,0.22), rgba(124,92,252,0.1))" }}>
        <Wrench size={30} style={{ color: "var(--blue)" }} />
      </div>
      <span className="cai-pill">{s.category}</span>
      <h3 style={{ fontSize: 16.5, fontWeight: 700, margin: "12px 0 6px" }}>{s.title}</h3>
      <p style={{ fontSize: 13.5, color: "var(--text-dim)", lineHeight: 1.5, marginBottom: 10 }}>{s.desc}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <div className="cai-stars">{Array.from({ length: 5 }).map((_, i) => <Star key={i} size={12} fill={i < Math.round(s.rating) ? "currentColor" : "none"} />)}</div>
        <span style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{s.rating} · {s.reviews} avis</span>
      </div>
      <p style={{ fontSize: 12.5, color: "var(--text-faint)", marginBottom: 14 }}>Par {s.provider}</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {Object.keys(s.prices).map((fk) => (
          <button key={fk} className={`cai-tab ${formula === fk ? "active" : ""}`} style={{ padding: "6px 10px", fontSize: 12 }} onClick={() => setFormula(fk)}>{fk}</button>
        ))}
      </div>
      <div className="cai-card-footer">
        <span className="cai-price">{s.prices[formula]} €</span>
        <button className="cai-btn cai-btn-primary cai-btn-sm" onClick={() => onOrder(s, formula)}>Commander</button>
      </div>
    </div>
  );
}

function Services({ services, onOrder }) {
  const categories = ["Tous", ...new Set(services.map((s) => s.category))];
  const [cat, setCat] = useState("Tous");
  const filtered = cat === "Tous" ? services : services.filter((s) => s.category === cat);
  return (
    <div className="cai-section">
      <div className="cai-shell">
        <div className="cai-section-head">
          <div className="cai-section-eyebrow">Marketplace</div>
          <h2>Services</h2>
          <p className="desc">Des prestataires pour ta création de contenu, ton branding ou ton site — choisis ta formule.</p>
        </div>
        <div className="cai-tabs">
          {categories.map((c) => (
            <button key={c} className={`cai-tab ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="cai-grid-3">
          {filtered.map((s) => <ServiceCard key={s.id} s={s} onOrder={onOrder} />)}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   AI TOOLS
   ============================================================ */
const TOOL_DEFS = {
  content: {
    label: "AI Content Creator", icon: <Video size={16} />,
    fields: [
      { key: "platform", label: "Plateforme", type: "select", options: ["TikTok", "YouTube", "Instagram"] },
      { key: "niche", label: "Niche", type: "text", placeholder: "ex: fitness, cuisine, business" },
      { key: "subject", label: "Sujet de la vidéo", type: "text", placeholder: "ex: 5 erreurs de débutant" },
      { key: "objective", label: "Objectif", type: "select", options: ["Engagement", "Abonnements", "Vente"] },
    ],
    build: (v) => `Tu es un assistant expert en création de contenu pour réseaux sociaux. Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte autour. Format exact: {"idee":"...", "hook":"...", "script":"...", "cta":"...", "description":"...", "hashtags":["...","..."]}. Plateforme: ${v.platform}. Niche: ${v.niche}. Sujet: ${v.subject}. Objectif: ${v.objective}. Contenu concret et immédiatement utilisable, en français.`,
    blocks: [["idee", "Idée de vidéo"], ["hook", "Hook"], ["script", "Script"], ["cta", "CTA"], ["description", "Description"]],
  },
  business: {
    label: "AI Business Generator", icon: <Rocket size={16} />,
    fields: [
      { key: "skills", label: "Tes compétences", type: "text", placeholder: "ex: montage vidéo, design" },
      { key: "budget", label: "Budget de départ", type: "select", options: ["0-100 €", "100-500 €", "500-2000 €", "2000 €+"] },
    ],
    build: (v) => `Réponds UNIQUEMENT avec un objet JSON valide, sans markdown. Format exact: {"idees_business":["...","..."], "produits_digitaux":["...","..."], "services":["...","..."], "strategie_lancement":"...", "prix_indicatif":"..."}. Compétences: ${v.skills}. Budget: ${v.budget}. En français, concret et réaliste.`,
    blocks: [["idees_business", "Idées de business"], ["produits_digitaux", "Produits digitaux"], ["services", "Services"], ["strategie_lancement", "Stratégie de lancement"], ["prix_indicatif", "Prix indicatif"]],
  },
  product: {
    label: "AI Product Generator", icon: <Sparkles size={16} />,
    fields: [{ key: "niche", label: "Niche", type: "text", placeholder: "ex: développement personnel" }],
    build: (v) => `Réponds UNIQUEMENT avec un objet JSON valide, sans markdown. Format exact: {"idee_produit":"...", "nom":"...", "description":"...", "contenu":"...", "prix":"...", "argumentaire":"..."}. Niche: ${v.niche}. En français.`,
    blocks: [["idee_produit", "Idée de produit"], ["nom", "Nom"], ["description", "Description"], ["contenu", "Contenu"], ["prix", "Prix"], ["argumentaire", "Argumentaire de vente"]],
  },
  ad: {
    label: "AI Ad Generator", icon: <Megaphone size={16} />,
    fields: [{ key: "product", label: "Ton produit ou service", type: "text", placeholder: "ex: formation TikTok pour débutants" }],
    build: (v) => `Réponds UNIQUEMENT avec un objet JSON valide, sans markdown. Format exact: {"titre":"...", "accroche":"...", "texte_publicitaire":"...", "cta":"...", "variantes":["...","...","..."]}. Produit: ${v.product}. En français, percutant, honnête.`,
    blocks: [["titre", "Titre"], ["accroche", "Accroche"], ["texte_publicitaire", "Texte publicitaire"], ["cta", "CTA"]],
  },
};

function AITools({ session, setShowAuth, onCreditsUpdate, buyCredits, push }) {
  const [active, setActive] = useState("content");
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const def = TOOL_DEFS[active];
  const credits = session?.credits ?? 0;

  useEffect(() => { setValues({}); setResult(null); }, [active]);

  const generate = async () => {
    if (!session) { setShowAuth(true); push("Connecte-toi pour utiliser les outils IA."); return; }
    if (credits <= 0) { push("Plus de crédits — recharge ton compte pour continuer."); return; }
    const missing = def.fields.find((f) => !values[f.key]);
    if (missing) { push(`Remplis le champ "${missing.label}"`); return; }
    setLoading(true);
    setResult(null);
    try {
      const prompt = def.build(values);
      const r = await callClaudeJSON(prompt, onCreditsUpdate);
      setResult(r);
    } catch (e) {
      push(e.message === "insufficient_credits" ? "Plus de crédits — recharge ton compte." : "Erreur lors de la génération. Réessaie.");
    }
    setLoading(false);
  };

  return (
    <div className="cai-section">
      <div className="cai-shell">
        <div className="cai-section-head">
          <div className="cai-section-eyebrow">AI Tools</div>
          <h2>Génère en quelques secondes</h2>
          <p className="desc">
            {session ? <>Tu as <b className="mono" style={{ color: "var(--violet)" }}>{credits}</b> crédit{credits !== 1 ? "s" : ""} — chaque génération en consomme 1.</> : "Connecte-toi pour générer du contenu avec l'IA."}
          </p>
          {session && credits <= 3 && (
            <button className="cai-btn cai-btn-ghost cai-btn-sm" style={{ marginTop: 12 }} onClick={buyCredits}><Zap size={13} /> Recharger mes crédits</button>
          )}
        </div>
        <div className="cai-tabs">
          {Object.entries(TOOL_DEFS).map(([k, d]) => (
            <button key={k} className={`cai-tab ${active === k ? "active" : ""}`} onClick={() => setActive(k)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {d.icon} {d.label}
            </button>
          ))}
        </div>
        <div className="cai-tool-grid">
          <div className="cai-card" style={{ padding: 24 }}>
            {def.fields.map((f) => (
              <div className="cai-field" key={f.key}>
                <label>{f.label}</label>
                {f.type === "select" ? (
                  <select className="cai-select" value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}>
                    <option value="">Choisir…</option>
                    {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input className="cai-input" placeholder={f.placeholder} value={values[f.key] || ""} onChange={(e) => setValues({ ...values, [f.key]: e.target.value })} />
                )}
              </div>
            ))}
            <button className="cai-btn cai-btn-primary cai-btn-block" onClick={generate} disabled={loading || (session && credits <= 0)} style={{ marginTop: 8 }}>
              {loading ? <Loader2 size={15} className="spin" /> : <Sparkles size={15} />} {loading ? "Génération…" : !session ? "Se connecter" : "Générer"}
            </button>
          </div>

          <div className="cai-result-panel">
            {!result && !loading && (
              <div className="cai-empty-state">
                <Sparkles size={30} style={{ marginBottom: 14, opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>Remplis le formulaire et lance une génération.<br />Le résultat apparaîtra ici.</p>
              </div>
            )}
            {loading && (
              <div className="cai-empty-state">
                <Loader2 size={26} className="spin" style={{ marginBottom: 14 }} />
                <p style={{ fontSize: 14 }}>Génération en cours…</p>
              </div>
            )}
            {result && result._raw && (
              <div className="cai-result-block-body">{result._raw}</div>
            )}
            {result && !result._raw && (
              <>
                {def.blocks.map(([key, label]) => result[key] && (
                  <div className="cai-result-block" key={key}>
                    <div className="cai-result-block-label">{label}</div>
                    <div className="cai-result-block-body">
                      {Array.isArray(result[key]) ? result[key].join("\n") : result[key]}
                    </div>
                  </div>
                ))}
                {result.hashtags && (
                  <div className="cai-result-block">
                    <div className="cai-result-block-label">Hashtags</div>
                    <div className="cai-hashtag-list">{result.hashtags.map((h, i) => <span key={i} className="cai-hashtag">#{h.replace(/^#/, "")}</span>)}</div>
                  </div>
                )}
                {result.variantes && (
                  <div className="cai-result-block">
                    <div className="cai-result-block-label">Variantes</div>
                    {result.variantes.map((v, i) => <div key={i} style={{ marginBottom: 8 }} className="cai-result-block-body">— {v}</div>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function RedeemCodeBox({ redeemCode }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    if (!code.trim()) return;
    setBusy(true);
    const ok = await redeemCode(code.trim());
    if (ok) setCode("");
    setBusy(false);
  };
  return (
    <div className="cai-card" style={{ padding: 18, marginBottom: 20, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 2 }}>Tu as déjà payé ?</div>
        <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Entre le code reçu par email pour débloquer ta formation ici.</div>
      </div>
      <input
        className="cai-input" style={{ maxWidth: 180 }} placeholder="XXXXX-XXXXX"
        value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
      />
      <button className="cai-btn cai-btn-primary cai-btn-sm" onClick={submit} disabled={busy}>
        {busy ? <Loader2 size={14} className="spin" /> : "Débloquer"}
      </button>
    </div>
  );
}

function Dashboard({ session, owned, formations, orders, progress, setProgress, push, redeemCode, buyCredits, notifications, refreshNotifications }) {
  const [tab, setTab] = useState("formations");
  const ownedFormations = formations.filter((f) => owned.includes(f.id));

  useEffect(() => { if (tab === "notifications") refreshNotifications(); }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="cai-section">
      <div className="cai-shell">
        <h2 style={{ marginBottom: 4 }}>Bonjour {session.firstName}</h2>
        <p style={{ color: "var(--text-dim)", marginBottom: 36 }}>Voici ton espace personnel. <b className="mono" style={{ color: "var(--violet)" }}>{session.credits} crédits</b> disponibles.</p>
        <div className="cai-dash-grid">
          <div className="cai-dash-nav">
            {[
              ["formations", "Mes formations", <BookOpen size={16} />],
              ["orders", "Mes commandes", <Wrench size={16} />],
              ["notifications", "Notifications", <Bell size={16} />],
              ["favorites", "Mes favoris", <Heart size={16} />],
              ["profile", "Mon profil", <User size={16} />],
              ["credits", "Mes crédits", <Zap size={16} />],
            ].map(([k, label, icon]) => (
              <button key={k} className={tab === k ? "active" : ""} onClick={() => setTab(k)}>{icon} {label}</button>
            ))}
          </div>

          <div>
            {tab === "formations" && (
              <>
              <RedeemCodeBox redeemCode={redeemCode} />
              {ownedFormations.length === 0 ? (
                <div className="cai-empty-row"><BookOpen size={26} style={{ marginBottom: 10, opacity: 0.4 }} /><p>Tu n'as pas encore de formation. Achètes-en une, ou entre un code d'accès reçu par email ci-dessus.</p></div>
              ) : ownedFormations.map((f) => (
                <div key={f.id} className="cai-card" style={{ padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <h3 style={{ fontSize: 15.5, fontWeight: 700 }}>{f.title}</h3>
                    <span className="mono" style={{ fontSize: 13, color: "var(--text-dim)" }}>{progress[f.id] || 0}%</span>
                  </div>
                  <div className="cai-progress-track"><div className="cai-progress-fill" style={{ width: `${progress[f.id] || 0}%` }} /></div>
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button className="cai-btn cai-btn-ghost cai-btn-sm" onClick={() => setProgress(f.id, Math.min(100, (progress[f.id] || 0) + 15))}><Play size={13} /> Continuer</button>
                  </div>
                </div>
              ))}
              </>
            )}

            {tab === "orders" && (
              orders.length === 0 ? (
                <div className="cai-empty-row"><Wrench size={26} style={{ marginBottom: 10, opacity: 0.4 }} /><p>Aucune commande pour l'instant.</p></div>
              ) : orders.map((o, i) => (
                <div key={i} className="cai-card" style={{ padding: 18, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700 }}>{o.title}</h3>
                    <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Formule {o.formula} · {new Date(o.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <span className="cai-pill" style={{ background: "rgba(52,211,153,0.15)", color: "var(--green)" }}>{o.status}</span>
                </div>
              ))
            )}

            {tab === "notifications" && (
              notifications.length === 0 ? (
                <div className="cai-empty-row"><Bell size={26} style={{ marginBottom: 10, opacity: 0.4 }} /><p>Aucune notification pour l'instant.</p></div>
              ) : notifications.map((n) => (
                <div key={n.id} className="cai-card" style={{ padding: 16, marginBottom: 10 }}>
                  <p style={{ fontSize: 13.5 }}>{n.message}</p>
                  <p style={{ fontSize: 11.5, color: "var(--text-faint)", marginTop: 4 }}>{new Date(n.date).toLocaleString("fr-FR")}</p>
                </div>
              ))
            )}

            {tab === "favorites" && (
              <div className="cai-empty-row"><Heart size={26} style={{ marginBottom: 10, opacity: 0.4 }} /><p>Aucun favori pour l'instant. Clique sur ♡ sur une formation ou un service pour l'ajouter.</p></div>
            )}

            {tab === "profile" && (
              <div className="cai-card" style={{ padding: 24, maxWidth: 420 }}>
                <div className="cai-field"><label>Prénom</label><input className="cai-input" defaultValue={session.firstName} disabled /></div>
                <div className="cai-field"><label>Email</label><input className="cai-input" defaultValue={session.email} disabled /></div>
                <p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>La modification du profil n'est pas encore branchée à un formulaire d'édition côté serveur.</p>
              </div>
            )}

            {tab === "credits" && (
              <div>
                <div className="cai-card" style={{ padding: 20, marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
                  <Zap size={22} color="var(--violet)" />
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>{session.credits} crédits</div>
                    <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>1 crédit = 1 génération avec un outil IA</div>
                  </div>
                </div>
                <div className="cai-grid-3">
                  {[
                    { id: "small", label: "30 crédits", price: "4,90 €" },
                    { id: "medium", label: "80 crédits", price: "9,90 €" },
                    { id: "large", label: "200 crédits", price: "19,90 €" },
                  ].map((p) => (
                    <div key={p.id} className="cai-card" style={{ padding: 22, textAlign: "center" }}>
                      <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.label}</div>
                      <div className="cai-price" style={{ marginBottom: 16 }}>{p.price}</div>
                      <button className="cai-btn cai-btn-primary cai-btn-block" onClick={() => buyCredits(p.id)}>Acheter</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   ADMIN
   ============================================================ */
function Admin({ formations, services, setFormations, setServices, allOrders, allUsers, push }) {
  const [tab, setTab] = useState("stats");
  const revenue = allOrders.reduce((sum, o) => sum + (o.price || 0), 0);
  const topFormation = [...formations].sort((a, b) => b.reviews - a.reviews)[0];

  const removeFormation = (id) => { setFormations(formations.filter((f) => f.id !== id)); push("Formation supprimée"); };
  const removeService = (id) => { setServices(services.filter((s) => s.id !== id)); push("Service supprimé"); };

  return (
    <div className="cai-section">
      <div className="cai-shell">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <ShieldCheck size={22} color="var(--violet)" />
          <h2 style={{ margin: 0 }}>Administration</h2>
        </div>
        <p style={{ color: "var(--text-dim)", marginBottom: 32 }}>Accès réservé aux administrateurs — connecté à la vraie base de données.</p>
        <div className="cai-tabs">
          {["stats", "formations", "services", "utilisateurs", "support"].map((t) => (
            <button key={t} className={`cai-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "stats" && (
          <div className="cai-grid-4">
            <div className="cai-card cai-stat-card"><div className="cai-stat-icon" style={{ background: "rgba(52,211,153,0.14)" }}><DollarSign size={18} color="var(--green)" /></div><div className="cai-stat-value">{revenue} €</div><div className="cai-stat-label">Chiffre d'affaires suivi</div></div>
            <div className="cai-card cai-stat-card"><div className="cai-stat-icon" style={{ background: "rgba(76,123,255,0.14)" }}><TrendingUp size={18} color="var(--blue)" /></div><div className="cai-stat-value">{allOrders.length}</div><div className="cai-stat-label">Ventes</div></div>
            <div className="cai-card cai-stat-card"><div className="cai-stat-icon" style={{ background: "rgba(124,92,252,0.14)" }}><Users size={18} color="var(--violet)" /></div><div className="cai-stat-value">{allUsers.length}</div><div className="cai-stat-label">Utilisateurs</div></div>
            <div className="cai-card cai-stat-card"><div className="cai-stat-icon" style={{ background: "rgba(251,191,36,0.14)" }}><Award size={18} color="var(--amber)" /></div><div className="cai-stat-value" style={{ fontSize: 16 }}>{topFormation?.title || "—"}</div><div className="cai-stat-label">Formation la plus vendue</div></div>
          </div>
        )}

        {tab === "formations" && (
          <div>
            <button className="cai-btn cai-btn-ghost cai-btn-sm" style={{ marginBottom: 18 }} onClick={() => push("Créer une formation — branche un formulaire ici")}><Plus size={14} /> Nouvelle formation</button>
            {formations.map((f) => (
              <div key={f.id} className="cai-card" style={{ padding: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{f.title}</h3><p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{f.price} € · {f.modules} modules · {f.level}</p></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="cai-icon-btn" onClick={() => push("Édition — branche un formulaire ici")}><Edit3 size={14} /></button>
                  <button className="cai-icon-btn" onClick={() => removeFormation(f.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "services" && (
          <div>
            <button className="cai-btn cai-btn-ghost cai-btn-sm" style={{ marginBottom: 18 }} onClick={() => push("Créer un service — branche un formulaire ici")}><Plus size={14} /> Nouveau service</button>
            {services.map((s) => (
              <div key={s.id} className="cai-card" style={{ padding: 16, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{s.title}</h3><p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{s.category} · {s.provider}</p></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="cai-icon-btn" onClick={() => push("Édition — branche un formulaire ici")}><Edit3 size={14} /></button>
                  <button className="cai-icon-btn" onClick={() => removeService(s.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "utilisateurs" && (
          allUsers.length === 0 ? <div className="cai-empty-row">Aucun utilisateur inscrit pour l'instant.</div> :
          allUsers.map((u, i) => (
            <div key={i} className="cai-card" style={{ padding: 16, marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
              <div><h3 style={{ fontSize: 14.5, fontWeight: 700 }}>{u.firstName}</h3><p style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{u.email}</p></div>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</span>
            </div>
          ))
        )}

        {tab === "support" && <AdminSupportInbox push={push} />}
      </div>
    </div>
  );
}

function AdminSupportInbox({ push }) {
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  const loadList = async () => {
    try {
      const res = await fetch("/api/support/list", { credentials: "include" });
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch { /* silent */ }
  };

  const openThread = async (id) => {
    setActiveId(id);
    try {
      const res = await fetch(`/api/support/thread?id=${id}`, { credentials: "include" });
      const data = await res.json();
      setThread(data.conversation || null);
    } catch { /* silent */ }
  };

  useEffect(() => { loadList(); }, []);

  const sendReply = async () => {
    if (!reply.trim() || !activeId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/support/reply", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ conversationId: activeId, message: reply.trim() }),
      });
      const data = await res.json();
      if (res.ok) { setThread(data.conversation); setReply(""); loadList(); }
      else push(data.error || "Erreur lors de l'envoi.");
    } catch { push("Erreur lors de l'envoi."); }
    setBusy(false);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20 }}>
      <div>
        {conversations.length === 0 && <div className="cai-empty-row" style={{ padding: 30 }}>Aucune conversation pour l'instant.</div>}
        {conversations.map((c) => (
          <div key={c.id} className="cai-card" style={{ padding: 14, marginBottom: 8, cursor: "pointer", borderColor: activeId === c.id ? "var(--violet)" : "var(--border)" }} onClick={() => openThread(c.id)}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{c.userEmail || "Visiteur anonyme"}</div>
            <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{c.lastFrom === "admin" ? "Toi : " : ""}{c.lastMessage}</div>
          </div>
        ))}
      </div>
      <div className="cai-card" style={{ padding: 18, minHeight: 400, display: "flex", flexDirection: "column" }}>
        {!thread ? (
          <div className="cai-empty-state"><MessageSquare size={26} style={{ marginBottom: 10, opacity: 0.4 }} /><p style={{ fontSize: 13.5 }}>Sélectionne une conversation.</p></div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              {thread.messages.map((m, i) => (
                <div key={i} className={`cai-chat-msg ${m.from}`} style={{ maxWidth: "70%" }}>
                  <div className="cai-chat-msg-tag">{m.from === "user" ? (thread.userEmail || "Visiteur") : m.from === "admin" ? "Toi" : "Assistant IA"}</div>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input className="cai-input" placeholder="Répondre en tant qu'équipe…" value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendReply()} />
              <button className="cai-btn cai-btn-primary cai-btn-sm" onClick={sendReply} disabled={busy}><Send size={14} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


/* ============================================================
   SUPPORT CHAT WIDGET — AI-first, human handoff possible
   ============================================================ */
function getGuestId() {
  let id = localStorage.getItem("creatorai:guestId");
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("creatorai:guestId", id);
  }
  return id;
}

function ChatWidget({ session }) {
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState(() => localStorage.getItem("creatorai:conversationId") || null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bodyRef = useRef(null);

  const loadThread = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/support/thread?id=${id}`, { credentials: "include" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.conversation) setMessages(data.conversation.messages);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (conversationId) loadThread(conversationId); }, [conversationId, loadThread]);

  // Poll for admin replies while the widget is open.
  useEffect(() => {
    if (!open || !conversationId) return;
    const interval = setInterval(() => loadThread(conversationId), 6000);
    return () => clearInterval(interval);
  }, [open, conversationId, loadThread]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, open]);

  const send = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setMessages((m) => [...m, { from: "user", text, date: Date.now() }]);
    setSending(true);
    try {
      const res = await fetch("/api/support/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: text, conversationId, guestId: session ? undefined : getGuestId() }),
      });
      const data = await res.json();
      if (res.ok) {
        if (!conversationId) {
          setConversationId(data.conversationId);
          localStorage.setItem("creatorai:conversationId", data.conversationId);
        }
        setMessages((m) => [...m, { from: "ai", text: data.reply, date: Date.now() }]);
      }
    } catch {
      setMessages((m) => [...m, { from: "ai", text: "Connexion impossible. Réessaie dans un instant.", date: Date.now() }]);
    }
    setSending(false);
  };

  return (
    <>
      {open && (
        <div className="cai-chat-window">
          <div className="cai-chat-head">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} color="var(--violet)" />
              <span style={{ fontSize: 14, fontWeight: 700 }}>Assistance Creator AI</span>
            </div>
            <button className="cai-icon-btn" onClick={() => setOpen(false)}><X size={15} /></button>
          </div>
          <div className="cai-chat-body" ref={bodyRef}>
            {messages.length === 0 && (
              <div style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 13, padding: "30px 10px" }}>
                Pose ta question — un assistant IA te répond tout de suite, et l'équipe peut prendre le relais si besoin.
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`cai-chat-msg ${m.from}`}>
                {m.from === "admin" && <div className="cai-chat-msg-tag">Équipe Creator AI</div>}
                {m.text}
              </div>
            ))}
            {sending && <div className="cai-chat-msg ai"><Loader2 size={13} className="spin" /></div>}
          </div>
          <div className="cai-chat-input-row">
            <input className="cai-input" placeholder="Écris ton message…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} />
            <button className="cai-icon-btn" onClick={send} disabled={sending}><Send size={15} /></button>
          </div>
        </div>
      )}
      <button className="cai-chat-bubble" onClick={() => setOpen((v) => !v)} title="Assistance">
        {open ? <X size={22} /> : <MessageSquare size={22} />}
      </button>
    </>
  );
}

/* ============================================================
   LEGAL PAGES — generic RGPD-informed templates.
   Placeholders in [ ] must be filled in with real business details.
   This is not legal advice — have a professional review before real launch.
   ============================================================ */
const LEGAL_CONTENT = {
  mentions: {
    title: "Mentions légales",
    body: (
      <>
        <h2>Éditeur du site</h2>
        <p>[Nom de l'entreprise ou nom et prénom si auto-entrepreneur]<br />
        [Forme juridique] — [Numéro SIRET]<br />
        [Adresse du siège social]<br />
        Email : [email de contact]<br />
        Directeur de la publication : [nom]</p>
        <h2>Hébergement</h2>
        <p>Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.</p>
        <h2>Propriété intellectuelle</h2>
        <p>L'ensemble des contenus présents sur ce site (textes, formations, visuels, code) est protégé par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
      </>
    ),
  },
  cgu: {
    title: "Conditions Générales d'Utilisation",
    body: (
      <>
        <h2>Objet</h2>
        <p>Les présentes CGU régissent l'accès et l'utilisation du site Creator AI, incluant la création de compte, l'usage des outils IA, et la consultation du catalogue de formations et services.</p>
        <h2>Compte utilisateur</h2>
        <p>La création d'un compte nécessite une adresse email valide. L'utilisateur est responsable de la confidentialité de son mot de passe et de toute activité effectuée depuis son compte.</p>
        <h2>Usage des outils IA</h2>
        <p>Les outils IA du site utilisent un système de crédits. Le contenu généré est fourni à titre d'assistance ; l'utilisateur reste seul responsable de son usage et de sa publication.</p>
        <h2>Comportement interdit</h2>
        <ul>
          <li>Usage frauduleux du système de paiement ou de crédits</li>
          <li>Génération de contenu illégal, diffamatoire ou portant atteinte à des tiers</li>
          <li>Tentative d'accès non autorisé aux comptes d'autres utilisateurs</li>
        </ul>
      </>
    ),
  },
  cgv: {
    title: "Conditions Générales de Vente",
    body: (
      <>
        <h2>Produits vendus</h2>
        <p>Le site propose à la vente des formations numériques (accès à vie après achat), des crédits pour outils IA, et met en relation avec des prestataires de services tiers.</p>
        <h2>Prix</h2>
        <p>Les prix sont indiqués en euros, toutes taxes comprises. Le site se réserve le droit de modifier ses prix à tout moment, sans effet sur les achats déjà confirmés.</p>
        <h2>Paiement</h2>
        <p>Le paiement est traité par Stripe. Aucune donnée bancaire n'est stockée par Creator AI.</p>
        <h2>Droit de rétractation</h2>
        <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques dont l'exécution a commencé avec l'accord exprès du consommateur avant la fin du délai de rétractation — ce qui est le cas dès qu'une formation devient accessible sur le compte. [Cette clause doit être validée par un professionnel du droit avant mise en ligne commerciale.]</p>
        <h2>Litiges</h2>
        <p>En cas de litige, l'utilisateur peut contacter [email de contact] avant tout recours judiciaire.</p>
      </>
    ),
  },
  confidentialite: {
    title: "Politique de confidentialité",
    body: (
      <>
        <h2>Données collectées</h2>
        <p>Nom, email, mot de passe (chiffré), historique d'achats, solde de crédits, et messages envoyés à l'assistance.</p>
        <h2>Finalité</h2>
        <p>Ces données servent à la gestion du compte, à la fourniture des formations/services achetés, et à l'amélioration du support client.</p>
        <h2>Base légale</h2>
        <p>Exécution du contrat (accès aux achats), intérêt légitime (support, sécurité), et consentement (Google Sign-In, le cas échéant).</p>
        <h2>Destinataires des données</h2>
        <ul>
          <li>Stripe (paiement)</li>
          <li>Resend (envoi d'emails transactionnels)</li>
          <li>Anthropic (génération de contenu IA — les prompts envoyés aux outils IA transitent par leur API)</li>
          <li>Google (uniquement si connexion via Google Sign-In)</li>
          <li>Vercel (hébergement et base de données)</li>
        </ul>
        <h2>Durée de conservation</h2>
        <p>Les données sont conservées tant que le compte est actif, puis supprimées ou anonymisées dans un délai raisonnable après suppression du compte.</p>
        <h2>Droits des utilisateurs</h2>
        <p>Conformément au RGPD, chaque utilisateur dispose d'un droit d'accès, de rectification, d'effacement, de portabilité et d'opposition sur ses données, exerçable auprès de [email de contact]. Il est également possible d'introduire une réclamation auprès de la CNIL (cnil.fr).</p>
      </>
    ),
  },
  cookies: {
    title: "Politique de cookies",
    body: (
      <>
        <h2>Cookie essentiel</h2>
        <p>Ce site utilise un unique cookie strictement nécessaire, qui garde ta session de connexion active. Ce cookie ne sert à aucun traçage publicitaire et, conformément à la réglementation ePrivacy, ne nécessite pas de consentement préalable puisqu'il est indispensable au fonctionnement du service (rester connecté).</p>
        <h2>Pas de cookies publicitaires</h2>
        <p>Ce site ne dépose actuellement aucun cookie de mesure d'audience ou publicitaire tiers. Si cela devait changer, cette page et un bandeau de consentement seraient mis à jour en conséquence.</p>
      </>
    ),
  },
};

function LegalPage({ pageKey, onBack }) {
  const content = LEGAL_CONTENT[pageKey];
  if (!content) return null;
  return (
    <div className="cai-section">
      <div className="cai-shell cai-legal-page">
        <button className="cai-btn cai-btn-ghost cai-btn-sm" onClick={onBack} style={{ marginBottom: 24 }}><ChevronLeft size={14} /> Retour</button>
        <div className="cai-legal-disclaimer">
          Modèle générique fourni à titre indicatif — ce n'est pas un conseil juridique. Fais valider ce contenu par un professionnel du droit avant un lancement commercial réel, et remplace les champs entre crochets par tes informations exactes.
        </div>
        <h1>{content.title}</h1>
        <div className="updated">Dernière mise à jour : 2026</div>
        {content.body}
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer className="cai-footer">
      <div className="cai-shell">
        <div className="cai-footer-top">
          <div className="cai-footer-col">
            <div className="cai-logo" style={{ marginBottom: 12 }}>
              <span className="cai-logo-mark"><Sparkles size={14} color="#fff" /></span>
              Creator AI
            </div>
            <p className="cai-footer-legal-note">Formations, services et outils IA pour créateurs de contenu. © 2026 Creator AI — [Nom de l'entreprise]. Tous droits réservés.</p>
          </div>
          <div className="cai-footer-col">
            <h4>Ressources</h4>
            <button onClick={() => setPage("formations")}>Formations</button>
            <button onClick={() => setPage("services")}>Services</button>
            <button onClick={() => setPage("ai-tools")}>Outils IA</button>
          </div>
          <div className="cai-footer-col">
            <h4>Informations légales</h4>
            <button onClick={() => setPage("legal:mentions")}>Mentions légales</button>
            <button onClick={() => setPage("legal:cgv")}>Conditions générales de vente</button>
            <button onClick={() => setPage("legal:cgu")}>Conditions générales d'utilisation</button>
            <button onClick={() => setPage("legal:confidentialite")}>Politique de confidentialité</button>
            <button onClick={() => setPage("legal:cookies")}>Politique de cookies</button>
          </div>
        </div>
        <div className="cai-footer-inner">
          <span>Creator AI — Union Européenne · conforme RGPD</span>
          <span>© 2026 — Tous droits réservés</span>
        </div>
      </div>
    </footer>
  );
}

function CookieBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem("creatorai:cookieBannerSeen") === "1");
  if (dismissed) return null;
  const dismiss = () => { localStorage.setItem("creatorai:cookieBannerSeen", "1"); setDismissed(true); };
  return (
    <div className="cai-cookie-banner">
      <p>Ce site utilise un unique cookie essentiel pour te garder connecté. Aucun cookie publicitaire ou de traçage n'est utilisé. <button style={{ background: "none", border: "none", color: "var(--violet)", fontWeight: 600 }} onClick={dismiss}>En savoir plus</button></p>
      <button className="cai-btn cai-btn-primary cai-btn-sm" onClick={dismiss}>J'ai compris</button>
    </div>
  );
}


/* ============================================================
   ROOT APP
   ============================================================ */
export default function CreatorAIApp() {
  const [page, setPage] = useState("home");
  const [session, setSession] = useState(null); // { email, firstName, credits, isAdmin, ownedFormations }
  const [showAuth, setShowAuth] = useState(false);
  const [ready, setReady] = useState(false);
  const [formations, setFormations] = useState(SEED_FORMATIONS);
  const [services, setServices] = useState(SEED_SERVICES);
  const [owned, setOwned] = useState([]);
  const [orders, setOrders] = useState([]);
  const [progress, setProgressState] = useState({});
  const [reviewsMap, setReviewsMap] = useState({});
  const [allOrders, setAllOrders] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const { toasts, push } = useToasts();

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (data.user) {
        setSession({ email: data.user.email, firstName: data.user.firstName, credits: data.user.credits, isAdmin: data.user.isAdmin });
        setOwned(data.user.ownedFormations || []);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    }
  }, []);

  const loadCatalog = useCallback(async () => {
    try {
      const res = await fetch("/api/catalog");
      const data = await res.json();
      if (data.formations) setFormations(data.formations);
      if (data.services) setServices(data.services);
    } catch {
      /* fall back to local seed data already in state */
    }
  }, []);

  // boot: real session (cookie-based) + real shared catalog, local-only prefs
  useEffect(() => {
    (async () => {
      await Promise.all([loadMe(), loadCatalog()]);
      const ord = await storeGet("orders", false, []);
      setOrders(ord || []);
      const prog = await storeGet("progress", false, {});
      setProgress(prog || {});
      const revMap = await storeGet("reviews", true, {});
      setReviewsMap(revMap || {});
      const allOrd = await storeGet("all-orders", true, []);
      setAllOrders(allOrd || []);
      setReady(true);
    })();
  }, [loadMe, loadCatalog]);

  const setProgress = (id, val) => {
    const next = { ...progress, [id]: val };
    setProgressState(next);
    storeSet("progress", next, false);
  };

  const requireAuth = () => {
    if (!session) { setShowAuth(true); push("Connecte-toi pour continuer"); return false; }
    return true;
  };

  const handleCreditsUpdate = useCallback((newCredits) => {
    setSession((s) => (s ? { ...s, credits: newCredits } : s));
  }, []);

  const buyFormation = async (f) => {
    if (!requireAuth()) return;
    if (owned.includes(f.id)) return;
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ formationId: f.id, formationTitle: f.title, priceEUR: f.price }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        push(data.error || "Paiement indisponible pour le moment.");
        return;
      }
      window.location.href = data.url; // hand off to Stripe's hosted checkout page
    } catch {
      push("Impossible de démarrer le paiement. Réessaie.");
    }
  };

  const buyCredits = async (pack) => {
    if (!requireAuth()) return;
    try {
      const res = await fetch("/api/credits/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pack }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) { push(data.error || "Paiement indisponible."); return; }
      window.location.href = data.url;
    } catch {
      push("Impossible de démarrer le paiement. Réessaie.");
    }
  };

  const redeemCode = async (code) => {
    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) { push(data.error || "Code invalide."); return false; }
      setOwned((prev) => (prev.includes(data.formationId) ? prev : [...prev, data.formationId]));
      push(`Accès débloqué — ${data.formationTitle}`, <Check size={15} color="var(--green)" />);
      return true;
    } catch {
      push("Erreur lors de la vérification du code.");
      return false;
    }
  };

  const refreshNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", { credentials: "include" });
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      /* silent */
    }
  }, []);

  const openNotifications = async () => {
    setNotifOpen((v) => !v);
    await refreshNotifications();
    await fetch("/api/notifications", { method: "POST", credentials: "include" }).catch(() => {});
    setTimeout(refreshNotifications, 300);
  };

  useEffect(() => {
    if (session) refreshNotifications();
  }, [session?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle the redirect back from Stripe (?checkout=success|cancelled|credits-success).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("checkout");
    if (status === "success") {
      push("Paiement reçu — ton accès est débloqué, vérifie aussi ta boîte mail.", <Check size={15} color="var(--green)" />);
      loadMe();
    } else if (status === "credits-success") {
      push("Crédits ajoutés à ton compte 🎉", <Check size={15} color="var(--green)" />);
      loadMe();
    } else if (status === "cancelled") {
      push("Paiement annulé.");
    }
    if (status) window.history.replaceState({}, "", window.location.pathname);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const orderService = async (s, formula) => {
    if (!requireAuth()) return;
    const record = { title: s.title, formula, price: s.prices[formula], date: Date.now(), status: "En cours", user: session.email };
    const next = [...orders, record];
    setOrders(next);
    await storeSet("orders", next, false);
    const nextAll = [...allOrders, record];
    setAllOrders(nextAll);
    await storeSet("all-orders", nextAll, true);
    push(`Commande envoyée — ${s.title}`, <Check size={15} color="var(--green)" />);
    setPage("dashboard");
  };

  const addReview = async (formationId, rating, comment) => {
    if (!comment.trim()) { push("Écris un commentaire avant de publier."); return; }
    const next = { ...reviewsMap, [formationId]: [...(reviewsMap[formationId] || []), { rating, comment, user: session.firstName }] };
    setReviewsMap(next);
    await storeSet("reviews", next, true);
    push("Avis publié — merci !", <Check size={15} color="var(--green)" />);
  };

  const persistFormations = async (next) => {
    setFormations(next);
    await fetch("/api/catalog", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ formations: next }) });
  };
  const persistServices = async (next) => {
    setServices(next);
    await fetch("/api/catalog", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ services: next }) });
  };

  const loadAdminStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", { credentials: "include" });
      const data = await res.json();
      if (data.users) setAdminUsers(data.users);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    if (page === "admin" && session?.isAdmin) loadAdminStats();
  }, [page, session?.isAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    setSession(null);
    setOwned([]);
    setPage("home");
    push("Déconnecté");
  };

  if (!ready) {
    return (
      <div className="cai" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <GlobalStyle />
        <Loader2 size={26} className="spin" />
      </div>
    );
  }

  return (
    <div className="cai">
      <GlobalStyle />
      <style>{`.spin { animation: cai-spin 0.8s linear infinite; } @keyframes cai-spin { to { transform: rotate(360deg); } }`}</style>

      <Nav
        page={page} setPage={setPage} session={session} setShowAuth={setShowAuth}
        notifications={notifications} notifOpen={notifOpen} setNotifOpen={setNotifOpen}
        onOpenNotifs={openNotifications} onLogout={logout}
      />

      {/* mobile nav — hidden on desktop via CSS */}
      <div className="cai-mobile-tabs">
        {[["home", "Accueil"], ["formations", "Formations"], ["services", "Services"], ["ai-tools", "AI Tools"], session && ["dashboard", "Dashboard"], session?.isAdmin && ["admin", "Admin"]].filter(Boolean).map(([id, label]) => (
          <button key={id} className={`cai-tab ${page === id ? "active" : ""}`} style={{ whiteSpace: "nowrap", padding: "7px 14px", fontSize: 12.5 }} onClick={() => setPage(id)}>{label}</button>
        ))}
      </div>

      {page === "admin" && session?.isAdmin ? (
        <Admin
          formations={formations} services={services}
          setFormations={persistFormations} setServices={persistServices}
          allOrders={allOrders} allUsers={adminUsers} push={push}
        />
      ) : page.startsWith("legal:") ? (
        <LegalPage pageKey={page.split(":")[1]} onBack={() => setPage("home")} />
      ) : (
        <>
          {page === "home" && <Home setPage={setPage} />}
          {page === "formations" && (
            <Formations formations={formations} owned={owned} onBuy={buyFormation} reviewsMap={reviewsMap} onReview={addReview} />
          )}
          {page === "services" && <Services services={services} onOrder={orderService} />}
          {page === "ai-tools" && (
            <AITools session={session} setShowAuth={setShowAuth} onCreditsUpdate={handleCreditsUpdate} buyCredits={() => { setPage("dashboard"); }} push={push} />
          )}
          {page === "dashboard" && session && (
            <Dashboard
              session={session} owned={owned} formations={formations} orders={orders}
              progress={progress} setProgress={setProgress}
              push={push} redeemCode={redeemCode} buyCredits={buyCredits}
              notifications={notifications} refreshNotifications={refreshNotifications}
            />
          )}
          {page === "dashboard" && !session && (
            <div className="cai-empty-row" style={{ padding: "100px 20px" }}>
              <p style={{ marginBottom: 16 }}>Connecte-toi pour accéder à ton espace.</p>
              <button className="cai-btn cai-btn-primary" onClick={() => setShowAuth(true)}>Connexion</button>
            </div>
          )}
          {page === "admin" && !session?.isAdmin && (
            <div className="cai-empty-row" style={{ padding: "100px 20px" }}>
              <ShieldCheck size={26} style={{ marginBottom: 10, opacity: 0.4 }} />
              <p>Accès réservé aux administrateurs.</p>
            </div>
          )}
        </>
      )}

      <Footer setPage={setPage} />

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={(data) => { setSession({ email: data.email, firstName: data.firstName, credits: data.credits, isAdmin: false }); loadMe(); }} push={push} />}

      <ChatWidget session={session} />
      <CookieBanner />

      <div className="cai-toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className="cai-toast">{t.icon || <Bell size={14} />} {t.msg}</div>
        ))}
      </div>
    </div>
  );
}

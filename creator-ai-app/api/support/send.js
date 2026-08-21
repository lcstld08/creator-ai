import { kv } from "@vercel/kv";
import { getSessionUser } from "../_lib/auth.js";

function newId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

async function buildSystemPrompt() {
  const formations = (await kv.get("catalog:formations")) || [];
  const services = (await kv.get("catalog:services")) || [];

  const formationsList = formations.map((f) => `- "${f.title}" (${f.level}, ${f.duration}, ${f.modules} modules) — ${f.price} €`).join("\n") || "Aucune formation listée pour le moment.";
  const serviceCategories = [...new Set(services.map((s) => s.category))].join(", ") || "aucune";

  return `Tu es l'assistant d'aide (support client) du site Creator AI. Réponds en français, de façon claire, chaleureuse et concise. Tu aides les visiteurs et clients à comprendre et utiliser le site.

CE QUE PROPOSE LE SITE :
1. FORMATIONS — un catalogue de formations vidéo à acheter une fois (paiement unique), accessible ensuite à vie dans "Mon espace → Mes formations". Catalogue actuel :
${formationsList}

2. SERVICES — une marketplace de prestataires (catégories : ${serviceCategories}), avec 3 formules par service (Basic / Standard / Premium). On les commande depuis la page Services.

3. OUTILS IA (AI Tools) — 4 générateurs : AI Content Creator (idées/scripts/hooks pour vidéos), AI Business Generator (idées de business), AI Product Generator (idées de produits digitaux), AI Ad Generator (textes publicitaires). Chaque génération coûte 1 crédit IA.

4. CRÉDITS — chaque nouveau compte reçoit 10 crédits offerts à l'inscription. On peut en racheter dans Dashboard → Mes crédits : 30 crédits (4,90 €), 80 crédits (9,90 €), 200 crédits (19,90 €).

5. COMPTE — création par email/mot de passe ou avec Google. La connexion reste active automatiquement au retour sur le site (pas besoin de se reconnecter à chaque fois), sauf déconnexion manuelle.

6. PAIEMENT — géré par Stripe (carte bancaire), sécurisé, aucune donnée bancaire n'est stockée par le site. Après achat d'une formation, l'accès est débloqué automatiquement sur le compte, et un email de confirmation est envoyé avec un code de secours utilisable sur un autre appareil (section "Tu as déjà payé ?" dans Mes formations).

7. NOTIFICATIONS — la cloche en haut du site affiche les notifications de compte (achats confirmés, crédits ajoutés, etc.).

RÈGLES IMPORTANTES :
- Ne promets JAMAIS de remboursement, de délai ou de garantie précis que tu ne connais pas avec certitude — dis que l'équipe du site va vérifier et revenir vers la personne si tu n'es pas sûr.
- N'invente aucune fonctionnalité qui n'est pas listée ci-dessus.
- Si la question dépasse ce que tu sais, ou si la personne semble frustrée / a un problème de paiement non résolu, dis clairement qu'un membre de l'équipe va prendre le relais sur cette conversation, et reste utile en attendant.
- Reste bref : 2 à 5 phrases dans la plupart des cas.`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message, conversationId, guestId } = req.body || {};
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ error: "Message vide" });
  }

  const session = getSessionUser(req);
  const id = conversationId || newId();
  const convKey = `conversation:${id}`;

  let conv = await kv.get(convKey);
  if (!conv) {
    conv = {
      id,
      userEmail: session?.email || null,
      guestId: session ? null : guestId || null,
      messages: [],
      status: "open",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await kv.sadd("conversations:index", id);
  }

  conv.messages.push({ from: "user", text: message.trim(), date: Date.now() });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  let replyText = "Merci pour ton message — un membre de l'équipe va y répondre bientôt.";

  if (apiKey) {
    try {
      const system = await buildSystemPrompt();
      const history = conv.messages.slice(-10).map((m) => ({
        role: m.from === "admin" ? "assistant" : m.from === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 500,
          system,
          messages: history,
        }),
      });
      if (anthropicRes.ok) {
        const data = await anthropicRes.json();
        replyText = (data.content || []).map((b) => b.text || "").join("\n") || replyText;
      }
    } catch {
      /* fall back to the default reply above */
    }
  }

  conv.messages.push({ from: "ai", text: replyText, date: Date.now() });
  conv.updatedAt = Date.now();
  await kv.set(convKey, conv);

  return res.status(200).json({ conversationId: id, reply: replyText });
}

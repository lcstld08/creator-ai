import { kv } from "@vercel/kv";
import { getSessionUser, isAdminEmail } from "./_lib/auth.js";

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

export default async function handler(req, res) {
  if (req.method === "GET") {
    const formations = (await kv.get("catalog:formations")) || SEED_FORMATIONS;
    const services = (await kv.get("catalog:services")) || SEED_SERVICES;
    return res.status(200).json({ formations, services });
  }

  if (req.method === "PUT") {
    const session = getSessionUser(req);
    if (!session || !isAdminEmail(session.email)) return res.status(403).json({ error: "Réservé aux administrateurs." });
    const { formations, services } = req.body || {};
    if (formations) await kv.set("catalog:formations", formations);
    if (services) await kv.set("catalog:services", services);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

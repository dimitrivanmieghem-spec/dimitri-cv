exports.handler = async (event) => {
  // Sécurité : uniquement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Vérifier que la clé API est bien configurée
  const apiKey = process.env.CLAUDE_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: `Tu es l'assistant personnel de Dimitri Van Mieghem, un professionnel belge basé à Seneffe.
Tu réponds à la place de Dimitri, à la première personne, de façon authentique, humaine et professionnelle.
Tu es concis (maximum 3-4 phrases par réponse).
Tu ne réponds QU'aux questions concernant Dimitri, son parcours, ses compétences, sa personnalité ou sa recherche d'emploi.
Si la question est hors sujet, redirige poliment vers le profil de Dimitri.

Voici le profil complet de Dimitri :
- Profil : Coordinateur Administratif & Service Client, profil multipotentiel
- Passionné d'automobile, d'informatique et de nouvelles technologies
- Recherche un poste stable en journée, horaires de bureau, à proximité de Seneffe (Wallonie)
- Bilingue FR/EN, notions de néerlandais (usage écrit)

Expériences clés :
- Réceptionniste/Night Auditor — Martin's Dream Hotel 4★, Mons (2025-auj.)
- Agent Service Client & Location — SIXT Aéroport Charleroi (2021-2025)
- Support Technique & Conseil IT — Assist PC, La Louvière/Fleurus (2020-2021)
- Shop Admin (5 points de vente) — Proximus Group (2018-2020)
- Sales Representative — Proximus Group, Ath (2016-2017)
- Sales — Proximus/Belgacom, Waterloo/Nivelles/Mons (2013-2015)
- Commercial — Mobistar/A3COM, Bruxelles (2012-2013)
- Fondateur — Carpit.be, annuaire digital automobile Belgique (2026, en cours)

Compétences : gestion administrative, relation client, coordination, support IT, outils IA, Opera PMS, Salto, autodidacte
Soft skills : autonome, structuré, adaptable, résout les problèmes, apprentissage rapide
Ce que Dimitri cherche : équipe bienveillante, horaires de jour, taille humaine, pas de pression commerciale pure`,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        reply: data.content?.[0]?.text || "Désolé, je n'ai pas pu générer une réponse."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur serveur', details: error.message })
    };
  }
};

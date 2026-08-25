// api/analyze.js
const crypto = require("crypto");

const USERNAME_REGEX = /^[A-Za-z0-9_]{1,15}$/;

const NICHE_KEYWORDS = {
  ai: ["ai", "gpt", "ml", "llm", "automation", "prompt", "machine learning"],
  growth: ["growth", "audience", "followers", "community", "creator", "personal brand"],
  marketing: ["marketing", "seo", "ads", "brand", "demand", "funnel", "ppc"],
  saas: ["saas", "product", "startup", "b2b", "founder", "onboarding"],
  dev: ["dev", "developer", "code", "engineering", "javascript", "software", "web"],
  design: ["design", "ux", "ui", "creative", "figma"],
  finance: ["finance", "money", "invest", "wealth", "trading", "portfolio"],
  fitness: ["fitness", "health", "gym", "coach", "training"],
  ecommerce: ["ecom", "ecommerce", "shopify", "dtc", "store"],
  web3: ["web3", "defi", "crypto", "blockchain", "nft", "dao", "moderator"],
  operator: []
};

const NICHE_PROFILES = {
  ai: {
    label: "AI and Automation",
    audience: "founders and operations leaders",
    followerBias: 1.25,
    engagementBias: 1.18,
    hookBias: 1.16,
    desiredOutcomes: [
      "ship AI workflows that save five hours per week",
      "turn raw prompts into repeatable SOPs",
      "launch an AI-assisted offer without hiring a data team"
    ],
    pains: [
      "automating everything at once",
      "buying tools before mapping workflows",
      "publishing AI hype without proof"
    ],
    mechanisms: [
      "a 3-layer AI workflow stack",
      "prompt-to-process pipelines",
      "human-in-the-loop review loops"
    ],
    metrics: [
      "hours saved per week",
      "cost per completed task",
      "cycle time"
    ],
    beliefs: [
      "AI replaces entire teams",
      "you need a data science team first",
      "automation is too expensive to test"
    ],
    enemies: [
      "bloated tool stacks",
      "fake AI hype",
      "fragile no-code automations"
    ],
    proof: [
      "before/after workflow screenshots",
      "time saved dashboards",
      "small pilot results"
    ],
    ctas: [
      "ask for the workflow checklist",
      "request the AI stack breakdown",
      "DM me AI for the template"
    ]
  },

  web3: {
    label: "Web3 and Crypto",
    audience: "builders and DeFi operators",
    followerBias: 1.20,
    engagementBias: 1.25,
    hookBias: 1.15,
    desiredOutcomes: [
      "build protocols that survive market cycles",
      "turn liquidity into sustainable TVL",
      "create governance that actually works"
    ],
    pains: [
      "rug pull fears",
      "liquidity lockup mismanagement",
      "vampire attacks from competitors"
    ],
    mechanisms: [
      "vesting schedules with cliffs",
      "liquidity bootstrapping pools",
      "on-chain governance frameworks"
    ],
    metrics: [
      "TVL growth",
      "holder retention",
      "governance participation"
    ],
    beliefs: [
      "decentralization fixes everything",
      "token price equals success",
      "code is law without exceptions"
    ],
    enemies: [
      "centralized bridges",
      "opaque tokenomics",
      "extractive MEV bots"
    ],
    proof: [
      "on-chain analytics",
      "auditor reports",
      "governance vote records"
    ],
    ctas: [
      "ask for the tokenomics breakdown",
      "request the audit checklist",
      "DM me WEB3 for the framework"
    ]
  },

  growth: {
    label: "Audience Growth",
    audience: "creators and founders",
    followerBias: 1.18,
    engagementBias: 1.22,
    hookBias: 1.18,
    desiredOutcomes: [
      "grow an audience that converts",
      "turn followers into buyers",
      "build a repeatable content flywheel"
    ],
    pains: [
      "posting into the void",
      "chasing vanity followers",
      "repurposing content without a strategy"
    ],
    mechanisms: [
      "a weekly hook-test loop",
      "a 3-content pillar system",
      "a reply-driven distribution engine"
    ],
    metrics: [
      "save rate",
      "reply rate",
      "profile visit to follow conversion"
    ],
    beliefs: [
      "posting daily is enough",
      "virality is luck",
      "niching down limits growth"
    ],
    enemies: [
      "generic motivational posts",
      "engagement bait",
      "copycat content"
    ],
    proof: [
      "growth dashboards",
      "post-level analytics",
      "audience conversion screenshots"
    ],
    ctas: [
      "ask for the growth blueprint",
      "request the hook library",
      "DM me GROWTH for the system"
    ]
  },

  marketing: {
    label: "Demand Generation",
    audience: "marketers and small business owners",
    followerBias: 1.12,
    engagementBias: 1.10,
    hookBias: 1.12,
    desiredOutcomes: [
      "generate qualified demand",
      "turn attention into pipeline",
      "build a message that converts cold traffic"
    ],
    pains: [
      "burning budget on weak ads",
      "posting content with no offer",
      "targeting everyone at once"
    ],
    mechanisms: [
      "a message-market matrix",
      "a 4-touch nurture sequence",
      "a proof-first landing page"
    ],
    metrics: [
      "cost per qualified lead",
      "click-to-conversation rate",
      "offer conversion rate"
    ],
    beliefs: [
      "more traffic fixes everything",
      "brand awareness is unmeasurable",
      "funnels are dead"
    ],
    enemies: [
      "spray-and-pray advertising",
      "discount addiction",
      "message fatigue"
    ],
    proof: [
      "campaign screenshots",
      "lead quality reports",
      "before/after conversion rates"
    ],
    ctas: [
      "ask for the demand checklist",
      "request the offer teardown",
      "DM me DEMAND for the framework"
    ]
  },

  saas: {
    label: "SaaS and Product",
    audience: "SaaS founders and product operators",
    followerBias: 1.16,
    engagementBias: 1.08,
    hookBias: 1.10,
    desiredOutcomes: [
      "activate users faster",
      "convert trials into paying customers",
      "build a product-led growth engine"
    ],
    pains: [
      "shipping features nobody adopts",
      "onboarding users without aha moments",
      "pricing before positioning"
    ],
    mechanisms: [
      "a time-to-value onboarding map",
      "a weekly activation experiment",
      "a usage-based segmentation model"
    ],
    metrics: [
      "activation rate",
      "trial-to-paid conversion",
      "net revenue retention"
    ],
    beliefs: [
      "more features equals growth",
      "product-led means no sales",
      "churn is a support problem"
    ],
    enemies: [
      "feature bloat",
      "empty trial signups",
      "undifferentiated positioning"
    ],
    proof: [
      "activation dashboards",
      "customer success stories",
      "churn reduction reports"
    ],
    ctas: [
      "ask for the activation map",
      "request the pricing audit",
      "DM me SAAS for the checklist"
    ]
  },

  dev: {
    label: "Developer and Engineering",
    audience: "developers and technical builders",
    followerBias: 1.08,
    engagementBias: 1.12,
    hookBias: 1.08,
    desiredOutcomes: [
      "ship side projects that get users",
      "turn technical skill into income",
      "build a public portfolio that attracts offers"
    ],
    pains: [
      "building in private forever",
      "overengineering simple ideas",
      "sharing tutorials without positioning"
    ],
    mechanisms: [
      "a weekly build-in-public loop",
      "a 3-layer proof stack",
      "a niche technical content engine"
    ],
    metrics: [
      "demo signups",
      "repo stars that convert",
      "inbound recruiter messages"
    ],
    beliefs: [
      "code quality alone gets noticed",
      "marketing is manipulation",
      "side projects must be original"
    ],
    enemies: [
      "tutorial hell",
      "resume-driven development",
      "invisible shipping"
    ],
    proof: [
      "live demos",
      "architecture breakdowns",
      "before/after performance wins"
    ],
    ctas: [
      "ask for the build plan",
      "request the repo checklist",
      "DM me DEV for the system"
    ]
  },

  design: {
    label: "Design and Creative",
    audience: "designers and creative operators",
    followerBias: 1.05,
    engagementBias: 1.15,
    hookBias: 1.09,
    desiredOutcomes: [
      "attract higher-quality clients",
      "turn design work into repeatable retainers",
      "build a portfolio that sells outcomes"
    ],
    pains: [
      "posting pretty shots without context",
      "competing on price",
      "selling deliverables instead of business impact"
    ],
    mechanisms: [
      "a case-study teardown series",
      "a client-proof content loop",
      "a conversion-focused portfolio structure"
    ],
    metrics: [
      "qualified client inquiries",
      "retainer conversion rate",
      "project close rate"
    ],
    beliefs: [
      "good design sells itself",
      "clients only care about visuals",
      "niche work limits creativity"
    ],
    enemies: [
      "template-first design",
      "discount client acquisition",
      "aesthetic-only portfolios"
    ],
    proof: [
      "before/after redesigns",
      "client outcome metrics",
      "process walkthroughs"
    ],
    ctas: [
      "ask for the portfolio checklist",
      "request the client intake template",
      "DM me DESIGN for the framework"
    ]
  },

  finance: {
    label: "Finance and Wealth",
    audience: "investors and personal finance operators",
    followerBias: 1.10,
    engagementBias: 1.05,
    hookBias: 1.07,
    desiredOutcomes: [
      "build durable wealth systems",
      "turn financial knowledge into action",
      "create a repeatable saving and investing loop"
    ],
    pains: [
      "chasing hot tips",
      "overcomplicating portfolios",
      "consuming advice without execution"
    ],
    mechanisms: [
      "a rules-based allocation system",
      "a monthly financial review",
      "a behavioral guardrail checklist"
    ],
    metrics: [
      "savings rate",
      "net worth consistency",
      "drawdown discipline"
    ],
    beliefs: [
      "timing beats consistency",
      "complex products signal intelligence",
      "cash is always safe"
    ],
    enemies: [
      "hype-driven trading",
      "fee-heavy products",
      "financial procrastination"
    ],
    proof: [
      "portfolio reviews",
      "net worth trend charts",
      "decision journals"
    ],
    ctas: [
      "ask for the review checklist",
      "request the allocation template",
      "DM me MONEY for the system"
    ]
  },

  fitness: {
    label: "Fitness and Health",
    audience: "coaches and busy professionals",
    followerBias: 1.07,
    engagementBias: 1.20,
    hookBias: 1.08,
    desiredOutcomes: [
      "build consistent training habits",
      "turn discipline into visible results",
      "create a health system that survives busy weeks"
    ],
    pains: [
      "starting over every Monday",
      "chasing advanced programs too early",
      "relying on motivation instead of systems"
    ],
    mechanisms: [
      "a minimum-effective-dose routine",
      "a habit-stacking checklist",
      "a weekly recovery audit"
    ],
    metrics: [
      "workout adherence rate",
      "energy levels",
      "strength trend"
    ],
    beliefs: [
      "perfect plans beat consistency",
      "more volume equals faster results",
      "one bad week ruins progress"
    ],
    enemies: [
      "all-or-nothing thinking",
      "program hopping",
      "ego lifting"
    ],
    proof: [
      "progress photos",
      "adherence streaks",
      "client habit dashboards"
    ],
    ctas: [
      "ask for the starter routine",
      "request the habit tracker",
      "DM me FIT for the plan"
    ]
  },

  ecommerce: {
    label: "Ecommerce and DTC",
    audience: "DTC founders and ecommerce operators",
    followerBias: 1.11,
    engagementBias: 1.06,
    hookBias: 1.07,
    desiredOutcomes: [
      "increase repeat purchase rate",
      "turn traffic into profitable orders",
      "build an offer customers remember"
    ],
    pains: [
      "buying traffic without retention",
      "discounting to make sales",
      "testing creatives without a message hierarchy"
    ],
    mechanisms: [
      "a retention-first funnel",
      "a 3-offer product ladder",
      "a post-purchase story sequence"
    ],
    metrics: [
      "repeat purchase rate",
      "average order value",
      "contribution margin"
    ],
    beliefs: [
      "more traffic fixes margin",
      "discounts are the fastest lever",
      "brand is only visuals"
    ],
    enemies: [
      "discount addiction",
      "weak product storytelling",
      "one-time-buyer economics"
    ],
    proof: [
      "repeat purchase reports",
      "creative testing results",
      "unboxing testimonials"
    ],
    ctas: [
      "ask for the retention checklist",
      "request the offer ladder",
      "DM me DTC for the framework"
    ]
  },

  operator: {
    label: "Digital Operations",
    audience: "founders, operators, and independent builders",
    followerBias: 1.00,
    engagementBias: 1.00,
    hookBias: 1.00,
    desiredOutcomes: [
      "build a repeatable growth system",
      "turn attention into revenue",
      "ship proof-driven content with less effort"
    ],
    pains: [
      "posting without a positioning angle",
      "switching tactics too often",
      "measuring activity instead of outcomes"
    ],
    mechanisms: [
      "a weekly proof loop",
      "a 3-pillar content engine",
      "a public accountability cadence"
    ],
    metrics: [
      "qualified conversations",
      "conversion rate",
      "saved hours"
    ],
    beliefs: [
      "volume alone wins",
      "niching is restrictive",
      "quality cannot be systemized"
    ],
    enemies: [
      "noise-first content",
      "copycat tactics",
      "vanity metrics"
    ],
    proof: [
      "documented experiments",
      "before/after results",
      "process screenshots"
    ],
    ctas: [
      "ask for the operating checklist",
      "request the growth system",
      "DM me OPS for the breakdown"
    ]
  }
};

function clean(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function sanitizeText(value) {
  return clean(value)
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function sendJson(res, status, payload) {
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(payload);
}

function getRequestBody(req) {
  if (!req.body) return {};

  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  if (typeof req.body === "object") {
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(req.body)) {
      try {
        return JSON.parse(req.body.toString("utf8"));
      } catch {
        return {};
      }
    }

    return req.body;
  }

  return {};
}

function normalizeUsername(value) {
  const username = clean(value).replace(/^@+/, "");
  return USERNAME_REGEX.test(username) ? username : "";
}

function clamp(value, min, max) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return min;

  return Math.min(Math.max(parsed, min), max);
}

function round2(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  return Number(parsed.toFixed(2));
}

function formatNumber(value) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return "0";

  return new Intl.NumberFormat("en-US").format(parsed);
}

function parseDate(value) {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function hashSeed(input) {
  const digest = crypto
    .createHash("sha256")
    .update(String(input))
    .digest("hex");

  return parseInt(digest.slice(0, 12), 16) % 2147483647;
}

function mulberry32(seed) {
  let a = seed;

  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;

    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr, fallback = "") {
  if (!Array.isArray(arr) || arr.length === 0) return fallback;

  return arr[Math.floor(rng() * arr.length)];
}

function titleCase(text) {
  const words = clean(text)
    .replace(/[<>]/g, "")
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) return "Your Niche";

  return words
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function shannonEntropy(text) {
  const input = String(text || "");

  if (!input) return 0;

  const counts = {};

  for (const char of input) {
    counts[char] = (counts[char] || 0) + 1;
  }

  let entropy = 0;
  const length = input.length;

  for (const key of Object.keys(counts)) {
    const probability = counts[key] / length;
    entropy -= probability * Math.log2(probability);
  }

  return entropy;
}

function createCustomNiche(topic) {
  const label = titleCase(topic);
  const lowerLabel = label.toLowerCase();

  return {
    label,
    audience: `${lowerLabel} operators and builders`,
    followerBias: 1.02,
    engagementBias: 1.04,
    hookBias: 1.02,
    desiredOutcomes: [
      `win attention in ${lowerLabel}`,
      `turn ${lowerLabel} insights into pipeline`,
      `build a repeatable ${lowerLabel} system`
    ],
    pains: [
      `chasing generic ${lowerLabel} advice`,
      "posting without a repeatable system",
      "buying tools before defining the workflow"
    ],
    mechanisms: [
      "a weekly proof loop",
      "a 3-part insight stack",
      "a public build log"
    ],
    metrics: [
      "qualified conversations",
      "save rate",
      "outbound replies"
    ],
    beliefs: [
      "posting more is the only lever",
      "the niche is too saturated",
      "quality cannot be systemized"
    ],
    enemies: [
      "noise-first content",
      "copycat tactics",
      "vanity metrics"
    ],
    proof: [
      "screenshots of results",
      "before/after comparisons",
      "mini case notes"
    ],
    ctas: [
      "ask for the playbook",
      "request the checklist",
      "DM a keyword for the framework"
    ]
  };
}

function inferNiche(username, body, bioText) {
  const explicitTopic = sanitizeText(
    body.topic || body.niche || body.cluster || body.industry || ""
  );

  const haystack = `${explicitTopic} ${username} ${bioText}`.toLowerCase();

  for (const [key, keywords] of Object.entries(NICHE_KEYWORDS)) {
    if (key === "operator") continue;
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return {
        key,
        ...NICHE_PROFILES[key]
      };
    }
  }

  if (explicitTopic) {
    return {
      key: "custom",
      ...createCustomNiche(explicitTopic)
    };
  }

  return {
    key: "operator",
    ...NICHE_PROFILES.operator
  };
}

async function fetchLiveXProfile(username) {
  const bearer = clean(
    process.env.X_BEARER_TOKEN ||
      process.env.X_ANALYZE_BEARER_TOKEN ||
      process.env.TWITTER_BEARER_TOKEN
  );

  if (!bearer) {
    return {
      profile: null,
      error: "No X API bearer token configured. Set X_BEARER_TOKEN environment variable."
    };
  }

  if (typeof fetch !== "function" || typeof AbortController !== "function") {
    return {
      profile: null,
      error: "Fetch API not available in this environment."
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/by/username/${encodeURIComponent(
        username
      )}?user.fields=public_metrics,description,created_at,verified,entities`,
      {
        headers: {
          Authorization: `Bearer ${bearer}`
        },
        signal: controller.signal
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error");
      return {
        profile: null,
        error: `X API returned ${response.status}: ${errorText}`
      };
    }

    const json = await response.json().catch(() => ({}));

    if (!json?.data) {
      return {
        profile: null,
        error: "X API returned no user data."
      };
    }

    return {
      profile: json.data,
      error: null
    };
  } catch (error) {
    return {
      profile: null,
      error: `Fetch failed: ${error.message || "Network error"}`
    };
  } finally {
    clearTimeout(timeout);
  }
}

function parseFootprint(body) {
  const raw =
    body.posts ||
    body.tweets ||
    body.footprint ||
    body.contentFootprint ||
    [];

  let items = [];

  if (Array.isArray(raw)) {
    items = raw;
  } else if (typeof raw === "string") {
    items = raw.split(/\n{2,}/).map((block) => ({ text: block }));
  }

  const posts = items
    .map((item) => {
      if (typeof item === "string") return item;

      if (item && typeof item === "object") {
        return item.text || item.full_text || item.content || item.body || "";
      }

      return "";
    })
    .map(clean)
    .filter(Boolean)
    .slice(0, 100);

  if (!posts.length) return null;

  const hookRegex =
    /(how|why|stop|start|secret|mistake|proof|framework|thread|nobody|everyone|if you|don't|data|results|warning|free|new)/i;

  const ctaRegex =
    /(follow|reply|repost|share|save|bookmark|click|subscribe|join|dm|comment|check out)/i;

  let hookScoreSum = 0;
  let questionCount = 0;
  let ctaCount = 0;
  let lengthSum = 0;

  for (const text of posts) {
    const firstLine = text.split(/\r?\n/)[0].slice(0, 120).toLowerCase();

    let hookScore = 18;

    if (firstLine.includes("?")) hookScore += 16;
    if (/\d/.test(firstLine)) hookScore += 10;
    if (hookRegex.test(firstLine)) hookScore += 24;
    if (firstLine.length >= 25 && firstLine.length <= 90) hookScore += 12;
    if (ctaRegex.test(firstLine)) hookScore += 6;
    if (firstLine.length < 12) hookScore -= 14;

    hookScoreSum += clamp(Math.round(hookScore), 0, 100);
    lengthSum += text.length;

    if (text.includes("?")) questionCount += 1;
    if (ctaRegex.test(text)) ctaCount += 1;
  }

  return {
    totalPosts: posts.length,
    avgHookScore: hookScoreSum / posts.length,
    avgLength: lengthSum / posts.length,
    questionRate: questionCount / posts.length,
    ctaRate: ctaCount / posts.length
  };
}

function computeBotScore(username, metrics, noise, engagementRate) {
  let score = 5 + noise;

  const digitCount = (username.match(/\d/g) || []).length;

  if (digitCount >= 3) score += 18;
  else if (digitCount >= 1) score += 6;

  if (username.length >= 14) score += 7;

  const entropy = shannonEntropy(username);

  if (entropy > 3.1) score += 8;
  else if (entropy > 2.7) score += 4;

  const followRatio =
    metrics.followingCount / Math.max(metrics.followerCount, 1);

  if (followRatio > 3) score += 24;
  else if (followRatio > 1.5) score += 14;
  else if (followRatio > 0.8) score += 6;

  if (metrics.postsPerWeek > 35) score += 14;
  else if (metrics.postsPerWeek > 18) score += 7;

  if (engagementRate !== null) {
    if (engagementRate > 9 && metrics.followerCount < 800) score += 12;
    if (engagementRate < 0.15 && metrics.followerCount > 5000) score += 5;
  }

  return Math.round(clamp(score, 1, 98));
}

function buildMetrics(username, profile, niche, rng, source, footprint) {
  const followerCount = Math.max(
    0,
    Math.floor(profile.public_metrics?.followers_count ?? 0)
  );

  const followingCount = Math.max(
    0,
    Math.floor(profile.public_metrics?.following_count ?? 0)
  );

  const tweetCount = Math.max(
    0,
    Math.floor(profile.public_metrics?.tweet_count ?? 0)
  );

  const createdAt = parseDate(profile.created_at) || new Date();

  const accountAgeDays = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / 86400000)
  );

  const postsPerWeek = clamp(
    (tweetCount / accountAgeDays) * 7,
    0,
    350
  );

  const verified = Boolean(profile.verified);

  const preliminaryMetrics = {
    followerCount,
    followingCount,
    tweetCount,
    accountAgeDays,
    postsPerWeek,
    verified
  };

  const botNoise = Math.floor(rng() * 16);

  const preliminaryBotScore = computeBotScore(
    username,
    preliminaryMetrics,
    botNoise,
    null
  );

  let engagementRate = (0.85 + rng() * 5.6) * niche.engagementBias;

  if (followerCount > 100000) engagementRate *= 0.52;
  else if (followerCount > 25000) engagementRate *= 0.70;
  else if (followerCount < 1000) engagementRate *= 1.25;

  if (postsPerWeek < 1) engagementRate *= 0.74;
  else if (postsPerWeek > 8) engagementRate *= 1.08;

  if (preliminaryBotScore > 65) engagementRate *= 0.48;
  else if (preliminaryBotScore > 45) engagementRate *= 0.82;

  if (verified) engagementRate *= 1.15;

  if (footprint) {
    engagementRate *=
      1 +
      (footprint.avgHookScore / 100) * 0.18 +
      footprint.questionRate * 0.12 +
      footprint.ctaRate * 0.08;
  }

  engagementRate = round2(clamp(engagementRate, 0.08, 14.75));

  const botScore = computeBotScore(
    username,
    preliminaryMetrics,
    botNoise,
    engagementRate
  );

  let hookRating =
    32 +
    engagementRate * 5.25 +
    niche.hookBias * 9 +
    rng() * 16;

  if (footprint) {
    hookRating +=
      footprint.avgHookScore * 0.18 +
      footprint.questionRate * 8 +
      footprint.ctaRate * 6;
  }

  if (botScore > 65) hookRating -= 15;
  else if (botScore > 45) hookRating -= 8;

  if (postsPerWeek < 0.6) hookRating -= 8;
  if (followerCount < 400 && engagementRate < 1) hookRating -= 7;
  if (footprint && footprint.avgLength < 45) hookRating -= 6;

  hookRating = Math.round(clamp(hookRating, 3, 99));

  return {
    source,
    followerCount,
    followingCount,
    tweetCount,
    accountAgeDays,
    postsPerWeek: round2(postsPerWeek),
    engagementRate,
    botScore,
    hookRating,
    verified,
    footprint
  };
}

function buildStrategyBadge(metrics, niche) {
  if (metrics.botScore >= 70) {
    return "Spam Risk Containment";
  }

  if (niche.key === "web3") {
    if (metrics.engagementRate >= 4.5 && metrics.followerCount >= 10000) {
      return "Web3 Community Architect Vector";
    }
    if (metrics.followerCount < 2500) {
      return "DeFi Protocol Bootstrap";
    }
    return "Web3 Infrastructure Builder";
  }

  if (metrics.followerCount < 800 && metrics.engagementRate < 1.2) {
    return "Ghost Account Recovery";
  }

  if (metrics.engagementRate >= 5.5 && metrics.hookRating >= 75) {
    return "Viral Momentum Engine";
  }

  if (metrics.followerCount >= 50000 && metrics.engagementRate < 2.0) {
    return "Reach-Rich Engagement Leak";
  }

  if (metrics.hookRating >= 70 && metrics.engagementRate >= 3.2) {
    return "Authority Builder";
  }

  if (metrics.postsPerWeek < 1.5) {
    return "Consistency Repair";
  }

  return "Growth Foundation";
}

function buildFailureDiagnosis(username, metrics, niche) {
  const lines = [];

  lines.push(
    `${metrics.source} snapshot for @${username}: ${formatNumber(
      metrics.followerCount
    )} followers, ${metrics.engagementRate}% engagement, ${
      metrics.botScore
    }/100 bot/spam probability, ${metrics.postsPerWeek} posts/week lifetime average${
      metrics.verified ? " (verified account)" : ""
    }.`
  );

  const issues = [];

  if (metrics.botScore >= 65) {
    issues.push(
      "High bot/spam probability is likely throttling reach. Reduce repetitive posting, remove mass follow behavior, and slow down link-heavy content."
    );
  } else if (metrics.botScore >= 45) {
    issues.push(
      "Moderate spam signals are present. Normalize posting cadence and increase human replies to rebuild trust."
    );
  }

  if (metrics.engagementRate < 1.2) {
    issues.push(
      "Engagement rate is too low for the algorithm to amplify the account. Switch to question-led hooks and reply-driven distribution."
    );
  } else if (metrics.engagementRate < 2.5) {
    issues.push(
      "Engagement is stable but not strong enough for viral distribution. Increase proof, specificity, and conversational CTAs."
    );
  }

  if (metrics.hookRating < 55) {
    issues.push(
      "Hooks are underperforming. Rewrite the first line to contain a number, contradiction, or direct call-out."
    );
  }

  if (metrics.postsPerWeek < 1.5) {
    issues.push(
      "Cadence is too low to create algorithmic momentum. Publish 3-5 original posts per week for 21 days."
    );
  }

  if (metrics.followerCount < 1000) {
    issues.push(
      "The account lacks social proof. Use niche replies, borrowed audiences, and pinned proof to accelerate the first flywheel."
    );
  }

  if (metrics.followerCount > 50000 && metrics.engagementRate < 2) {
    issues.push(
      "The account has reach but weak resonance. Reposition content around a sharper point of view and audience-specific pain."
    );
  }

  if (!issues.length) {
    issues.push(
      "No major structural weakness detected. The next unlock is consistency, stronger proof loops, and more distinctive conviction."
    );
  }

  lines.push("Diagnosed constraints:");

  issues.forEach((issue) => {
    lines.push(`- ${issue}`);
  });

  lines.push(
    `Primary objective for ${niche.label}: move the account toward ${
      niche.desiredOutcomes[0]
    } while keeping spam risk below 35.`
  );

  return lines.join("\n");
}

function buildRecommendations(metrics, niche, rng) {
  const recommendations = [];

  recommendations.push({
    step: 1,
    title: "Sharpen the positioning promise",
    action: `Rewrite the bio and pinned post around this promise: help ${
      niche.audience
    } ${pick(rng, niche.desiredOutcomes, "get a clear result")} without ${pick(
      rng,
      niche.pains,
      "avoidable friction"
    )}.`,
    expectedImpact:
      "Improves profile conversion and gives every post a clearer promise."
  });

  if (metrics.botScore >= 55) {
    recommendations.push({
      step: 2,
      title: "De-risk account behavior",
      action:
        "Reduce automation, remove mass follow/unfollow patterns, space posts by at least 90 minutes, and answer 10 niche posts daily with non-link replies.",
      expectedImpact:
        "Lowers bot/spam probability and restores distribution trust."
    });
  }

  if (metrics.hookRating < 65) {
    recommendations.push({
      step: 3,
      title: "Install a hook testing system",
      action:
        "Publish two hook variants per idea for 7 days: one counter-intuitive, one outcome-led. Track save and reply rate, then double down on the top 20%.",
      expectedImpact: "Raises hook rating and first-line stop rate."
    });
  }

  if (metrics.engagementRate < 3) {
    recommendations.push({
      step: 4,
      title: "Create a conversation loop",
      action: `End every post with a specific prompt tied to ${pick(
        rng,
        niche.metrics,
        "a core metric"
      )} and reply to every early response within 30 minutes.`,
      expectedImpact:
        "Boosts replies and signals that the account starts conversations."
    });
  }

  if (metrics.followerCount < 2500) {
    recommendations.push({
      step: 5,
      title: "Borrow distribution",
      action: `Leave 10 high-signal replies per day on large accounts in ${niche.label}. Each reply should add a tactic, metric, or proof point.`,
      expectedImpact: "Generates profile visits from adjacent audiences."
    });
  }

  recommendations.push({
    step: 6,
    title: "Publish proof assets",
    action: `Turn ${pick(
      rng,
      niche.proof,
      "results"
    )} into a visual post once per week and reference it in your pinned post.`,
    expectedImpact: "Increases trust and makes claims believable."
  });

  recommendations.push({
    step: 7,
    title: "Add a conversion path",
    action: `Use a soft CTA every third post: ${pick(
      rng,
      niche.ctas,
      "ask for the playbook"
    )}.`,
    expectedImpact: "Turns attention into follows, DMs, or list growth."
  });

  recommendations.push({
    step: 8,
    title: "Build a conviction series",
    action: `Publish one bold industry prediction every week about ${
      niche.label
    } and defend it with ${pick(rng, niche.metrics, "evidence")}.`,
    expectedImpact:
      "Creates a memorable point of view and attracts true believers."
  });

  return recommendations
    .slice(0, 8)
    .map((item, index) => ({
      ...item,
      step: index + 1
    }));
}

function buildSuggestedPosts(metrics, niche, rng) {
  const outcome = pick(
    rng,
    niche.desiredOutcomes,
    "build a repeatable growth system"
  );

  const pain = pick(rng, niche.pains, "low-leverage activity");
  const mechanism = pick(rng, niche.mechanisms, "a simple public system");
  const metric = pick(rng, niche.metrics, "qualified attention");
  const belief = pick(rng, niche.beliefs, "volume alone wins");
  const enemy = pick(rng, niche.enemies, "generic advice");
  const proof = pick(rng, niche.proof, "documented proof");
  const cta = pick(rng, niche.ctas, "ask for the breakdown");

  return [
    {
      format: "The Counter-Intuitive Hook",
      objective: "Pattern interrupt",
      post: `Most ${niche.audience} are still trying to ${pain}.\n\nThe faster path is ${mechanism}.\n\nThe uncomfortable truth: ${belief} is quietly killing your progress.\n\nDo this instead:\n1. Audit ${metric}\n2. Remove ${enemy}\n3. Execute until you ${outcome}\n\nIf you want the exact breakdown, ${cta}.`
    },
    {
      format: "The High-Signal Framework Thread",
      objective: "Authority",
      post: `How to ${outcome} without ${pain} (even if you are starting from zero):\n\n1/ Define the scoreboard: ${metric}.\n2/ Delete the default path: ${enemy}.\n3/ Install the system: ${mechanism}.\n4/ Publish proof: ${proof}.\n5/ Add a conversion loop: ${cta}.\n\nSave this. Execute step 1 today.`
    },
    {
      format: "The Bold Industry Conviction Statement",
      objective: "Positioning",
      post: `${niche.label} is about to split into two groups.\n\nThe first will keep ${pain} and blame the algorithm.\n\nThe second will use ${mechanism} to ${outcome} with ${metric} as the only scoreboard.\n\nMy conviction: within 12 months, accounts without ${proof} will become invisible.\n\nBuild the machine before the gap widens.`
    }
  ];
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return sendJson(res, 405, {
      error: "Method not allowed. Use POST."
    });
  }

  try {
    const body = getRequestBody(req);

    const username = normalizeUsername(
      body.username ?? body.user ?? body.handle ?? body.x_username
    );

    if (!username) {
      return sendJson(res, 400, {
        error:
          "A valid X username is required. Use 1 to 15 letters, numbers, or underscores."
      });
    }

    const seed = hashSeed(username.toLowerCase());
    const rng = mulberry32(seed);

    const { profile: liveProfile, error: fetchError } = await fetchLiveXProfile(username);

    if (!liveProfile) {
      return sendJson(res, 502, {
        error: `Failed to fetch live profile data: ${fetchError}`
      });
    }

    const bioText = clean(liveProfile.description || "");
    const niche = inferNiche(username, body, bioText);
    const footprint = parseFootprint(body);

    const metrics = buildMetrics(
      username,
      liveProfile,
      niche,
      rng,
      "live X API v2",
      footprint
    );

    const strategyBadge = buildStrategyBadge(metrics, niche);

    const failureDiagnosis = buildFailureDiagnosis(username, metrics, niche);

    const recommendations = buildRecommendations(metrics, niche, rng);

    const suggestedPosts = buildSuggestedPosts(metrics, niche, rng);

    return sendJson(res, 200, {
      strategyBadge,
      hookRating: metrics.hookRating,
      failureDiagnosis,
      followerCount: metrics.followerCount,
      engagementRate: metrics.engagementRate,
      botScore: metrics.botScore,
      verified: metrics.verified,
      recommendations,
      suggestedPosts
    });
  } catch (error) {
    console.error("analyze_handler_error", getErrorMessage(error));

    return sendJson(res, 500, {
      error: "Internal server error."
    });
  }
};

function getErrorMessage(error) {
  if (!error) return "Unexpected error.";

  if (typeof error === "string") return error;

  if (error instanceof Error) {
    return error.message || error.name || "Unexpected error.";
  }

  if (error.message) return String(error.message);
  if (error.detail) return String(error.detail);
  if (error.error) return String(error.error);

  try {
    return JSON.stringify(error);
  } catch {
    return "Unexpected error.";
  }
                       }

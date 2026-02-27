export { renderers } from '../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const prerender = false;
const KV_TTL_SECONDS = 30 * 24 * 60 * 60;
function normalizeKey(model, year) {
  const m = String(model || "unknown").toLowerCase().replace(/\s+/g, "");
  const y = String(year || "unknown").toLowerCase();
  return `known-aliases:${m}:${y}`;
}
function deduplicateAliases(aliases) {
  const seen = /* @__PURE__ */ new Set();
  return aliases.filter((a) => {
    const key = `${a.objectId}|${a.instanceId}|${a.resourceId}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function getRedisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL || (typeof import.meta !== "undefined" ? Object.assign(__vite_import_meta_env__, { _: process.env._ })?.UPSTASH_REDIS_REST_URL : void 0);
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || (typeof import.meta !== "undefined" ? Object.assign(__vite_import_meta_env__, { _: process.env._ })?.UPSTASH_REDIS_REST_TOKEN : void 0);
  return { url, token };
}
async function redisGet(key) {
  const { url, token } = getRedisConfig();
  if (!url || !token) return null;
  const res = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.result === null) return null;
  try {
    return JSON.parse(data.result);
  } catch {
    return null;
  }
}
async function redisSet(key, value) {
  const { url, token } = getRedisConfig();
  if (!url || !token) return false;
  const body = ["SET", key, JSON.stringify(value), "EX", KV_TTL_SECONDS];
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([body])
  });
  return res.ok;
}
const GET = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const model = url.searchParams.get("model");
    const year = url.searchParams.get("year");
    if (!model) {
      return new Response(JSON.stringify({ error: "model is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const { url: redisUrl } = getRedisConfig();
    if (!redisUrl) {
      return new Response(JSON.stringify({ aliases: [], source: "no-kv" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const key = normalizeKey(model, year);
    const raw = await redisGet(key);
    if (!raw || !Array.isArray(raw.aliases)) {
      return new Response(JSON.stringify({ aliases: [], source: "cache-miss" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        aliases: raw.aliases,
        lastUpdated: raw.lastUpdated,
        discoveredBy: raw.discoveredBy,
        source: "kv"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    console.error("GET /api/known-aliases error:", e);
    return new Response(JSON.stringify({ aliases: [], error: e.message }), {
      status: 200,
      // Graceful fallback
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async ({ request, cookies }) => {
  try {
    const accessToken = cookies.get("access_token")?.value;
    if (!accessToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    const body = await request.json();
    const { model, year, aliases } = body;
    if (!model || !Array.isArray(aliases) || aliases.length === 0) {
      return new Response(
        JSON.stringify({ error: "model and aliases[] are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const { url: redisUrl } = getRedisConfig();
    if (!redisUrl) {
      return new Response(JSON.stringify({ error: "KV not available" }), {
        status: 503,
        headers: { "Content-Type": "application/json" }
      });
    }
    const key = normalizeKey(model, year);
    const existing = await redisGet(key) || { aliases: [] };
    const existingAliases = Array.isArray(existing.aliases) ? existing.aliases : [];
    const validNew = aliases.filter((a) => a.objectId && a.resourceId).map((a) => ({
      objectId: String(a.objectId),
      instanceId: String(a.instanceId || "0"),
      resourceId: String(a.resourceId),
      alias: a.alias || ""
    }));
    const merged = deduplicateAliases([...existingAliases, ...validNew]);
    const payload = {
      aliases: merged,
      discoveredBy: body.discoveredBy || "anonymous",
      lastUpdated: Date.now()
    };
    await redisSet(key, payload);
    return new Response(
      JSON.stringify({
        success: true,
        count: merged.length,
        added: merged.length - existingAliases.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (e) {
    console.error("POST /api/known-aliases error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

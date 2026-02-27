import { D as DEFAULT_REGION, R as REGIONS, A as API_HEADERS } from '../../../chunks/vinfast_CFfXFdrx.mjs';
import crypto from 'crypto';
export { renderers } from '../../../renderers.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const prerender = false;
const ALLOWED_PATH_PREFIXES = [
  "ccarusermgnt/api/v1/user-vehicle",
  "ccarusermgnt/api/v1/service-history",
  "ccarusermgnt/api/v1/service-appointments",
  "ccarbookingservice/api/v1/c-app/appointment/",
  "ccarbookingservice/api/v1/c-app/showroom/",
  "modelmgmt/api/v2/vehicle-model/",
  "ccaraccessmgmt/api/v1/telemetry/",
  "ccarcharging/api/v1/stations/",
  "ccarcharging/api/v1/charging-sessions/search"
];
const SIGNED_PATH_PREFIXES = ["ccaraccessmgmt/", "ccarcharging/"];
function generateXHash(method, apiPath, vin, timestamp, secretKey) {
  const pathWithoutQuery = apiPath.split("?")[0];
  const normalizedPath = pathWithoutQuery.startsWith("/") ? pathWithoutQuery : "/" + pathWithoutQuery;
  const parts = [method, normalizedPath];
  if (vin) {
    parts.push(vin);
  }
  parts.push(secretKey);
  parts.push(String(timestamp));
  const message = parts.join("_").toLowerCase();
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
}
function generateXHash2({
  platform,
  vinCode,
  identifier,
  path,
  method,
  timestamp
}) {
  let normalizedPath = path;
  if (normalizedPath.startsWith("/")) {
    normalizedPath = normalizedPath.substring(1);
  }
  normalizedPath = normalizedPath.replace(/\//g, "_");
  const parts = [platform];
  if (vinCode) {
    parts.push(vinCode);
  }
  parts.push(identifier);
  parts.push(normalizedPath);
  parts.push(method);
  parts.push(String(timestamp));
  const message = parts.join("_").toLowerCase();
  const hash2Key = "ConnectedCar@6521";
  const hmac = crypto.createHmac("sha256", hash2Key);
  hmac.update(message);
  return hmac.digest("base64");
}
const ALL = async ({ request, params, cookies, locals }) => {
  const apiPath = params.path;
  if (apiPath.includes("..") || apiPath.includes("//") || apiPath.startsWith("/")) {
    return new Response(JSON.stringify({ error: "Invalid API path" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const isAllowedPath = ALLOWED_PATH_PREFIXES.some(
    (prefix) => apiPath.startsWith(prefix)
  );
  if (!isAllowedPath) {
    return new Response(JSON.stringify({ error: "Proxy path not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" }
    });
  }
  const urlObj = new URL(request.url);
  const region = urlObj.searchParams.get("region") || DEFAULT_REGION;
  const regionConfig = REGIONS[region] || REGIONS[DEFAULT_REGION];
  const targetSearchParams = new URLSearchParams(urlObj.search);
  targetSearchParams.delete("region");
  const searchStr = targetSearchParams.toString();
  const targetUrl = `${regionConfig.api_base}/${apiPath}${searchStr ? "?" + searchStr : ""}`;
  const accessToken = cookies.get("access_token")?.value;
  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const clientHeaders = request.headers;
  const vinHeader = clientHeaders.get("x-vin-code");
  const playerHeader = clientHeaders.get("x-player-identifier");
  let requestBody = null;
  if (request.method !== "GET" && request.method !== "HEAD") {
    requestBody = await request.text();
  }
  const requiresSigning = SIGNED_PATH_PREFIXES.some(
    (prefix) => apiPath.startsWith(prefix)
  );
  const proxyHeaders = {
    ...API_HEADERS,
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`
  };
  if (requiresSigning) {
    const runtimeEnv = locals?.runtime?.env || Object.assign(__vite_import_meta_env__, { PATH: process.env.PATH, _: process.env._ }) || {};
    let secretKey = runtimeEnv.VINFAST_XHASH_SECRET || (typeof process !== "undefined" ? process.env.VINFAST_XHASH_SECRET : void 0);
    if (!secretKey && Object.assign(__vite_import_meta_env__, { PATH: process.env.PATH, _: process.env._ }).DEV) {
      secretKey = "Vinfast@2025";
      console.warn("DEV fallback: using default VINFAST_XHASH_SECRET.");
    }
    if (!secretKey) {
      console.error(
        "CRITICAL: VINFAST_XHASH_SECRET environment variable is missing"
      );
      return new Response(
        JSON.stringify({ error: "Server Configuration Error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const timestamp = Date.now();
    const xTimestamp = String(timestamp);
    const xHash = generateXHash(
      request.method,
      apiPath,
      vinHeader,
      timestamp,
      secretKey
    );
    const xHash2 = generateXHash2({
      platform: API_HEADERS["X-Device-Platform"],
      vinCode: vinHeader || null,
      identifier: API_HEADERS["X-Device-Identifier"],
      path: "/" + apiPath,
      method: request.method,
      timestamp: xTimestamp
    });
    proxyHeaders["X-HASH"] = xHash;
    proxyHeaders["X-HASH-2"] = xHash2;
    proxyHeaders["X-TIMESTAMP"] = xTimestamp;
    console.log(
      `[Proxy] Signed ${request.method} /${apiPath} with X-HASH + X-HASH-2`
    );
  }
  if (vinHeader) proxyHeaders["X-Vin-Code"] = vinHeader;
  if (playerHeader) proxyHeaders["X-Player-Identifier"] = playerHeader;
  const init = {
    method: request.method};
  if (requestBody) {
    init.body = requestBody;
  }
  let lastResponse = null;
  let lastData = null;
  const proxyLog = [];
  const fetchInit = { method: init.method, headers: { ...proxyHeaders } };
  if (requestBody) fetchInit.body = requestBody;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const t0 = Date.now();
      if (attempt === 0) console.log(`[Proxy] → ${request.method} ${targetUrl}`);
      lastResponse = await fetch(targetUrl, fetchInit);
      lastData = await lastResponse.text();
      const elapsed = Date.now() - t0;
      proxyLog.push({ via: attempt === 0 ? "direct" : "direct-retry", status: lastResponse.status, ms: elapsed });
      console.log(`[Proxy] ← direct${attempt > 0 ? " retry" : ""} ${lastResponse.status} (${elapsed}ms)`);
      if (lastResponse.status < 500) break;
      if (attempt === 0) console.warn(`[Proxy] 5xx — retrying once...`);
    } catch (e) {
      if (attempt === 1) {
        console.error(`[Proxy Error] ${request.method} /${apiPath}:`, e);
        return new Response(JSON.stringify({ error: "Internal Proxy Error" }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
      proxyLog.push({ via: "direct", status: "error", error: e.message });
    }
  }
  if (lastResponse.status === 429 || lastResponse.status >= 500) {
    const runtimeEnv = locals?.runtime?.env || Object.assign(__vite_import_meta_env__, { PATH: process.env.PATH, _: process.env._ }) || {};
    const envKeys = [
      "BACKUP_PROXY_URL",
      "BACKUP_PROXY_URL_2",
      "BACKUP_PROXY_URL_3",
      "BACKUP_PROXY_URL_4",
      "BACKUP_PROXY_URL_5",
      "BACKUP_PROXY_URL_6",
      "BACKUP_PROXY_URL_7",
      "BACKUP_PROXY_URL_8",
      "BACKUP_PROXY_URL_9",
      "BACKUP_PROXY_URL_10",
      "BACKUP_PROXY_URL_11"
    ];
    const backupUrls = envKeys.map((k) => runtimeEnv[k] || (typeof process !== "undefined" ? process.env[k] : void 0)).filter(Boolean);
    for (let i = backupUrls.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [backupUrls[i], backupUrls[j]] = [backupUrls[j], backupUrls[i]];
    }
    for (const backupUrl of backupUrls) {
      try {
        const backupTarget = `${backupUrl.replace(/\/$/, "")}/api/vf-proxy/${apiPath}${searchStr ? "?" + searchStr : ""}`;
        const label = new URL(backupUrl).hostname.replace(".vercel.app", "").replace(".workers.dev", "");
        console.log(`[Proxy] 429 — failover to: ${label}`);
        const backupInit = {
          method: request.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          }
        };
        if (vinHeader) backupInit.headers["x-vin-code"] = vinHeader;
        if (playerHeader) backupInit.headers["x-player-identifier"] = playerHeader;
        if (requestBody) backupInit.body = requestBody;
        const t0 = Date.now();
        const backupResponse = await fetch(backupTarget, backupInit);
        const backupData = await backupResponse.text();
        const elapsed = Date.now() - t0;
        proxyLog.push({ via: label, status: backupResponse.status, ms: elapsed });
        console.log(`[Proxy] ← ${label} ${backupResponse.status} (${elapsed}ms)`);
        if (backupResponse.status !== 429 && backupResponse.status < 500) {
          return new Response(backupData, {
            status: backupResponse.status,
            headers: {
              "Content-Type": "application/json",
              "X-Proxy-Route": label,
              "X-Proxy-Log": JSON.stringify(proxyLog)
            }
          });
        }
      } catch (e) {
        proxyLog.push({ via: backupUrl, status: "error", error: e.message });
        console.warn(`[Proxy] Backup failed:`, e.message);
      }
    }
  }
  const servedBy = proxyLog.length > 1 ? `direct+${proxyLog.length - 1} backups (all failed)` : "direct";
  console.log(
    `[Proxy] ← ${lastResponse.status} (${lastData.length} bytes) for ${request.method} /${apiPath} [${servedBy}]`
  );
  if (lastResponse.status >= 400) {
    console.log(`[Proxy] Error body: ${lastData.substring(0, 500)}`);
  }
  return new Response(lastData, {
    status: lastResponse.status,
    headers: {
      "Content-Type": "application/json",
      "X-Proxy-Route": "direct",
      "X-Proxy-Log": JSON.stringify(proxyLog)
    }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

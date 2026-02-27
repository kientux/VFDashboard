import 'piccolore';
import { o as decodeKey } from './chunks/astro/server_BMw07akD.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_DcPIFoxR.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/kientux/devs/personal/VFDashboard/","cacheDir":"file:///Users/kientux/devs/personal/VFDashboard/node_modules/.astro/","outDir":"file:///Users/kientux/devs/personal/VFDashboard/dist/","srcDir":"file:///Users/kientux/devs/personal/VFDashboard/src/","publicDir":"file:///Users/kientux/devs/personal/VFDashboard/public/","buildClientDir":"file:///Users/kientux/devs/personal/VFDashboard/dist/client/","buildServerDir":"file:///Users/kientux/devs/personal/VFDashboard/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"login/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/login","isIndex":false,"type":"page","pattern":"^\\/login\\/?$","segments":[[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/login.astro","pathname":"/login","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/known-aliases","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/known-aliases\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"known-aliases","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/known-aliases.js","pathname":"/api/known-aliases","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/login","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/login\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"login","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/login.js","pathname":"/api/login","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/logout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/logout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/logout.js","pathname":"/api/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/mqtt-credentials","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/mqtt-credentials\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"mqtt-credentials","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/mqtt-credentials.js","pathname":"/api/mqtt-credentials","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/proxy/[...path]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/proxy(?:\\/(.*?))?\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"proxy","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"src/pages/api/proxy/[...path].js","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/refresh","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/refresh\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"refresh","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/refresh.js","pathname":"/api/refresh","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/user","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/user\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"user","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/user.js","pathname":"/api/user","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/kientux/devs/personal/VFDashboard/src/pages/index.astro",{"propagation":"none","containsHead":true}],["/Users/kientux/devs/personal/VFDashboard/src/pages/login.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/known-aliases@_@js":"pages/api/known-aliases.astro.mjs","\u0000@astro-page:src/pages/api/login@_@js":"pages/api/login.astro.mjs","\u0000@astro-page:src/pages/api/logout@_@js":"pages/api/logout.astro.mjs","\u0000@astro-page:src/pages/api/mqtt-credentials@_@js":"pages/api/mqtt-credentials.astro.mjs","\u0000@astro-page:src/pages/api/proxy/[...path]@_@js":"pages/api/proxy/_---path_.astro.mjs","\u0000@astro-page:src/pages/api/refresh@_@js":"pages/api/refresh.astro.mjs","\u0000@astro-page:src/pages/api/user@_@js":"pages/api/user.astro.mjs","\u0000@astro-page:src/pages/login@_@astro":"pages/login.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BV2WTmQR.mjs","/Users/kientux/devs/personal/VFDashboard/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_QD3Iuypq.mjs","/Users/kientux/devs/personal/VFDashboard/src/components/Login.jsx":"_astro/Login.BOJTtNNK.js","@astrojs/react/client.js":"_astro/client.dXHaCmHv.js","/Users/kientux/devs/personal/VFDashboard/src/components/ChargingHistoryDrawer.jsx":"_astro/ChargingHistoryDrawer.CRV2On5w.js","/Users/kientux/devs/personal/VFDashboard/src/components/TelemetryDrawer.jsx":"_astro/TelemetryDrawer.CRvOgOX4.js","/Users/kientux/devs/personal/VFDashboard/src/components/DashboardApp.jsx":"_astro/DashboardApp.BQQHhEvS.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/vf9-interior.9xlUGOM4.png","/_astro/index.Dqg3JmY4.css","/_headers","/android-chrome-192x192.png","/android-chrome-512x512.png","/apple-touch-icon.png","/favicon-16x16.png","/favicon-32x32.png","/favicon-96x96.png","/favicon.ico","/favicon.svg","/logo.png","/mobile-vf3-charging.webp","/mobile-vf3.webp","/mobile-vf9-energy.webp","/og-image.png","/site.webmanifest","/vf9-club-logo-new.png","/vinfast-logo.png","/web-app-manifest-192x192.png","/web-app-manifest-512x512.png","/_astro/ChargingHistoryDrawer.CRV2On5w.js","/_astro/DashboardApp.BHTQHLPf.js","/_astro/DashboardApp.BQQHhEvS.js","/_astro/Login.BOJTtNNK.js","/_astro/TelemetryDrawer.CRvOgOX4.js","/_astro/api.D8po6JNo.js","/_astro/client.dXHaCmHv.js","/_astro/index.DYrVU9rO.js","/login/index.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"AiQ8q7SqPdZ6xuNX9D/2wx9T5GsKic6GNy4cKMrliIk="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };

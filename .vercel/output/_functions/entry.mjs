import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CKQ3Y3tY.mjs';
import { manifest } from './manifest_BV2WTmQR.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/known-aliases.astro.mjs');
const _page2 = () => import('./pages/api/login.astro.mjs');
const _page3 = () => import('./pages/api/logout.astro.mjs');
const _page4 = () => import('./pages/api/mqtt-credentials.astro.mjs');
const _page5 = () => import('./pages/api/proxy/_---path_.astro.mjs');
const _page6 = () => import('./pages/api/refresh.astro.mjs');
const _page7 = () => import('./pages/api/user.astro.mjs');
const _page8 = () => import('./pages/login.astro.mjs');
const _page9 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/known-aliases.js", _page1],
    ["src/pages/api/login.js", _page2],
    ["src/pages/api/logout.js", _page3],
    ["src/pages/api/mqtt-credentials.js", _page4],
    ["src/pages/api/proxy/[...path].js", _page5],
    ["src/pages/api/refresh.js", _page6],
    ["src/pages/api/user.js", _page7],
    ["src/pages/login.astro", _page8],
    ["src/pages/index.astro", _page9]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "68e19736-e7db-4e3e-af5e-7b864de450bf",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };

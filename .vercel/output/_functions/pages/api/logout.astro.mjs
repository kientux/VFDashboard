export { renderers } from '../../renderers.mjs';

const prerender = false;

const POST = async ({ request, cookies }) => {
  const isLocalhost = new URL(request.url).hostname === "localhost";
  const clearOpts = {
    path: "/",
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: "lax",
    maxAge: 0,
  };

  cookies.set("access_token", "", clearOpts);
  cookies.set("refresh_token", "", clearOpts);
  cookies.set("vf_region", "", { path: "/", maxAge: 0 });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

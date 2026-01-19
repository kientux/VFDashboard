export const prerender = false;

import { REGIONS } from "../../config/vinfast";

export const POST = async ({ request }) => {
  try {
    const { refresh_token, region } = await request.json();

    if (!refresh_token) {
      return new Response(
        JSON.stringify({ error: "Refresh token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const regionConfig = REGIONS[region] || REGIONS["vn"];

    const url = `https://${regionConfig.auth0_domain}/oauth/token`;
    const payload = {
      client_id: regionConfig.auth0_client_id,
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

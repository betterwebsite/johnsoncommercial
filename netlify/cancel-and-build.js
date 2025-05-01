import fetch from "node-fetch";

export async function handler(event, context) {
  // ––– AUTHENTICATION –––
  const secret       = process.env.WEBHOOK_SECRET;
  const incoming     = event.headers["x-webhook-secret"] || "";
  if (incoming !== secret) {
    return {
      statusCode: 401,
      body: "⛔ Unauthorized",
    };
  }

  // ––– LIST & CANCEL EXISTING BUILDS –––
  const token        = process.env.NETLIFY_TOKEN;
  const siteId       = process.env.SITE_ID;
  const buildHook    = process.env.BUILD_HOOK_URL;

  const listRes      = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys?state=building`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const activeDeploys = await listRes.json();

  await Promise.all(activeDeploys.map(d =>
    fetch(
      `https://api.netlify.com/api/v1/deploys/${d.id}/cancel`,
      { method: "POST", headers: { Authorization: `Bearer ${token}` } }
    )
  ));

  // ––– TRIGGER LATEST BUILD –––
  await fetch(buildHook, { method: "POST" });

  return {
    statusCode: 200,
    body: "✅ Cancelled prior builds and queued latest build",
  };
}

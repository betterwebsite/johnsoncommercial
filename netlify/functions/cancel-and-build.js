// netlify/functions/cancel-and-build.js
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  // 1) Auth
  const secret   = process.env.WEBHOOK_SECRET;
  if (event.headers["x-webhook-secret"] !== secret) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  // 2) List & cancel
  const token    = process.env.NETLIFY_TOKEN;
  const siteId   = process.env.SITE_ID;
  const hookUrl  = process.env.BUILD_HOOK_URL;

  const listRes  = await fetch(
    `https://api.netlify.com/api/v1/sites/${siteId}/deploys?state=building`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const builds   = await listRes.json();
  await Promise.all(builds.map(d =>
    fetch(`https://api.netlify.com/api/v1/deploys/${d.id}/cancel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    })
  ));

  // 3) Trigger build
  await fetch(hookUrl, { method: "POST" });

  return { statusCode: 200, body: "✅ OK" };
};

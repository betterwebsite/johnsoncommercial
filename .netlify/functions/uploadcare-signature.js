const { triggerAsyncId } = require("async_hooks");
const crypto = require("crypto");

exports.handler = async function () {
  const secret = process.env.UPLOADCARE_SECRET_KEY;
  const expire = Math.floor(Date.now() / 1000) + 300; // valid for 5 min
  const token = JSON.stringify({ expire });

  const signature = crypto
    .createHmac("sha256", secret)
    .update(token)
    .digest("hex");

  return {
    statusCode: 200,
    body: JSON.stringify({
      secureSignature: signature,
      secureExpire: expire,
    }),
  };
};

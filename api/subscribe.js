const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function setCorsHeaders(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    req.headers.origin || "http://localhost:5173"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Accept"
  );
}

module.exports = async (req, res) => {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // Vercel sunucusunda req.body bazen otomatik parse edilmez, JSON parse etmeyi dene
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
  }

  const { email } = body || {};
  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const { data, error } = await supabase
    .from("subscribers")
    .insert([{ email, subscribed_at: new Date().toISOString() }]);

  if (error) {
    if (error.code === "23505") {
      res.status(409).json({ error: "This email is already subscribed" });
      return;
    }
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(200).json({ message: "Subscribed successfully", data });
}; 
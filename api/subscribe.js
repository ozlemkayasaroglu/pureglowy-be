const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email } = req.body || {};
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
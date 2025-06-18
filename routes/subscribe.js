const express = require("express");
const router = express.Router();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

router.post("/", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const { data, error } = await supabase
    .from("subscribers")
    .insert([{ email, subscribed_at: new Date().toISOString() }]);

  if (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({ error: "This email is already subscribed" });
    }
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: "Subscribed successfully", data });
});

module.exports = router;

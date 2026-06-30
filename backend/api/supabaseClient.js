const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY должны быть заданы");
}

// Используем service_role ключ для полного доступа к базе (серверный контекст)
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

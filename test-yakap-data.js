// Quick test to verify yakap_applications table data
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

// Read .env.local manually
const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");

// Parse environment variables
const envVars = {};
envContent.split("\n").forEach((line) => {
  if (line.trim() && !line.startsWith("#")) {
    const [key, ...rest] = line.split("=");
    envVars[key.trim()] = rest.join("=").trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  console.log("URL:", supabaseUrl ? "✓" : "✗");
  console.log("Key:", supabaseKey ? "✓" : "✗");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testYakakData() {
  console.log("Testing yakap_applications table...\n");

  // Test 1: Get all applications
  const { data, error, count } = await supabase
    .from("yakap_applications")
    .select("*", { count: "exact" });

  if (error) {
    console.error("❌ Error fetching applications:", error);
    return;
  }

  console.log(`✓ Found ${count || 0} yakap applications`);
  console.log("\nData sample:");
  if (data && data.length > 0) {
    console.log(JSON.stringify(data.slice(0, 3), null, 2));
  } else {
    console.log("No applications found in database");
  }
}

testYakakData().catch(console.error);

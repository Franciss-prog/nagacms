const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://mdebjryhdmodzhcpwdfn.supabase.co";
const supabaseKey = "sb_publishable_wdJHvvHiq-pIslUjMRkNsA_Jgl4VNxu";

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    console.log("Testing Supabase connection...");

    // Try to fetch facilities
    const { data, error } = await supabase
      .from("health_facilities")
      .select("id, name, barangay")
      .limit(5);

    if (error) {
      console.error("Error:", error);
    } else {
      console.log("Success! Found facilities:");
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error("Exception:", err);
  }
}

test();

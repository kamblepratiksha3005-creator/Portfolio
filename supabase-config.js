// Supabase SDK Configuration & Initialization via CDN ES Module import
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Replace these values with your actual Supabase Project configuration
const supabaseUrl = "https://bcmyjvtiobtymjsmebvm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjbXlqdnRpb2J0eW1qc21lYnZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3MzU4ODQsImV4cCI6MjEwMTMxMTg4NH0.oxAAFDc1ShE1Fo_EOrQRMawnSsn9Bv5xaOhibsW8_fY";

// Check if Supabase has been configured by the user
const isConfigured = supabaseUrl && supabaseUrl !== "YOUR_SUPABASE_PROJECT_URL" && supabaseAnonKey && supabaseAnonKey !== "YOUR_SUPABASE_ANON_PUBLIC_KEY";

let supabase = null;

if (isConfigured) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log("Supabase initialized successfully.");
    } catch (error) {
        console.error("Supabase initialization failed:", error);
    }
} else {
    console.warn("Supabase is not configured yet. The site will run in Demo Mode using synchronized localStorage data.");
}

export {
    supabase,
    isConfigured,
    supabaseUrl,
    supabaseAnonKey
};

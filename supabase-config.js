// FlyDeals — Supabase Configuration
// Shared across all pages

const SUPABASE_URL = 'https://erhlxomyatirrqhaxroh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyaGx4b215YXRpcnJxaGF4cm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTM5MTksImV4cCI6MjA4ODcyOTkxOX0.d10MQKOqSO8w9iEgK_tihQGixrHZLNEPL37CeJ3U-EE';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51T9S6wBH30TF6uROcvethaI0i1nDaH9mUvotyZALYQ9ytNeUkC9iWUdbbJcWMtVGNk1DTMD2ZEVs0P0FWtkhTIbF00ZwTWUIUb';
const STRIPE_PRICE_ID = 'price_1TCCV4BH30TF6uRO4Dshmthq'; // 149 NOK/mnd
const STRIPE_TRIAL_DAYS = 7;

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getUserProfile(userId) {
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  return data;
}

async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}

async function logout() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

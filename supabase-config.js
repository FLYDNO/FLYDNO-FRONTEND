// FlyDeals — Supabase Configuration
// Shared across all pages

const SUPABASE_URL = 'https://erhlxomyatirrqhaxroh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyaGx4b215YXRpcnJxaGF4cm9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTM5MTksImV4cCI6MjA4ODcyOTkxOX0.d10MQKOqSO8w9iEgK_tihQGixrHZLNEPL37CeJ3U-EE';
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51T9S6wBH30TF6uROcvethaI0i1nDaH9mUvotyZALYQ9ytNeUkC9iWUdbbJcWMtVGNk1DTMD2ZEVs0P0FWtkhTIbF00ZwTWUIUb';
const STRIPE_PRICE_ID = 'price_1TCCV4BH30TF6uRO4Dshmthq'; // 149 NOK/mnd
const STRIPE_TRIAL_DAYS = 7;

// Initialize Supabase client
var _sbCreateClient = (window.supabase && typeof window.supabase.createClient === 'function')
  ? window.supabase.createClient
  : null;

var supabase = _sbCreateClient
  ? _sbCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!supabase) {
  console.error('FlyDeals: Supabase SDK ikke lastet. window.supabase =', window.supabase);
}

// Auth helpers
async function getUser() {
  if (!supabase) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (e) {
    return null;
  }
}

async function getUserProfile(userId) {
  if (!supabase) return null;
  const { data } = await supabase.from('users').select('*').eq('id', userId).single();
  return data;
}

async function requireAuth() {
  const user = await getUser();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  // Auto-fill sidebar on every authenticated page
  fillSidebar(user);
  return user;
}

// Fill sidebar user card on all pages
async function fillSidebar(user) {
  if (!user) return;
  // Try profile from DB first, fallback to auth metadata
  const profile = await getUserProfile(user.id);
  const name = (profile && profile.name) || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Bruker';
  const email = (profile && profile.email) || user.email || '';

  document.querySelectorAll('.sidebar-user-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.sidebar-user-email').forEach(el => el.textContent = email);
}

// Ensure user has a complete profile row in users table
// on-auth-user-created hook may have already created a minimal row (id, email, subscription_active)
// This function fills in missing fields like name, country, preferred_airports
async function ensureUserProfile(user) {
  if (!user || !supabase) return null;
  const authName = user.user_metadata?.full_name || user.user_metadata?.name || '';
  const authEmail = user.email || '';
  let profile = await getUserProfile(user.id);

  if (!profile) {
    // No row at all — create one (edge case if hook didn't fire)
    await supabase.from('users').insert({
      id: user.id,
      name: authName,
      email: authEmail,
      country: 'NO',
      preferred_airports: ['OSL', 'BGO', 'TRD', 'SVG', 'TOS', 'TRF'],
      email_frequency: 'daily',
      subscription_active: false
    });
    profile = await getUserProfile(user.id);
  } else if (!profile.name && authName) {
    // Row exists (from hook) but missing name/details — update it
    const updates = {};
    if (!profile.name && authName) updates.name = authName;
    if (!profile.country) updates.country = 'NO';
    if (!profile.preferred_airports) updates.preferred_airports = ['OSL', 'BGO', 'TRD', 'SVG', 'TOS', 'TRF'];
    if (!profile.email_frequency) updates.email_frequency = 'daily';
    if (Object.keys(updates).length > 0) {
      await supabase.from('users').update(updates).eq('id', user.id);
      profile = await getUserProfile(user.id);
    }
  }
  return profile;
}

async function logout() {
  if (supabase) await supabase.auth.signOut();
  window.location.href = 'login.html';
}

function ensureSupabase() {
  if (!supabase) {
    alert('Kunne ikke koble til serveren. Vennligst last siden på nytt.');
    return false;
  }
  return true;
}

// Translate Supabase error messages to Norwegian
function translateAuthError(msg) {
  const translations = {
    'Invalid login credentials': 'Feil e-post eller passord. Prøv igjen.',
    'Email not confirmed': 'E-posten din er ikke bekreftet. Sjekk innboksen.',
    'User already registered': 'Det finnes allerede en konto med denne e-posten.',
    'Password should be at least 6 characters': 'Passordet må være minst 6 tegn.',
    'Signup requires a valid password': 'Vennligst oppgi et gyldig passord.',
    'User not found': 'Ingen konto funnet med denne e-posten.',
    'Email rate limit exceeded': 'For mange forsøk. Vent litt før du prøver igjen.',
    'For security purposes, you can only request this once every 60 seconds': 'Av sikkerhetshensyn kan du bare gjøre dette hvert 60. sekund.',
  };
  for (const [en, no] of Object.entries(translations)) {
    if (msg.includes(en)) return no;
  }
  return msg;
}

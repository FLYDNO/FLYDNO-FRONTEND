import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Placeholder env-variabler for build-tid (overskrives av faktiske env-variabler i produksjon)
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
  },
};

export default nextConfig;

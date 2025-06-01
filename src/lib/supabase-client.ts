// src/lib/supabase-client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Crearemos este archivo de tipos después

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Supabase URL no encontrada. Asegúrate de que NEXT_PUBLIC_SUPABASE_URL está configurada en tu .env.local");
}
if (!supabaseAnonKey) {
  throw new Error("Supabase Anon Key no encontrada. Asegúrate de que NEXT_PUBLIC_SUPABASE_ANON_KEY está configurada en tu .env.local");
}

// Puedes tipar el cliente con los tipos generados por Supabase CLI
// Por ahora, usaremos un tipado genérico o `any` si no tienes los tipos generados.
// El tipo Database se puede generar con: npx supabase gen types typescript --project-id <tu-project-id> --schema public > src/types/supabase.ts
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

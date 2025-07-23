// Export centralisé des services renderer
export { 
  SupabaseRendererService, 
  supabaseRenderer as supabaseService 
} from './SupabaseClient';

export type { 
  SupabaseConfig, 
  Institution, 
  User, 
  AuthResponse 
} from './SupabaseClient';
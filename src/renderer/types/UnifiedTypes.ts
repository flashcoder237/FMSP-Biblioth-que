// Types unifiés pour les modes offline et online

export interface UnifiedUser {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  institutionCode?: string;
  password?: string; // Seulement pour le mode offline
  lastLogin?: string;
  preferences?: {
    rememberMe: boolean;
    autoLogin: boolean;
    theme: string;
  };
}

export interface UnifiedInstitution {
  id?: string;
  code?: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  description?: string;
}

// Fonctions utilitaires pour convertir entre les types
export const convertToUnifiedUser = (user: any, mode: 'offline' | 'online'): UnifiedUser => {
  if (mode === 'offline') {
    // Utilisateur de LocalAuthService
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      institutionCode: user.institutionCode,
      password: user.password,
      lastLogin: user.lastLogin,
      preferences: user.preferences
    };
  } else {
    // Utilisateur Supabase
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      institutionCode: user.institutionCode,
      lastLogin: user.lastLogin
    };
  }
};

export const convertToUnifiedInstitution = (institution: any, mode: 'offline' | 'online'): UnifiedInstitution => {
  if (mode === 'offline') {
    // Institution de LocalAuthService
    return {
      id: institution.id,
      code: institution.code,
      name: institution.name,
      address: institution.address,
      city: institution.city,
      country: institution.country,
      phone: institution.phone,
      email: institution.email,
      website: institution.website,
      logo: institution.logo,
      description: institution.description
    };
  } else {
    // Institution Supabase
    return {
      id: institution.id,
      code: institution.code,
      name: institution.name,
      address: institution.address,
      city: institution.city,
      country: institution.country,
      phone: institution.phone,
      email: institution.email,
      website: institution.website,
      logo: institution.logo,
      description: institution.description
    };
  }
};
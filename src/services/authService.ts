import { UserProfile, evaluateUserSubscription } from '../types/subscription';

const STORAGE_KEY = 'smart_download_demo_user_v1';

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
}

/**
 * Authentication Service Abstraction.
 * Ready to connect to Firebase Authentication or custom OAuth/JWT backend.
 * Clearly distinguishes local demo session state from verified production auth.
 */
export const authService = {
  isProductionAuthConfigured(): boolean {
    return Boolean(import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_AUTH_API_URL);
  },

  getCurrentUser(): UserProfile | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: UserProfile = JSON.parse(raw);
      const evaluated = evaluateUserSubscription(parsed);
      if (evaluated.plan !== parsed.plan || evaluated.subscriptionStatus !== parsed.subscriptionStatus) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluated));
      }
      return evaluated;
    } catch {
      return null;
    }
  },

  saveUserSession(user: UserProfile): UserProfile {
    const evaluated = evaluateUserSubscription(user);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluated));
    } catch {
      // Ignore storage quota issues
    }
    return evaluated;
  },

  async signInDemo(payload: LoginPayload): Promise<UserProfile> {
    const existing = this.getCurrentUser();
    if (existing && existing.email.toLowerCase() === payload.email.toLowerCase()) {
      return existing;
    }

    const nameFromEmail = payload.email.split('@')[0] || 'Foydalanuvchi';
    const formattedName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);

    const newUser: UserProfile = {
      userId: `usr_${Date.now().toString(36)}`,
      name: formattedName,
      email: payload.email.trim(),
      plan: 'FREE',
      subscriptionStatus: 'ACTIVE',
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: null,
      savedAppIds: ['vscode', 'google-chrome', '7-zip'],
      isDemoSession: !this.isProductionAuthConfigured(),
    };

    return this.saveUserSession(newUser);
  },

  async registerDemo(payload: RegisterPayload): Promise<UserProfile> {
    const newUser: UserProfile = {
      userId: `usr_${Date.now().toString(36)}`,
      name: payload.name.trim(),
      email: payload.email.trim(),
      plan: 'FREE',
      subscriptionStatus: 'ACTIVE',
      subscriptionStart: new Date().toISOString(),
      subscriptionEnd: null,
      savedAppIds: [],
      isDemoSession: !this.isProductionAuthConfigured(),
    };

    return this.saveUserSession(newUser);
  },

  signOut(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  },

  toggleSavedApp(user: UserProfile, appId: string): UserProfile {
    const exists = user.savedAppIds.includes(appId);
    const updatedIds = exists
      ? user.savedAppIds.filter((id) => id !== appId)
      : [...user.savedAppIds, appId];

    const updatedUser: UserProfile = {
      ...user,
      savedAppIds: updatedIds,
    };
    return this.saveUserSession(updatedUser);
  },
};

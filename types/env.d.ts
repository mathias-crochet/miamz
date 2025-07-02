declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_GOOGLE_VISION_API_KEY: string;
      EXPO_PUBLIC_SPOONACULAR_API_KEY: string;
    }
  }
}

export {};
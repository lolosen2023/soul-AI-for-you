// Augment NodeJS namespace to include API_KEY in ProcessEnv.
// This prevents conflicts with @types/node and ensures process.cwd() is available in config.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
    [key: string]: string | undefined;
  }
}

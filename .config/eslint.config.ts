import type { Linter } from "eslint";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

// ESLint loads this TypeScript file through jiti, a dev dependency for that alone.
const config: Linter.Config[] = [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  ...nextCoreWebVitals,
];

export default config;

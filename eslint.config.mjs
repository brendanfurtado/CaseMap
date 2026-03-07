import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Warn on unused vars; allow _ prefix to suppress (e.g. _unused, _req)
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // Warn on console.log; allow console.warn and console.error
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Enforce const where let could be const
      "prefer-const": "error",
    },
  },
  // Note: add eslint-config-prettier here after: pnpm add -D prettier eslint-config-prettier
  // Then append: ...prettier
]);

export default eslintConfig;

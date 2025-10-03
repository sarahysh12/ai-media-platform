import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      indent: ["error", 2], // 2 spaces
      // ✅ Import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // ✅ Remove extra empty lines (max 1)
      "no-multiple-empty-lines": ["error", { max: 1 }],
    },
  },

  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;

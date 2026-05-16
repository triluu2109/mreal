import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: [
      ".agents/**",
      ".next/**",
      "node_modules/**",
      "public/**",
      "storage/**",
      "temp/**",
      "src/generated/**",
    ],
  },
];

export default eslintConfig;

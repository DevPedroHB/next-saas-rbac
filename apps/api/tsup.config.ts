import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/**/*.ts", "!./src/**/*.spec.ts", "!./src/**/*.e2e-spec.ts"],
	clean: true,
	sourcemap: true,
	noExternal: [
		"@next-saas-rbac/auth",
		"@next-saas-rbac/database",
		"@next-saas-rbac/env",
	],
	format: ["cjs", "esm"],
	outDir: "dist",
	tsconfig: "./tsconfig.json",
});

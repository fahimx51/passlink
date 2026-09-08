import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/server.ts"],
    format: ["esm"],
    clean: true,
    bundle: true,
    splitting: false,
    shims: true,
    // Do not mark local relative paths as external. 
    // Let tsup bundle the generated Prisma code, but inject cjs banner for Node built-ins.
    banner: {
        js: `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    `,
    },
});
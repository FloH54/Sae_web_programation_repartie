const esbuild = require("esbuild");

esbuild.build({
    entryPoints: ["ts/main.ts"],
    bundle: true,
    outfile: "dist/bundle.js",
    target: "es2017",
    sourcemap: true,
    minify: false,
}).catch(() => process.exit(1));
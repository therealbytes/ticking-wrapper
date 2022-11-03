import typescript from "@rollup/plugin-typescript";

import { defineConfig } from "rollup";

export default defineConfig([
    {
        input: "./src/index.ts",
        treeshake: true,
        output: {
            dir: "dist",
            sourcemap: true,
        },
        plugins: [typescript()],
        external: [
            "@ethersproject/providers",
            "@ethersproject/wallet",
            "@ethersproject/contracts",
        ]
    },
    {
        input: "./src/main.ts",
        treeshake: true,
        output: {
            dir: "dist",
            sourcemap: true,
            banner: "#!/usr/bin/env node",
        },
        plugins: [typescript()],
        external: [
            "@ethersproject/providers",
            "@ethersproject/wallet",
            "@ethersproject/contracts",
        ]
    }
]);

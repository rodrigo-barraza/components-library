import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.js",
  output: [
    {
      dir: "dist/esm",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    {
      dir: "dist/cjs",
      format: "cjs",
      preserveModules: true,
      preserveModulesRoot: "src",
      entryFileNames: "[name].cjs",
    },
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
  plugins: [
    resolve(),
    postcss({
      modules: true,
      extract: "styles.css",
      minimize: true,
    }),
    babel({
      babelHelpers: "bundled",
      presets: [
        ["@babel/preset-env", { targets: { esmodules: true } }],
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
      exclude: "node_modules/**",
    }),
  ],
};

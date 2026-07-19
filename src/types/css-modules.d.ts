declare module "*.module.css" {
  const classes: Readonly<Record<string, string>>;
  export default classes;
}

// Side-effect CSS imports (e.g. katex/dist/katex.min.css)
declare module "*.css";

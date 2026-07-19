/**
 * Pre-processes text to convert simple inline LaTeX math commands ($\command$)
 * into their Unicode equivalents before the markdown parser sees them.
 *
 * This avoids enabling remark-math's singleDollarTextMath option, which would
 * break currency notation like "$5-$10" or "$100($50 off)".
 */
export declare function sanitizeInlineLatex(content: string): string;
//# sourceMappingURL=latexSanitizer.d.ts.map
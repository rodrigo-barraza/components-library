/**
 * Escapes XML-style delimiter tags in text content so they render as visible
 * text instead of being swallowed by the markdown/HTML parser.
 *
 * System prompts and agent instructions commonly use tags like
 * `<agent-identity>`, `<tool-policy>`, `<context>` as structural delimiters.
 * ReactMarkdown (via rehype) interprets these as unknown HTML elements and
 * silently strips them, which breaks the surrounding markdown formatting
 * (e.g., headings that follow a tag lose their block context).
 *
 * This function converts `<tag-name>` and `</tag-name>` into their
 * HTML-entity equivalents (`&lt;tag-name&gt;`) so they appear as literal
 * text in the rendered output.
 *
 * Tags inside fenced code blocks (``` ... ```) are left untouched.
 */
export declare function escapeXmlDelimiterTags(content: string): string;
//# sourceMappingURL=xmlTagEscaper.d.ts.map
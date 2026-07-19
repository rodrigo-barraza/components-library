"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import styles from "./MarkdownContentComponent.module.css";
import { sanitizeInlineLatex } from "../../utils/latexSanitizer.js";
import { escapeXmlDelimiterTags } from "../../utils/xmlTagEscaper.js";
import CopyButtonComponent from "../CopyButtonComponent/CopyButtonComponent.js";
function FencedCodeBlock({ language, children }) {
    const codeString = String(children).replace(/\n$/, "");
    let displayLabel = language;
    let syntaxLang = language;
    if (language.startsWith("exec-")) {
        syntaxLang = language.replace("exec-", "");
        displayLabel = `${syntaxLang.toUpperCase()} — EXECUTABLE CODE`;
    }
    else if (language.startsWith("execresult-")) {
        syntaxLang = language.replace("execresult-", "") || "text";
        displayLabel = `${(syntaxLang || "PYTHON").toUpperCase()} — CODE EXECUTION RESULT`;
    }
    return (_jsxs("div", { className: styles['code-block-wrapper'], children: [_jsxs("div", { className: styles['code-block-header'], children: [_jsx("span", { className: styles['code-block-lang'], children: displayLabel }), _jsx(CopyButtonComponent, { text: codeString, size: 12, showLabel: true, className: styles['code-block-copy'] })] }), _jsx(SyntaxHighlighter, { style: oneDark, language: syntaxLang, PreTag: "div", customStyle: {
                    margin: 0,
                    borderRadius: "0 0 8px 8px",
                    fontSize: "13px",
                }, children: codeString })] }));
}
function CodeBlock({ children, className, node: _node, ...rest }) {
    const match = /language-(\w+)/.exec(className || "");
    if (!match) {
        return (_jsx("code", { className: `${styles['inline-code']} ${className || ""}`, ...rest, children: children }));
    }
    return _jsx(FencedCodeBlock, { language: match[1], children: children });
}
function AutoResizeEmbed({ src, title, fallbackHeight, className, }) {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState(fallbackHeight);
    const handleMessage = useCallback((event) => {
        if (event.data?.type === "embed-resize" &&
            iframeRef.current &&
            event.source === iframeRef.current.contentWindow) {
            setHeight(event.data.height);
        }
    }, []);
    useEffect(() => {
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [handleMessage]);
    return (_jsx("span", { className: styles['embed-wrapper'], children: _jsx("iframe", { ref: iframeRef, src: src, className: className, title: title, style: { height: `${height}px` }, loading: "lazy", referrerPolicy: "no-referrer" }) }));
}
function ImageOrEmbed({ src, alt, node: _node, ...rest }) {
    // Detect embed URLs that return HTML pages and render as auto-resizing iframes
    const isStringSrc = typeof src === "string";
    if (isStringSrc && src.includes("/utility/map/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "Map", fallbackHeight: 360, className: styles['map-embed'] }));
    }
    if (isStringSrc && src.includes("/compute/latex/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "LaTeX", fallbackHeight: 160, className: styles['embed-frame'] }));
    }
    if (isStringSrc && src.includes("/compute/diagram/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "Diagram", fallbackHeight: 420, className: styles['embed-frame'] }));
    }
    if (isStringSrc && src.includes("/compute/3d/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "3D Scene", fallbackHeight: 480, className: styles['embed-frame'] }));
    }
    if (isStringSrc && src.includes("/compute/image/ascii/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "ASCII Art", fallbackHeight: 600, className: styles['embed-frame'] }));
    }
    if (isStringSrc && src.includes("/gaming/bonfire/embed")) {
        return (_jsx(AutoResizeEmbed, { src: src, title: alt || "Bonfire", fallbackHeight: 480, className: styles['embed-frame'] }));
    }
    if (isStringSrc && src.includes("/compute/turtle/embed")) {
        return (_jsx("span", { className: `${styles['embed-wrapper']} ${styles['turtle-embed-wrapper']}`, children: _jsx("iframe", { src: src, className: `${styles['embed-frame']} ${styles['turtle-embed-frame']}`, title: alt || "Turtle Drawing", loading: "lazy", referrerPolicy: "no-referrer" }) }));
    }
    return _jsx("img", { src: src, alt: alt, ...rest });
}
export default function MarkdownContentComponent({ content, className, children, }) {
    const sanitizedContent = useMemo(() => escapeXmlDelimiterTags(sanitizeInlineLatex(content || "")), [content]);
    if (!content && !children)
        return null;
    return (_jsxs("div", { className: `markdown-content-component ${styles['text']} ${className || ""}`, children: [_jsx(ReactMarkdown, { remarkPlugins: [remarkGfm, [remarkMath, { singleDollarTextMath: false }]], rehypePlugins: [rehypeKatex], components: { code: CodeBlock, img: ImageOrEmbed }, children: sanitizedContent }), children] }));
}
//# sourceMappingURL=MarkdownContentComponent.js.map
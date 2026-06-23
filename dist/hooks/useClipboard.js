"use client";
import { useState, useCallback, useEffect, useRef } from "react";
function copyViaLegacyExecCommand(text) {
    const textAreaElement = document.createElement("textarea");
    textAreaElement.value = text;
    textAreaElement.setAttribute("readonly", "");
    textAreaElement.style.position = "fixed";
    textAreaElement.style.left = "-9999px";
    textAreaElement.style.opacity = "0";
    document.body.appendChild(textAreaElement);
    textAreaElement.select();
    textAreaElement.setSelectionRange(0, text.length);
    let isSuccessful = false;
    try {
        isSuccessful = document.execCommand("copy");
    }
    catch {
        isSuccessful = false;
    }
    document.body.removeChild(textAreaElement);
    return isSuccessful;
}
export default function useClipboard(resetMs = 2000) {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef(null);
    useEffect(() => {
        return () => {
            if (timerRef.current)
                clearTimeout(timerRef.current);
        };
    }, []);
    const copy = useCallback(async (text) => {
        let isSuccessful = false;
        if (navigator.clipboard?.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                isSuccessful = true;
            }
            catch {
                isSuccessful = copyViaLegacyExecCommand(text);
            }
        }
        else {
            isSuccessful = copyViaLegacyExecCommand(text);
        }
        setCopied(isSuccessful);
        if (timerRef.current)
            clearTimeout(timerRef.current);
        if (isSuccessful) {
            timerRef.current = setTimeout(() => setCopied(false), resetMs);
        }
        return isSuccessful;
    }, [resetMs]);
    return { copy, copied };
}
//# sourceMappingURL=useClipboard.js.map
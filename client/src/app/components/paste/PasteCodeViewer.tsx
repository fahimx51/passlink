'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';
import hljs from 'highlight.js';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface PasteCodeViewerProps {
    content?: string;
    language?: string;
}

export function PasteCodeViewer({ content = '', language }: PasteCodeViewerProps) {
    const [copied, setCopied] = useState(false);

    // Auto-detect code vs plain text
    const detected = useMemo(() => {
        if (!content.trim()) return { isCode: false, lang: 'text' };

        // Explicit language passed
        if (language && language !== 'text' && language !== 'plaintext') {
            return { isCode: true, lang: language };
        }

        // 1. Pattern test for common code indicators (JS, C++, Python, HTML, etc.)
        const hasCodeSyntax = /(?:const|let|var|function|return|console\.log|import|export|class|if|for|while|#include|def|\/\/|\/\*)/.test(content);

        // 2. Auto detect using target languages
        const result = hljs.highlightAuto(content, [
            'javascript',
            'typescript',
            'cpp',
            'c',
            'python',
            'html',
            'css',
            'json',
            'sql',
            'java',
        ]);

        // Lower threshold to 8, but require either a pattern match OR higher relevance
        const isCode = hasCodeSyntax || (result.relevance ?? 0) > 8;

        return {
            isCode,
            lang: isCode ? result.language || 'javascript' : 'text',
        };
    }, [content, language]);

    const handleCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-base-100 border border-base-200 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm w-full min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 bg-base-200/50 border-b border-base-200 gap-2">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="flex gap-1.5 sm:gap-2 shrink-0">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-error/70"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning/70"></div>
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success/70"></div>
                    </div>
                    {detected.isCode && (
                        <span className="text-[10px] sm:text-xs font-mono text-base-content/60 uppercase tracking-wider pl-1 sm:pl-2 font-semibold truncate">
                            {detected.lang}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleCopy}
                    className="btn btn-xs sm:btn-sm btn-ghost hover:bg-base-300/50 gap-1.5 sm:gap-2 rounded-lg font-medium text-base-content/70 hover:text-base-content shrink-0"
                >
                    {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    <span className="text-xs sm:text-sm">{copied ? 'Copied' : 'Copy Text'}</span>
                </button>
            </div>

            {/* Content Area */}
            <div className="p-4 sm:p-6 md:p-8 bg-base-200/30 w-full min-w-0">
                {detected.isCode ? (
                    <>
                        {/* Light theme display */}
                        <div className="dark:hidden">
                            <SyntaxHighlighter
                                language={detected.lang}
                                style={oneLight}
                                customStyle={{
                                    margin: 0,
                                    padding: 0,
                                    background: 'transparent',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    overflowX: 'visible',
                                }}
                                wrapLines={true}
                                wrapLongLines={true}
                                lineProps={{
                                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
                                }}
                            >
                                {content}
                            </SyntaxHighlighter>
                        </div>

                        {/* Dark theme display */}
                        <div className="hidden dark:block">
                            <SyntaxHighlighter
                                language={detected.lang}
                                style={vscDarkPlus}
                                customStyle={{
                                    margin: 0,
                                    padding: 0,
                                    background: 'transparent',
                                    fontSize: '13px',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    overflowX: 'visible',
                                }}
                                wrapLines={true}
                                wrapLongLines={true}
                                lineProps={{
                                    style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' }
                                }}
                            >
                                {content}
                            </SyntaxHighlighter>
                        </div>
                    </>
                ) : (
                    <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-all text-base-content">
                        <code>{content}</code>
                    </pre>
                )}
            </div>
        </div>
    );
}
import { FC, useRef } from 'react';
import * as React from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import { useTranslations } from 'next-intl';

// Register languages for PrismLight
SyntaxHighlighter.registerLanguage('python', python);

// Define a proper interface for SyntaxHighlighter props
interface SyntaxHighlighterComponentProps {
    language: string;
    style: Record<string, unknown>;
    customStyle?: React.CSSProperties;
    codeTagProps?: React.HTMLAttributes<HTMLElement>;
    showLineNumbers?: boolean;
    children: React.ReactNode;
}

const SyntaxHighlighterComponent = SyntaxHighlighter as unknown as React.ComponentType<SyntaxHighlighterComponentProps>;

const lightTheme = {
    ...prism,
    'code[class*="language-"]': {
        ...prism['code[class*="language-"]'],
        color: '#24292f', // Dark gray for base text
    },
    'keyword': {
        color: '#8422cf', // Bright red for keywords
        fontWeight: 'bold'
    },
    'function': {
        color: '#8250df', // Purple for functions
        fontWeight: '600'
    },
    'string': {
        color: '#0a3069', // Dark blue for strings
    },
    'number': {
        color: '#0550ae', // Blue for numbers
    },
    'builtin': {
        color: '#cf222e', // Red for builtins
        fontWeight: '600'
    },
    'boolean': {
        color: '#0550ae', // Blue for booleans
        fontWeight: 'bold'
    },
    'operator': {
        color: '#24292f' // Dark gray for operators
    },
    'comment': {
        color: '#6e7781', // Medium gray for comments
        fontStyle: 'italic'
    }
};

interface CodeEditorProps {
    userCode: string;
    isCodeValid: boolean;
    isProgramRunning: boolean;
    showHint: boolean;
    codeHint: string;
    onCodeChange: (code: string) => void;
    onRunProgram: () => void;
    onCodeEditorClick?: () => void;
}

const CodeEditor: FC<CodeEditorProps> = ({
    userCode,
    isCodeValid,
    isProgramRunning,
    showHint,
    codeHint,
    onCodeChange,
    onRunProgram,
    onCodeEditorClick
}) => {
    const t = useTranslations('CircuitBoard');
    const editorRef = useRef<HTMLTextAreaElement>(null);
    const highlighterRef = useRef<HTMLDivElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    // Handle cursor focus and editor click
    const handleEditorClick = () => {
        // Focus the textarea to show the cursor
        if (editorRef.current) {
            editorRef.current.focus();
        }

        // Call the click callback if provided
        if (onCodeEditorClick) {
            onCodeEditorClick();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const spaces = '    ';

            const newCode = userCode.substring(0, start) + spaces + userCode.substring(end);
            onCodeChange(newCode);

            setTimeout(() => {
                if (editorRef.current) {
                    editorRef.current.selectionStart = editorRef.current.selectionEnd = start + spaces.length;
                }
            }, 0);
        }
    };

    // Handle scroll synchronization
    const handleScroll = () => {
        if (editorRef.current && highlighterRef.current) {
            highlighterRef.current.scrollTop = editorRef.current.scrollTop;
        }

        if (editorRef.current && lineNumbersRef.current) {
            lineNumbersRef.current.scrollTop = editorRef.current.scrollTop;
        }
    };

    const sharedStyles = {
        fontSize: '14px',
        lineHeight: '1.5',
        padding: '16px',
        fontFamily: 'var(--font-geist-mono), monospace',
        tabSize: 4,
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 flex flex-col w-full" style={{ height: '570px' }}>
            <h3 className="text-xl font-bold mb-2">{t('pageContent.codeEditorTitle')}</h3>
            <div className="flex flex-col" style={{ height: 'calc(100% - 40px)' }}>
                <div className="font-mono text-sm rounded-lg border border-slate-300 relative flex flex-col" style={{ height: '100%' }}>
                    <div className="relative flex" style={{ height: 'calc(100% - 60px)', overflow: 'hidden' }}>
                        {/* Line numbers */}
                        <div
                            ref={lineNumbersRef}
                            className="line-numbers text-right border-r border-slate-300 select-none"
                            style={{
                                height: '100%',
                                minWidth: '2rem',
                                paddingTop: sharedStyles.padding,
                                paddingRight: '8px',
                                paddingLeft: '8px',
                                fontSize: sharedStyles.fontSize,
                                lineHeight: sharedStyles.lineHeight,
                                overflowY: 'scroll',
                                scrollbarWidth: 'none', // Firefox
                                msOverflowStyle: 'none', // IE/Edge
                            }}>
                            <div style={{
                                pointerEvents: 'none',
                                userSelect: 'none'
                            }}>
                                {Array.from({ length: Math.max(userCode.split('\n').length, 1) }, (_, i) => (
                                    <div key={i + 1} className="text-slate-400" style={{ height: '1.5em' }}>
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code editor */}
                        <div className="relative" style={{ height: '420px', width: 'calc(100% - 2rem)', overflow: 'hidden' }}>
                            <textarea
                                ref={editorRef}
                                value={userCode}
                                onChange={(e) => onCodeChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onScroll={handleScroll}
                                onClick={handleEditorClick}
                                className="w-full h-full bg-transparent outline-none resize-none absolute inset-0 text-transparent caret-black z-10 overflow-y-auto"
                                spellCheck="false"
                                style={{
                                    ...sharedStyles,
                                }}
                            />
                            <div
                                ref={highlighterRef}
                                className="pointer-events-none overflow-y-auto"
                                style={{
                                    height: '100%',
                                    scrollbarWidth: 'none', // Firefox
                                    msOverflowStyle: 'none', // IE/Edge
                                }}>
                                <SyntaxHighlighterComponent
                                    language="python"
                                    style={lightTheme}
                                    customStyle={{
                                        ...sharedStyles,
                                        margin: 0,
                                        background: 'transparent',
                                        overflow: 'visible',
                                        height: '100%',
                                    }}
                                    codeTagProps={{
                                        style: {
                                            fontFamily: 'inherit',
                                            fontSize: 'inherit',
                                            lineHeight: 'inherit'
                                        }
                                    }}
                                    showLineNumbers={false}
                                >
                                    {userCode || ' '} {/* Ensure there's always content to render */}
                                </SyntaxHighlighterComponent>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-300"></div>
                    {showHint && (
                        <div className={`absolute top-2 right-2 p-3 rounded-lg text-sm ${isCodeValid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} transition-opacity duration-300`}>
                            {codeHint}
                        </div>
                    )}
                    <div style={{ height: '60px', display: 'flex', alignItems: 'center', padding: '0 10px', width: '100%' }}>
                        <button
                            className={`w-full py-2.5 rounded-lg font-semibold border border-slate-300 transition-colors whitespace-nowrap inline-flex items-center justify-center gap-2 ${isProgramRunning
                                ? 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                                : isCodeValid
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                            onClick={onRunProgram}
                            disabled={!isCodeValid && !isProgramRunning}
                        >
                            {isProgramRunning ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                                    </svg>
                                    {t('buttons.stop')}
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                    </svg>
                                    {t('buttons.run')}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditor; 
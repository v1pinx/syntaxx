'use client'

import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { Loader2, Play } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CodeEditor() {
    const [language, setLanguage] = useState('javascript');
    const [codeRunning, setCodeRunning] = useState(false);
    const [code, setCode] = useState('');
    const [serverStatus, setServerStatus] = useState('Server is down');

    useEffect(() => {
        const storedCode = localStorage.getItem(language);
        if (storedCode && storedCode.length > 0) {
            setCode(storedCode);
            return;
        }
        setCode(getDefaultCodeByLanguage(language));
    }, [language]);


    const handleEditorDidMount = (editor: any, monaco: any) => {
        monaco.editor.defineTheme('darkYellowTheme', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6C7070', fontStyle: 'italic' },
                { token: 'keyword', foreground: 'FFDF00', fontStyle: 'bold' },
                { token: 'string', foreground: 'FFDF00', opacity: '0.8' },
                { token: 'number', foreground: 'FFDF00', opacity: '0.9' },
                { token: 'operator', foreground: 'FFFFFF' },
                { token: 'function', foreground: 'FFFFFF' },
                { token: 'variable', foreground: '3E4343' },
                { token: 'type', foreground: 'FFDF00', opacity: '0.7' },
            ],
            colors: {
                'editor.background': '#0E1313',
                'editor.foreground': '#FFFFFF',
                'editorCursor.foreground': '#FFDF00',
                'editor.lineHighlightBackground': '#3E43434D',
                'editorLineNumber.foreground': '#6C7070',
                'editorLineNumber.activeForeground': '#FFDF00',
                'editor.selectionBackground': '#FFDF0033',
                'editor.inactiveSelectionBackground': '#3E43437F',
                'editorSuggestWidget.background': '#0E1313',
                'editorSuggestWidget.border': '#3E4343',
                'editorSuggestWidget.selectedBackground': '#FFDF0022',
                'editorSuggestWidget.highlightForeground': '#FFDF00',
                'editor.wordHighlightBackground': '#FFDF0022',
                'editor.wordHighlightStrongBackground': '#FFDF0044',
                'editorBracketMatch.background': '#FFDF0022',
                'editorBracketMatch.border': '#FFDF0066',
            }
        });

        monaco.editor.setTheme('darkYellowTheme');

        editor.updateOptions({
            fontFamily: '"Inter", "JetBrains Mono", Consolas, monospace',
            fontSize: 14,
            lineHeight: 1.6,
            minimap: { enabled: window.innerWidth > 768 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 16, bottom: 16 },
            roundedSelection: true,
            contextmenu: true,
        });

        const handleResize = () => {
            editor.updateOptions({
                minimap: { enabled: window.innerWidth > 768 },
                fontSize: window.innerWidth < 640 ? 12 : 14,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    };

    const getDefaultCodeByLanguage = (lang: string) => {
        switch (lang) {
            case 'python':
                return '# This is a simple Python program\nprint("Hello World")';
            case 'cpp':
                return `// This is a simple C++ program\n#include <iostream>\n\nint main() {\n\n    std::cout << "Hello World" << std::endl;\n    return 0;\n\n}`;
            default:
                return '// This is a simple JavaScript program\nconsole.log("Hello World")';
        }
    };


    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            localStorage.setItem(language, code)
        }
    };

    const onCodeSubmit = async () => {
        setCodeRunning(true);
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(5);
            }, 2000);
        });
        toast.error(serverStatus);
        setCodeRunning(false);
    }

    const onReset = () => {
        localStorage.removeItem(language);
        setCode(getDefaultCodeByLanguage(language));
    }

    const panelStyle = {
        border: '1px solid rgba(62, 67, 67, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.5s ease-out'
    };

    return (
        <div className="relative p-2 md:p-4 w-full">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                <div
                    className="w-full bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative z-10 hover:border-yellow-500/20 transition-all duration-300"
                    style={panelStyle}
                >
                    <div className="px-2 md:px-4 py-3 border-b border-[#3E4343] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h3 className="text-white font-medium">Code Editor</h3>
                        <div className='flex flex-wrap gap-2 md:gap-4'>
                            <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger className="w-[110px] text-[#FFDF00] border-[#FFDF00] text-xs md:text-sm">
                                    <SelectValue placeholder="Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="javascript" className="cursor-pointer">JavaScript</SelectItem>
                                    <SelectItem value="cpp" className="cursor-pointer">C++</SelectItem>
                                    <SelectItem value="python" className="cursor-pointer">Python</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                className="cursor-pointer flex items-center gap-1 w-20 md:w-28 text-xs md:text-sm"
                                onClick={onCodeSubmit}
                                disabled={codeRunning}
                            >
                                {codeRunning ? (
                                    <Loader2 className="animate-spin h-4 w-4" />
                                ) : (
                                    <Play className="h-4 w-4" />
                                )}
                                <span className="hidden xs:inline">{codeRunning ? "Running..." : "Run Code"}</span>
                                <span className="inline xs:hidden">{codeRunning ? "Run..." : "Run"}</span>
                            </Button>
                        </div>
                    </div>

                    <Editor
                        height="60vh"
                        width="100%"
                        language={language}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        options={{
                            autoIndent: 'full',
                            formatOnPaste: true,
                            formatOnType: true,
                            wordWrap: 'on',
                        }}
                    />
                </div>

                {/* Output Panel */}
                <div className="w-full bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative z-10 hover:border-yellow-500/20 transition-all duration-300"
                    style={panelStyle}>
                    <div className="px-2 md:px-4 py-3 border-b border-[#3E4343] flex justify-between items-center">
                        <h3 className="text-white font-medium">Output</h3>
                        <Button className='cursor-pointer text-xs md:text-sm' variant="secondary" onClick={onReset}>Reset</Button>
                    </div>
                    <div className="h-32 md:h-40 lg:h-full p-4 text-gray-300">
                        {/* Output content would go here */}
                        <p className="text-yellow-300 opacity-70">Ready to run code...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
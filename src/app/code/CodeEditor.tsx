'use client'

import { useEffect, useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Copy, Loader2, Play, Share, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';

export default function CodeEditor() {
    const [language, setLanguage] = useState('javascript');
    const [codeRunning, setCodeRunning] = useState(false);
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('Ready to run code...');
    const [outputType, setOutputType] = useState('info'); // 'info', 'success', 'error'
    const [shareUrl, setShareUrl] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const outputRef = useRef(null);

    const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '';
    const RAPIDAPI_HOST = process.env.NEXT_PUBLIC_RAPIDAPI_HOST || '';
    const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/share';

    const serverStatus = RAPIDAPI_KEY ? "Connected to execution server" : "Server configuration missing";

    useEffect(() => {
        const storedCode = localStorage.getItem(`code_${language}`);
        if (storedCode && storedCode.length > 0) {
            setCode(storedCode);
        } else {
            setCode(getDefaultCodeByLanguage(language));
        }
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
                return `// This is a simple C++ program\n#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`;
            default:
                return '// This is a simple JavaScript program\nconsole.log("Hello World")';
        }
    };

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
            localStorage.setItem(`code_${language}`, value);
        }
    };

    const getLanguageId = (lang: string) => {
        switch (lang) {
            case 'javascript':
                return 63; // Node.js
            case 'cpp':
                return 54; // C++ (GCC 9.2.0)
            case 'python':
                return 71; // Python (3.8.1)
            default:
                return 63; // Default to Node.js
        }
    };

    const onCodeSubmit = async () => {
        if (!RAPIDAPI_KEY) {
            setOutput("API key not configured. Please check your environment variables.");
            setOutputType('error');
            toast.error("API key not configured");
            return;
        }

        setCodeRunning(true);
        setOutput("Running code...");
        setOutputType('info');

        const languageId = getLanguageId(language);
        const encodedCode = Buffer.from(code).toString("base64");

        try {
            // Submit code
            const response = await axios.post(
                "https://judge0-ce.p.rapidapi.com/submissions",
                {
                    language_id: languageId,
                    source_code: encodedCode,
                    stdin: "",
                },
                {
                    params: {
                        base64_encoded: "true",
                        fields: "*"
                    },
                    headers: {
                        "x-rapidapi-key": RAPIDAPI_KEY,
                        "x-rapidapi-host": RAPIDAPI_HOST,
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.status === 201) {
                const submissionId = response.data.token;

                // Poll for results with exponential backoff
                let attempts = 0;
                const maxAttempts = 10;
                const getOutput = async () => {
                    while (attempts < maxAttempts) {
                        attempts++;

                        const outputResponse = await axios.get(
                            `https://judge0-ce.p.rapidapi.com/submissions/${submissionId}`,
                            {
                                params: {
                                    base64_encoded: "true",
                                    fields: "*"
                                },
                                headers: {
                                    "x-rapidapi-key": RAPIDAPI_KEY,
                                    "x-rapidapi-host": RAPIDAPI_HOST,
                                },
                            }
                        );

                        const { status, stdout, stderr, compile_output, message } = outputResponse.data;

                        // Check if execution is complete
                        if (status.id >= 3) { // Status 3 or higher means finished
                            if (stdout) {
                                const decodedOutput = Buffer.from(stdout, "base64").toString('utf-8');
                                setOutput(decodedOutput);
                                setOutputType('success');
                                return;
                            } else if (stderr) {
                                const decodedError = Buffer.from(stderr, "base64").toString('utf-8');
                                setOutput(`Runtime Error:\n${decodedError}`);
                                setOutputType('error');
                                return;
                            } else if (compile_output) {
                                const decodedCompileError = Buffer.from(compile_output, "base64").toString('utf-8');
                                setOutput(`Compilation Error:\n${decodedCompileError}`);
                                setOutputType('error');
                                return;
                            } else if (message) {
                                setOutput(`Execution Error:\n${message}`);
                                setOutputType('error');
                                return;
                            } else {
                                setOutput("No output generated.");
                                setOutputType('info');
                                return;
                            }
                        }

                        // If execution not complete, wait before polling again
                        // Exponential backoff with a max of 2 seconds
                        const delay = Math.min(2000, 250 * Math.pow(2, attempts));
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }

                    // If we've reached max attempts without a result
                    setOutput("Execution timed out. The server may be busy.");
                    setOutputType('error');
                };

                await getOutput();
            }
        } catch (error: any) {
            console.error("Code execution error:", error);
            setOutput(`Error: ${error.response?.data?.message || error.message || "Could not execute code."}`);
            setOutputType('error');
            toast.error("Code execution failed");
        } finally {
            setCodeRunning(false);
            // Scroll to output
            // if (outputRef.current) {
            //     outputRef.current.scrollIntoView({ behavior: 'smooth' });
            // }
        }
    };

    const onReset = () => {
        localStorage.removeItem(`code_${language}`);
        setCode(getDefaultCodeByLanguage(language));
        setOutput("Code reset to default.");
        setOutputType('info');
        toast.success("Code Reset");
    };

    const checkAuth = async () => {
        const token = await getCookie("token");
        if (!token) {
            return;
        }
        const data = await axios.post('/api/verify-token', {
            token: token,
        });
        return data;
    };

    const onShare = async () => {

        const authData = await checkAuth();
        if(!authData || authData!.status != 200){
            toast.error("Login First to Share the Code");
            return;
        }

        try {
            // Call your API to save the code and get a shareable URL
            const response = await axios.post(API_URL, {
                username: "guest",
                language,
                code
            });
            console.log("Share response:", response.data.data);
            const shareId = response.data.data._id;
            const url = `${window.location.origin}/shared/${shareId}`;
            setShareUrl(url);
            setIsDialogOpen(true);
            toast.success("Code shared successfully");
        } catch (error) {
            console.error("Sharing error:", error);
            toast.error("Failed to share code");
        }
    };

    const copyShareUrl = () => {
        navigator.clipboard.writeText(shareUrl);
        toast.success("URL copied to clipboard");
    };

    const panelStyle = {
        border: '1px solid rgba(62, 67, 67, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.5s ease-out'
    };

    const getOutputStyle = () => {
        switch (outputType) {
            case 'success':
                return 'text-green-300';
            case 'error':
                return 'text-red-300';
            default:
                return 'text-yellow-300 opacity-70';
        }
    };

    return (
        <div className="relative p-2 md:p-4 w-full">
            <div className="flex flex-col lg:flex-row gap-4 w-full">
                {/* Code Editor Panel */}
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
                        loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
                    />

                    {!RAPIDAPI_KEY && (
                        <div className="absolute bottom-2 left-2 right-2 px-3 py-2 bg-red-900/70 text-white rounded flex items-center gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            API key not configured. Code execution will not work.
                        </div>
                    )}
                </div>

                {/* Output Panel */}
                <div
                    className="w-full bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative z-10 hover:border-yellow-500/20 transition-all duration-300"
                    style={panelStyle}
                    ref={outputRef}
                >
                    <div className="px-2 md:px-4 py-3 border-b border-[#3E4343] flex justify-between items-center">
                        <h3 className="text-white font-medium">Output</h3>
                        <div className='flex gap-3 items-center'>
                            <Button
                                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white transition-colors duration-300 cursor-pointer"
                                onClick={onShare}
                                disabled={codeRunning}
                            >
                                <Share className="w-4 h-4" />
                                <span className="text-sm font-medium text-white">Share Code</span>
                            </Button>

                            <Button
                                className='cursor-pointer text-xs md:text-sm'
                                variant="secondary"
                                onClick={onReset}
                                disabled={codeRunning}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                    <div className="h-32 md:h-40 lg:h-[60vh] p-4 text-gray-300 overflow-auto font-mono whitespace-pre-wrap">
                        <p className={getOutputStyle()}>{output}</p>
                    </div>
                </div>
            </div>

            {/* Share Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Share Code</DialogTitle>
                        <DialogDescription>
                            Here's a link to share your code:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={copyShareUrl}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
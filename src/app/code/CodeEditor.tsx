"use client";
import { useEffect, useState, useRef } from "react";
import Editor from "@monaco-editor/react";
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
import { Button } from "@/components/ui/button";
import {
  Copy,
  Loader2,
  Play,
  Share,
  AlertTriangle,
  Terminal,
  FileText,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";

export default function CodeEditor() {
  const [language, setLanguage] = useState("javascript");
  const [codeRunning, setCodeRunning] = useState(false);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("Ready to run code...");
  const [outputType, setOutputType] = useState("info"); // 'info', 'success', 'error'
  const [shareUrl, setShareUrl] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const outputRef = useRef(null);

  useEffect(() => {
    const storedCode = localStorage.getItem(`code_${language}`);
    const storedInput = localStorage.getItem(`input_${language}`);
    if (storedInput && storedInput.length > 0) {
      setInput(storedInput);
    }
    if (storedCode && storedCode.length > 0) {
      setCode(storedCode);
    } else {
      setCode(getDefaultCodeByLanguage(language));
    }
  }, [language]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme("darkYellowTheme", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6C7070", fontStyle: "italic" },
        { token: "keyword", foreground: "FFDF00", fontStyle: "bold" },
        { token: "string", foreground: "FFDF00", opacity: "0.8" },
        { token: "number", foreground: "FFDF00", opacity: "0.9" },
        { token: "operator", foreground: "FFFFFF" },
        { token: "function", foreground: "FFFFFF" },
        { token: "variable", foreground: "3E4343" },
        { token: "type", foreground: "FFDF00", opacity: "0.7" },
      ],
      colors: {
        "editor.background": "#0E1313",
        "editor.foreground": "#FFFFFF",
        "editorCursor.foreground": "#FFDF00",
        "editor.lineHighlightBackground": "#3E43434D",
        "editorLineNumber.foreground": "#6C7070",
        "editorLineNumber.activeForeground": "#FFDF00",
        "editor.selectionBackground": "#FFDF0033",
        "editor.inactiveSelectionBackground": "#3E43437F",
        "editorSuggestWidget.background": "#0E1313",
        "editorSuggestWidget.border": "#3E4343",
        "editorSuggestWidget.selectedBackground": "#FFDF0022",
        "editorSuggestWidget.highlightForeground": "#FFDF00",
        "editor.wordHighlightBackground": "#FFDF0022",
        "editor.wordHighlightStrongBackground": "#FFDF0044",
        "editorBracketMatch.background": "#FFDF0022",
        "editorBracketMatch.border": "#FFDF0066",
      },
    });

    monaco.editor.setTheme("darkYellowTheme");

    editor.updateOptions({
      fontFamily: '"Inter", "JetBrains Mono", Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.6,
      minimap: { enabled: window.innerWidth > 768 },
      scrollBeyondLastLine: false,
      renderLineHighlight: "all",
      cursorBlinking: "smooth",
      cursorSmoothCaretAnimation: "on",
      renderWhitespace: "selection",
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

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  };

  const getDefaultCodeByLanguage = (lang: string) => {
    switch (lang) {
      case "python":
        return '# This is a simple Python program\nprint("Hello World")';
      case "cpp":
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

  const handleInputChange = (value: string) => {
    setInput(value);
    localStorage.setItem(`input_${language}`, value);
  };

  const getLanguageId = (lang: string) => {
    switch (lang) {
      case "javascript":
        return 63; // Node.js
      case "cpp":
        return 54; // C++ (GCC 9.2.0)
      case "python":
        return 71; // Python (3.8.1)
      default:
        return 63; // Default to Node.js
    }
  };

  const onCodeSubmit = async () => {
    setCodeRunning(true);
    setOutput("Running code...");
    setOutputType("info");

    const languageId = getLanguageId(language);
    const encodedCode = Buffer.from(code).toString("base64");
    const encodedInput = Buffer.from(input).toString("base64");

    try {
      const response = await axios.post("/api/execute", {
        languageId,
        encodedCode,
        stdin: encodedInput,
      });

      if (response.data.message == "Success") {
        if (response.data.identifier == "stdout") {
          setOutput(response.data.data);
          setOutputType("success");
        } else if (response.data.identifier == "stderr") {
          setOutput(response.data.data);
          setOutputType("error");
        } else if (response.data.identifier == "compile_output") {
          setOutput(response.data.data);
          setOutputType("error");
        } else {
          setOutput(response.data.data);
          setOutputType("error");
        }
      } else if (response.data.message == "Error") {
        console.log("Error:", response);
        setOutput(response.data.data);
        setOutputType("error");
        toast.error("Code execution failed");
      }
    } catch (error: any) {
      if (error.response.status == 400) {
        toast.error("Invalid request");
        setOutput("Invalid request");
        setOutputType("error");
        return;
      }
      console.error("Code execution error:", error);
      setOutput(
        `Error: ${
          error.response?.data?.message ||
          error.message ||
          "Could not execute code."
        }`
      );
      setOutputType("error");
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
    setInput("");
    setOutput("Code reset to default.");
    setOutputType("info");
    toast.success("Code Reset");
  };

  const checkAuth = async () => {
    const token = await getCookie("token");
    if (!token) {
      return;
    }
    const data = await axios.post("/api/verify-token", {
      token: token,
    });
    return data;
  };

  const onShare = async () => {
    const authData = await checkAuth();
    if (!authData || authData!.status != 200) {
      toast.error("Login First to Share the Code");
      return;
    }

    try {
      const response = await axios.post("/api/share", {
        username: "guest",
        language,
        code,
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
    border: "1px solid rgba(62, 67, 67, 0.5)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    animation: "slideUp 0.5s ease-out",
    background:
      "linear-gradient(135deg, rgba(14, 19, 19, 0.8) 0%, rgba(14, 19, 19, 0.6) 100%)",
    backdropFilter: "blur(16px)",
  };

  const getOutputStyle = () => {
    switch (outputType) {
      case "success":
        return "text-green-300";
      case "error":
        return "text-red-300";
      default:
        return "text-yellow-300 opacity-70";
    }
  };

  return (
    <div className="min-h-screen  px-12 py-8">
      <div className="">
        <div className="flex flex-col xl:flex-row gap-6 w-full">
          {/* Left Column - Code Editor */}
          <div className="w-full xl:w-1/2">
            <div
              className="w-full rounded-2xl relative hover:border-yellow-500/30 transition-all duration-500 transform hover:scale-[1.01]"
              style={panelStyle}
            >
              <div className="px-4 py-4 border-b border-[#3E4343]/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Code className="h-5 w-5 text-[#FFDF00]" />
                  <h3 className="text-white font-semibold text-lg">
                    Code Editor
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[130px] text-[#FFDF00] border-[#FFDF00]/50 bg-[#0E1313]/80 hover:border-[#FFDF00] transition-colors">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0E1313] border-[#3E4343]">
                      <SelectItem
                        value="javascript"
                        className="cursor-pointer text-white hover:bg-[#FFDF00]/20"
                      >
                        JavaScript
                      </SelectItem>
                      <SelectItem
                        value="cpp"
                        className="cursor-pointer text-white hover:bg-[#FFDF00]/20"
                      >
                        C++
                      </SelectItem>
                      <SelectItem
                        value="python"
                        className="cursor-pointer text-white hover:bg-[#FFDF00]/20"
                      >
                        Python
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    className="cursor-pointer flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={onCodeSubmit}
                    disabled={codeRunning}
                  >
                    {codeRunning ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {codeRunning ? "Running..." : "Run Code"}
                  </Button>
                </div>
              </div>

              <div className="rounded-b-2xl overflow-hidden">
                <Editor
                  height="65vh"
                  width="100%"
                  language={language}
                  value={code}
                  onChange={handleEditorChange}
                  onMount={handleEditorDidMount}
                  options={{
                    autoIndent: "full",
                    formatOnPaste: true,
                    formatOnType: true,
                    wordWrap: "on",
                  }}
                  loading={
                    <div className="flex items-center justify-center h-full text-[#FFDF00]">
                      Loading editor...
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          {/* Right Column - Input and Output */}
          <div className="w-full xl:w-1/2 flex flex-col gap-6">
            {/* Input Panel */}
            <div
              className="rounded-2xl relative hover:border-yellow-500/30 transition-all duration-500 transform hover:scale-[1.02]"
              style={panelStyle}
            >
              <div className="px-4 py-4 border-b border-[#3E4343]/50 flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <FileText className="h-5 w-5 text-[#FFDF00]" />
                <h3 className="text-white font-semibold text-lg">Input</h3>
              </div>

              <div className="p-4">
                <textarea
                  value={input}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-full h-32 px-4 py-3 bg-[#0E1313]/90 border border-[#3E4343]/50 rounded-xl text-white focus:border-[#FFDF00] focus:outline-none resize-none font-mono text-sm transition-all duration-300 hover:border-[#3E4343] placeholder-gray-500"
                  placeholder="Enter your input here..."
                />
              </div>
            </div>

            {/* Output Panel */}
            <div
              className="rounded-2xl relative hover:border-yellow-500/30 transition-all duration-500 transform hover:scale-[1.02] flex-1"
              style={panelStyle}
              ref={outputRef}
            >
              <div className="px-4 py-4 border-b border-[#3E4343]/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <Terminal className="h-5 w-5 text-[#FFDF00]" />
                  <h3 className="text-white font-semibold text-lg">Output</h3>
                </div>
                <div className="flex gap-3 items-center">
                  <Button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
                    onClick={onShare}
                    disabled={codeRunning}
                  >
                    <Share className="w-4 h-4" />
                    <span className="font-medium">Share</span>
                  </Button>

                  <Button
                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={onReset}
                    disabled={codeRunning}
                  >
                    Reset
                  </Button>
                </div>
              </div>
              <div className="h-48 lg:h-[31vh] p-4 text-gray-300 overflow-auto font-mono whitespace-pre-wrap bg-[#0E1313]/50 rounded-b-2xl">
                <p className={`${getOutputStyle()} leading-relaxed`}>
                  {output}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0E1313] border-[#3E4343]">
          <DialogHeader>
            <DialogTitle className="text-white">Share Code</DialogTitle>
            <DialogDescription className="text-gray-400">
              Here's a link to share your code:
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="w-full px-3 py-2 rounded-md border border-[#3E4343] bg-[#0E1313] text-white focus:border-[#FFDF00] focus:outline-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyShareUrl}
              className="border-[#3E4343] hover:border-[#FFDF00] hover:bg-[#FFDF00]/10"
            >
              <Copy className="h-4 w-4 text-[#FFDF00]" />
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-[#FFDF00] text-black hover:bg-[#FFDF00]/90"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

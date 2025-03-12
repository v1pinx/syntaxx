'use client'
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Check, Copy, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import Background from "@/app/components/Background";
import Footer from "@/app/components/Footer";

export default function GistPage() {
    const params = useParams();
    const [username, setUsername] = useState("");
    const [language, setLanguage] = useState("");
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGist = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/api/share?id=${params.id}`);
                if (response.status === 200) {
                    setUsername(response.data.data.username);
                    setLanguage(response.data.data.language);
                    setCode(response.data.data.code);
                    setTitle(response.data.data.title || "Shared Code");
                }
            } catch (err) {
                console.error("Error fetching gist:", err);
                setError("Failed to load shared code. It might have been removed or is unavailable.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchGist();
    }, [params.id]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Code copied to clipboard!");

        // Reset copy state after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const downloadCode = () => {
        const element = document.createElement("a");
        const file = new Blob([code], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `${title.replace(/\s+/g, "-").toLowerCase()}.${getFileExtension(language)}`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        toast.success("Code downloaded successfully!");
    };

    const shareGist = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Share link copied to clipboard!");
    };

    const getFileExtension = (lang: string): string => {
        const extensionMap: { [key: string]: string } = {
            "javascript": "js",
            "python": "py",
            "java": "java",
            "c++": "cpp",
        };

        return extensionMap[lang.toLowerCase()] || "txt";
    };

    const formatDate = (date: any) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    // Get current date for display
    const currentDate = formatDate(new Date());

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1313] relative overflow-hidden">
                <Background />
                <div className="z-10 animate-pulse">
                    <div className="h-6 w-32 bg-[#1A1D1D] rounded mb-4"></div>
                    <div className="h-64 w-full max-w-3xl bg-[#1A1D1D] rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1313] relative overflow-hidden">
                <Background />
                <div className="z-10 text-center p-6">
                    <h2 className="text-xl md:text-2xl text-white font-bold mb-4">Code Not Found</h2>
                    <p className="text-[#6C7070] mb-6">{error}</p>
                    <Button
                        className="bg-yellow-500 text-black cursor-pointer hover:bg-yellow-400 px-6"
                        onClick={() => window.location.href = "/"}
                    >
                        Return Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#0E1313] relative overflow-hidden">
            <Background />

            <main className="flex-grow container mx-auto px-4 py-12 z-10 animate-[fadeIn_0.8s_ease-in]">
                <div className="max-w-5xl mx-auto">
                    {/* Header info */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl text-white font-bold mb-2">{title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6C7070]">
                            <div>Created by <span className="text-yellow-500">{username}</span></div>
                            <div>•</div>
                            <div>Shared on {currentDate}</div>
                            <div>•</div>
                            <div className="px-2 py-1 bg-[#1A1D1D] rounded text-white">{language}</div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        <Button
                            onClick={copyToClipboard}
                            className="bg-[#1A1D1D] text-white hover:bg-[#2A2D2D] flex items-center gap-2"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? "Copied!" : "Copy Code"}
                        </Button>
                        <Button
                            onClick={downloadCode}
                            className="bg-[#1A1D1D] text-white hover:bg-[#2A2D2D] flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                        <Button
                            onClick={shareGist}
                            className="bg-[#1A1D1D] text-white hover:bg-[#2A2D2D] flex items-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Share
                        </Button>
                    </div>

                    {/* Code display */}
                    <div className="rounded-lg border border-[#3E4343] overflow-hidden">
                        <div className="px-4 py-2 bg-[#1A1D1D] border-b border-[#3E4343] flex justify-between items-center">
                            <div className="text-sm text-white font-medium">{title}</div>
                            <div className="text-xs text-[#6C7070]">{language}</div>
                        </div>
                        <div className="p-4 bg-[#0E1313] overflow-x-auto">
                            <pre className="text-[#E0E0E0] whitespace-pre-wrap"><code>{code}</code></pre>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
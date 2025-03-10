'use client'
import { Button } from "@/components/ui/button";
import { Code, Users, Terminal, RefreshCw, Cloud } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Link from "next/link";
export default function Welcome() {
    const router = useRouter();
    const [currentFeature, setCurrentFeature] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const features = [
        {
            title: "Integrated Terminal",
            description: "Execute commands, run scripts, and test your code directly within the editor interface.",
            icon: <Terminal className="w-8 h-8 text-yellow-500" />
        },
        {
            title: "Cloud Storage (Coming Soon)",
            description: "Save your code to the cloud and access it from anywhere. Never lose a single line of code again.",
            icon: <Cloud className="w-8 h-8 text-yellow-500" />
        },
        {
            title: "Real-time Collaboration (Coming Soon)",
            description: "Code together with your team in real-time. See changes as they happen and collaborate efficiently.",
            icon: <Users className="w-8 h-8 text-yellow-500" />
        }
    ];

    const testimonials = [
        {
            quote: "Tashou no kōdo edita o tameshite kita kedo, kore wa pafōmansu to kinō ga chō yabee, dattebayo! Ima wa mainichi tsukatteru",
            author: "Uzumaki Naruto",
            role: "Leaf Shinobi"
        },
        {
            quote: "I've tried many code editors over the years, but this one stands out for its performance and thoughtful features. It's now my daily driver.",
            author: "Vipin K.",
            role: "Full Stack Developer"
        },{
            quote: "मैंने वर्षों में कई कोड एडिटर आज़माए हैं, लेकिन यह अपने प्रदर्शन और सूझबूझ भरी विशेषताओं के कारण सबसे अलग है। अब यह मेरा दैनिक उपयोग का एडिटर बन गया है।",
            author: "Dhruv",
            role: "Ethical Hacker"
        }
    ];

    const stats = [
        { value: "1+", label: "Active Users" },
        { value: "3+", label: "Languages Supported" },
        { value: "100%", label: "Uptime" }
    ];


    // Auto-rotate features
    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentFeature((prev) => (prev + 1) % features.length);
                setIsVisible(true);
            }, 300);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Demo code for the animated code preview
    const demoCode = `function matrixChainMultiplication(arr) {
  const n = arr.length;
  const dp = Array(n).fill(null).map(() => Array(n).fill(0));

  for (let len = 2; len < n; len++) {
    for (let i = 1; i < n - len + 1; i++) {
      let j = i + len - 1;
      dp[i][j] = Infinity;

      for (let k = i; k < j; k++) {
        let cost = dp[i][k] + dp[k + 1][j] + arr[i - 1] * arr[k] * arr[j];
        dp[i][j] = Math.min(dp[i][j], cost);
      }
    }
  }

  return dp[1][n - 1];
}

const dimensions = [40, 20, 30, 10, 30];
console.log("Minimum number of multiplications:", matrixChainMultiplication(dimensions));
`;


    return (
        <div className="min-h-screen flex flex-col bg-[#0E1313]  overflow-hidden py-16">

            {/* Hero Section */}
            <div className="px-4 mt-8 md:mt-16 z-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 animate-[fadeIn_1s_ease-in]">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            Code Smarter,<br />
                            <span className="text-yellow-500">Build Faster</span>
                        </h1>
                        <p className="text-lg text-[#6C7070] mb-8 max-w-lg">
                            A powerful, modern code editor designed for modern developers.
                            Write better code, collaborate in real-time, and save your code to the cloud.
                        </p>
                        <Link className="flex flex-wrap gap-4" href="/code">
                            <Button
                                className="bg-yellow-500 text-black cursor-pointer hover:bg-yellow-400 px-8 py-6 h-auto text-lg font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                                onClick={() => router.push("/")}
                            >
                                Try CodeEditor
                            </Button>
                        </Link>
                    </div>

                    {/* Code Editor Preview */}
                    <div className="md:w-1/2 animate-[slideUp_1.2s_ease-out]">
                        <div
                            className="w-full rounded-xl overflow-hidden border border-[#3E4343] bg-[#0A0C0C] shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
                            style={{
                                boxShadow: '0 0 40px rgba(255, 204, 0, 0.1)'
                            }}
                        >
                            {/* Editor Header */}
                            <div className="bg-[#1A1D1D] px-4 py-3 flex items-center justify-between border-b border-[#3E4343]">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                                    <span className="text-[#6C7070] text-sm ml-2">matrixChainMultiplication.js</span>
                                </div>
                                <Code className="w-5 h-5 text-yellow-500" />
                            </div>

                            {/* Editor Content */}
                            <div className="px-4 py-3 overflow-x-auto">
                                <pre className="text-[#E0E0E0] text-sm font-mono">
                                    <code className="whitespace-pre-wrap">{demoCode}</code>
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="mt-32 px-4 z-10 max-w-7xl mx-auto w-full animate-[fadeIn_1.4s_ease-in]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Built for Modern Developers
                    </h2>
                    <p className="text-[#6C7070] text-lg max-w-2xl mx-auto">
                        Our editor gives you the tools you need to build incredible software
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                    {/* Feature Selector */}
                    <div className="md:w-1/2 flex flex-col gap-6">
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setIsVisible(false);
                                    setTimeout(() => {
                                        setCurrentFeature(index);
                                        setIsVisible(true);
                                    }, 300);
                                }}
                                className={`text-left p-6 rounded-xl transition-all duration-300 border ${currentFeature === index
                                    ? 'bg-[#1A1D1D]/90 border-yellow-500/50'
                                    : 'bg-transparent border-[#3E4343]/30 hover:border-[#3E4343]'
                                    }`}
                            >
                                <h3 className={`text-xl font-semibold mb-2 ${currentFeature === index ? 'text-white' : 'text-[#A0A0A0]'
                                    }`}>
                                    {feature.title}
                                </h3>
                                <p className={`${currentFeature === index ? 'text-[#E0E0E0]' : 'text-[#6C7070]'
                                    }`}>
                                    {feature.description}
                                </p>
                            </button>
                        ))}
                    </div>

                    {/* Feature Showcase */}
                    <div
                        className={`md:w-1/2 flex items-center justify-center p-8 bg-[#1A1D1D]/30 rounded-xl border border-[#3E4343]/50 h-[400px] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div className="text-center">
                            {features[currentFeature].icon}
                            <h3 className="text-2xl font-bold text-white mt-6 mb-4">
                                {features[currentFeature].title}
                            </h3>
                            <p className="text-[#6C7070] max-w-md">
                                {features[currentFeature].description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="mt-32 px-4 z-10 max-w-7xl mx-auto w-full animate-[fadeIn_1.6s_ease-in]">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Loved by Developers
                    </h2>
                    <p className="text-[#6C7070] text-lg max-w-2xl mx-auto">
                        Join thousands of developers who've upgraded their coding experience
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="p-6 bg-[#1A1D1D]/30 rounded-xl border border-[#3E4343]/50 hover:border-yellow-500/30 transition-all duration-300"
                        >
                            <p className="text-[#E0E0E0] mb-6">"{testimonial.quote}"</p>
                            <div>
                                <p className="text-white font-medium">{testimonial.author}</p>
                                <p className="text-[#6C7070] text-sm">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="mt-32 px-4 z-10 max-w-7xl mx-auto w-full animate-[fadeIn_1.8s_ease-in]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-[#1A1D1D]/30 rounded-xl border border-[#3E4343]/50"
                        >
                            <p className="text-4xl font-bold text-yellow-500 mb-2">{stat.value}</p>
                            <p className="text-[#6C7070]">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="mt-32 mb-24 px-4 z-10 max-w-5xl mx-auto w-full animate-[fadeIn_2s_ease-in]">
                <div className="p-12 bg-gradient-to-br from-[#1A1D1D] to-[#0E1313] rounded-2xl border border-[#3E4343] text-center">
                    <div className="mx-auto w-16 h-16 bg-yellow-500/10 flex items-center justify-center rounded-full mb-6">
                        <RefreshCw className="w-8 h-8 text-yellow-500" />
                    </div>
                    <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">Ready to transform your coding experience?</h2>
                    <p className="text-[#6C7070] mb-8 max-w-2xl mx-auto">
                        Join SyntaxX, the best code editor for modern developers.
                        Try it free, Tumhara bhai hai na, free mai provide kra rha hai.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            className="bg-yellow-500 text-black cursor-pointer hover:bg-yellow-400 px-8 py-6 h-auto text-lg font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                            onClick={() => router.push("/code")}
                        >
                            Try CodeEditor for free
                        </Button>
                        <Button
                            variant="outline"
                            className="border-[#3E4343] cursor-pointer hover:text-yellow-500 hover:border-yellow-500 px-8 py-6 h-auto text-lg font-medium rounded-2xl transition-all duration-300"
                            onClick={() => router.push("/pricing")}
                        >
                            View Pricing
                        </Button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
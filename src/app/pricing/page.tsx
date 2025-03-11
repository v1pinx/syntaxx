'use client'
import { Button } from "@/components/ui/button";
import { Check, Code, Zap, Terminal, Server, Gift } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Background from "@/app/components/Background";
import Footer from "../components/Footer";

export default function Pricing() {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState('onetime');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (planType: string) => {
        setIsLoading(true);
        const token = getCookie("token");
        
        if (!token) {
            toast.error("Please login to subscribe");
            router.push("/login");
            setIsLoading(false);
            return;
        }

        try {
            // Mock subscription process
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Successfully subscribed to ${planType} plan!`);
            router.push("/editor");
        } catch (error) {
            toast.error("Subscription failed. Please try again.");
        }

        setIsLoading(false);
    };

    const plans = [
        {
            name: "Free",
            description: "Ideal for simple code editing",
            price: "₹0",
            duration: "forever",
            features: [
                "Basic Code Editor",
                "Community support"
            ],
            buttonText: "Get Started",
            highlight: false,
            icon: <Gift className="w-6 h-6 text-white mb-2" />
        },
        {
            name: "Pro",
            description: "For serious developers and teams",
            price: "₹1",
            duration: "forever",
            savings: "Save 50%",
            features: [
                "Cloud storage",
                "Enhanced syntax highlighting",
                "Collaboration tools",
                "Priority support"
                
            ],
            buttonText: "Upgrade Now",
            highlight: true,
            icon: <Terminal className="w-6 h-6 text-yellow-500 mb-2" />
        },
    ];
    

    const features = [
        {
            title: "Multi-language Support",
            description: "Support for over 3+ programming languages with specialized syntax highlighting and language tools."
        },
        {
            title: "Integrated Terminal",
            description: "Run commands, scripts, and tests directly from within the editor environment."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E1313] relative overflow-hidden py-16">
            <Background />

            {/* Header section */}
            <div className="text-center mb-12 z-10 animate-[fadeIn_0.8s_ease-in] px-4">
                <div className="animate-[bounce_1s_ease-in-out] mb-4">
                    <Code className="mx-auto w-12 h-12 md:w-16 md:h-16 text-white hover:text-yellow-500 transition-colors duration-300" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-4">
                    Choose Your Coding Experience
                </h1>
                <p className="text-[#6C7070] text-lg md:text-xl max-w-2xl mx-auto">
                    Unlock powerful developer tools with our flexible plans. Code without limits.
                </p>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16 z-10 px-4 animate-[fadeIn_0.9s_ease-in]">
                {features.map((feature, index) => (
                    <div 
                        key={index} 
                        className="p-6 bg-[#1A1D1D]/60 backdrop-blur-sm rounded-xl border border-[#3E4343]/50 hover:border-yellow-500/30 transition-all duration-300"
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-sm text-[#6C7070]">{feature.description}</p>
                    </div>
                ))}
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center mb-12 z-10 animate-[fadeIn_1s_ease-in]">
                <div 
                    className="flex p-1 bg-[#1A1D1D] rounded-lg border border-[#3E4343]"
                >
                    <button
                        onClick={() => setSelectedPlan('onetime')}
                        className={`px-6 py-2 rounded-md transition-all duration-300 flex items-center ${
                            selectedPlan === 'onetime' 
                                ? 'bg-yellow-500 text-black font-medium' 
                                : 'text-[#6C7070] hover:text-white'
                        }`}
                    >
                        One-time <Gift className="w-4 h-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Pricing cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 z-10 px-4 max-w-6xl mx-auto animate-[fadeIn_1.2s_ease-in]">
                {plans.map((plan, index) => (
                    <div 
                        key={index}
                        className={`w-full p-6 md:p-8 bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative animate-[slideUp_0.5s_ease-out] transition-all duration-300 hover:transform hover:scale-[1.03] ${
                            plan.highlight 
                                ? 'border-yellow-500/50 hover:border-yellow-500' 
                                : 'hover:border-yellow-500/20 border-[#3E4343]/50'
                        }`}
                        style={{ border: '1px solid' }}
                    >
                        {plan.highlight && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black text-xs font-bold px-4 py-1 rounded-full">
                                MOST POPULAR
                            </div>
                        )}
                        
                        <div className="flex flex-col items-center md:items-start">
                            {plan.icon}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-[#6C7070] mb-6 text-center md:text-left">{plan.description}</p>
                        </div>
                        
                        <div className="mb-6">
                            <div className="flex items-end">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                <span className="text-[#6C7070] ml-2">/{plan.duration}</span>
                            </div>
                            {plan.savings && (
                                <div className="mt-2 text-yellow-500 text-sm font-medium">
                                    {plan.savings}
                                </div>
                            )}
                        </div>
                        
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((feature, fIndex) => (
                                <li key={fIndex} className="flex items-start">
                                    <Check className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                                    <span className="text-[#E0E0E0]">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <Button
                            onClick={() => handleSubscribe(plan.name)}
                            className={`w-full h-11 text-md rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 ${
                                plan.highlight 
                                    ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                                    : 'bg-[#3E4343] text-white hover:bg-[#4a5151]'
                            } ${isLoading ? 'animate-pulse' : ''}`}
                            disabled={isLoading}
                        >
                            {plan.buttonText}
                        </Button>
                    </div>
                ))}
            </div>

            {/* Language support section */}
            <div className="mt-24 z-10 px-4 max-w-4xl mx-auto animate-[fadeIn_1.3s_ease-in]">
                <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 text-center">Supported Languages & Frameworks</h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'].map((lang, index) => (
                        <div 
                            key={index}
                            className="px-4 py-3 bg-[#1A1D1D]/40 rounded-lg border border-[#3E4343]/30 text-center text-[#E0E0E0] text-sm hover:border-yellow-500/30 transition-all duration-300"
                        >
                            {lang}
                        </div>
                    ))}
                </div>
            </div>



            {/* CTA section */}
            <div className="mt-24 px-4 w-full max-w-4xl mx-auto animate-[fadeIn_1.5s_ease-in] z-10">
                <div className="p-8 md:p-12 bg-gradient-to-br from-[#1A1D1D] to-[#0E1313] rounded-2xl border border-[#3E4343] text-center">
                    <h2 className="text-2xl md:text-3xl text-white font-bold mb-4">Start Coding Today</h2>
                    <p className="text-[#6C7070] mb-8 max-w-xl mx-auto">
                        Experience the power of our code editor with a free account. No credit card required.
                    </p>
                    <Button 
                        className="bg-yellow-500 text-black cursor-pointer hover:bg-yellow-400 px-8 py-6 h-auto text-lg font-medium rounded-2xl transition-all duration-300 transform hover:scale-[1.02]"
                        onClick={() => router.push("/signup")}
                    >
                        Try It Free
                    </Button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
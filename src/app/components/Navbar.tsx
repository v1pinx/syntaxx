import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Blocks, Code, Share, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Navbar() {

    const panelStyle = {
        border: '1px solid rgba(62, 67, 67, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.5s ease-out'
    };

    return (
        <div className="p-4 relative" >
            <nav className="bg-[#0E1313] rounded-lg flex items-center justify-between p-5 shadow-md" style={panelStyle}>
                <div className="flex gap-3 items-center">
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div
                            className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-all duration-500 blur-xl"
                        />

                        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                            <Code className="w-6 h-6 text-blue-400 transform transition-transform duration-500" />
                        </div>

                        <div className="relative">
                            <span
                                className="block text-lg font-semibold bg-gradient-to-r 
                                    from-blue-400 to-purple-400 text-transparent bg-clip-text"
                            >
                                SyntaxX
                            </span>
                            <span className="block text-xs text-blue-400/60 font-medium">
                                Modern Code Editor
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-amber-500/20
                                    hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                                    to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all 
                                    duration-300"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
                        <span className="text-sm font-medium text-amber-400 hover:text-amber-300">
                            Pro
                        </span>
                    </Link>
                    <Button className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white hover:text-white 
                                        transition-colors duration-300 cursor-pointer"
                    >
                        <Share className="w-4 h-4" />
                        <span className="text-sm font-medium text-white">
                            Share Code
                        </span>
                    </Button>
                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
                        <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </nav>
        </div>
    );
}

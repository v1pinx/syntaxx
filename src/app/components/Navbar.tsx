'use client'
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Code, LogOut, Settings, Sparkles, User } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from 'cookies-next';
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function Navbar() {
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await getCookie("token");
            if (!token) {
                return;
            }
            const data = await axios.post('/api/verify-token', {
                token: token,
            });
            if (data.status == 200) {
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        };

        checkAuth();
    }, []);

    const panelStyle = {
        border: '1px solid rgba(62, 67, 67, 0.5)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        animation: 'slideUp 0.5s ease-out'
    };

    const handleLogout = () => {
        deleteCookie("token");
        setIsLogin(false);
    }

    return (
        <div className="mx-10 my-6 relative" >
            <nav className="bg-[#0E1313] rounded-lg flex items-center justify-between p-5 shadow-md" style={panelStyle}>
                <div className="flex gap-3 items-center">
                    <Link href="/" className="flex items-center gap-3 group relative">
                        <div
                            className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg opacity-0 
                                    group-hover:opacity-100 transition-all duration-500 blur-xl"
                        />

                        <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                            <Code className="w-6 h-6 text-yellow-400 transform transition-transform duration-500" />
                        </div>

                        <div className="relative">
                            <span
                                className="block text-lg font-semibold bg-gradient-to-r 
                                    from-yellow-500 to-orange-500 text-transparent bg-clip-text"
                            >
                                SyntaxX
                            </span>
                            <span className="block text-xs text-white/80 font-medium">
                                Modern Code Editor
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex  justify-end gap-4">
                    <Link href="https://github.com/v1pinx/syntaxx" target="_blank" className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-all duration-300">
                        <IoLogoGithub className="w-7 h-7 text-white" />
                    </Link>
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
                    {!isLogin && (
                        <Link href="/Login">
                            <Button variant="outline" className="cursor-pointer rounded-md">Login</Button>
                        </Link>
                    )}
                    {isLogin && (
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Avatar className="cursor-pointer hover:opacity-80 transition-opacity duration-200">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="Your Avatar" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" /> Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}

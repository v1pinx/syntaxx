'use client'
import Navbar from "@/app/components/Navbar";
import CodeEditor from "./code/CodeEditor";
import Background from "./components/Background";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import Welcome from "./welcome/page";

export default function Home() {


    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#0E1313]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen  items-center justify-center bg-[#0E1313] relative overflow-hidden">
            <Background />
            <Navbar />
            <Welcome />
        </div>
    );
}

import Navbar from "@/app/components/Navbar";
import CodeEditor from "./components/CodeEditor";
import Background from "./components/Background";

export default function Home() {
    return (
        <div className="min-h-screen  items-center justify-center bg-[#0E1313] relative overflow-hidden">
            <Background />
            <Navbar />
            <CodeEditor />
        </div>
    );
}

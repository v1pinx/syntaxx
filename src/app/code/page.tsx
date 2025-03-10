import CodeEditor from "./CodeEditor";
import Background from "../components/Background";
import Navbar from "../components/Navbar";

export default function Code() {
    return (
        <div className="min-h-screen  items-center justify-center bg-[#0E1313] relative overflow-hidden">
            <Background />
            <Navbar />
            <CodeEditor />
        </div>
    )
}
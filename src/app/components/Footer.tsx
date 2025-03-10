export default function Footer() {
    return (
        <div className="mt-24 text-center z-10 px-4 w-full max-w-6xl mx-auto animate-[fadeIn_1.6s_ease-in]">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#3E4343]" />
                </div>
            </div>

            <p className="mt-8 text-[#6C7070] text-sm">
                &copy; {new Date().getFullYear()} CodeEditor. All rights reserved.
            </p>
        </div>
    )
}

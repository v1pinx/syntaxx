'use client'
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Code } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { IoEyeSharp, IoEyeOffSharp } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from "react-hot-toast";
import Background from "@/app/components/Background";

const formSchema = z.object({
    username: z.string().min(1),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6),
})

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth', {
                type: 'signup',
                username: data.username,
                email: data.email,
                password: data.password,
            });
            if (response.status == 201) {
                toast.success("Signup successful");
                router.push('/login');
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    const errorMessage = error.response?.data?.message;
                    if (errorMessage === "Email already exists") {
                        toast.error("This email is already registered.");
                    } else if (errorMessage === "Missing required fields") {
                        toast.error("Please fill in all required fields.");
                    } else if (errorMessage === "Username is required") {
                        toast.error("Username is required for signup.");
                    } else {
                        toast.error(errorMessage || "Something went wrong.");
                    }
                } else {
                    toast.error("An unexpected error occurred.");
                }
            } else {
                toast.error("Failed to connect to the server.");
            }
        }
        setIsLoading(false);
    }

    const handleGoogleLogin = () => {
        window.location.href = "/api/auth/google";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0E1313] relative overflow-hidden">
            <Background />

            {/* Form container */}
            <div
                className="w-full max-w-lg mx-4 space-y-6 md:space-y-8 p-6 md:px-[4.5rem] md:py-12 bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative animate-[slideUp_0.5s_ease-out] hover:border-yellow-500/20 transition-all duration-300"
                style={{
                    border: '1px solid rgba(62, 67, 67, 0.5)',
                }}
            >
                <div className="animate-[bounce_1s_ease-in-out]">
                    <Code className="mx-auto w-12 h-12 md:w-16 md:h-16 text-white hover:text-yellow-500 transition-colors duration-300" />
                </div>

                <h2 className="text-center text-2xl md:text-3xl text-white font-semibold animate-[fadeIn_0.8s_ease-in]">
                    Welcome to SyntaxX
                </h2>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 animate-[fadeIn_1.4s_ease-in]">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#6C7070]">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="text"
                                            {...field}
                                            className="h-11 text-white rounded-lg border-[#6C7070] focus:border-yellow-500/50 focus:border-[3px] transition-colors duration-300 focus:text-yellow-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#6C7070]">Email address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="email"
                                            {...field}
                                            className="h-11 text-white rounded-lg border-[#6C7070] focus:border-yellow-500/50 focus:border-[3px] transition-colors duration-300 focus:text-yellow-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <FormLabel className="text-[#6C7070]">Password</FormLabel>
                                    </div>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                placeholder=""
                                                type={showPassword ? "text" : "password"}
                                                {...field}
                                                className="h-11 text-white rounded-lg border-[#6C7070] focus:border-yellow-500/50 focus:border-[3px] transition-colors duration-300 focus:text-yellow-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer hover:text-yellow-500 transition"
                                            >
                                                {showPassword ? <IoEyeOffSharp size={20} /> : <IoEyeSharp size={20} />}
                                            </button>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />;
                        <Button
                            type="submit"
                            className={`w-full h-11 bg-[#3E4343] text-md rounded-2xl transform hover:scale-[1.02] cursor-pointer transition-all duration-300 hover:bg-[#4a5151] ${isLoading ? 'animate-pulse' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Registering...' : 'Submit'}
                        </Button>
                    </form>
                </Form>

                <div className="relative animate-[fadeIn_1.6s_ease-in]">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#3E4343]" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="bg-[#0E1313] px-2 text-gray-500">or</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    className="w-full h-11 text-md rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 animate-[fadeIn_1.8s_ease-in]"
                    size="lg"
                    onClick={handleGoogleLogin}
                >
                    <FcGoogle />
                    Continue with Google
                </Button>

                <div className="mt-4 text-center text-sm animate-[fadeIn_2s_ease-in]">
                    <span className="text-gray-500">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-white hover:text-yellow-500 transition-colors duration-300">
                            Login
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}
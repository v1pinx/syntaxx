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
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import Background from "@/app/components/Background";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export default function Login() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

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
                router.push('/');
            } else {
                deleteCookie("token");
            }
        };

        checkAuth();
    }, []);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post("/api/auth", {
                type: "login",
                email: data.email,
                password: data.password,
            });
            if (response.status === 200) {
                toast.success("Login successful");
                setCookie('token', response.data.token);
                router.push("/");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    toast.error("Invalid password");
                } else if (error.response?.status === 404) {
                    toast.error("User not found");
                } else if (error.response?.status === 400) {
                    toast.error("Invalid request type");
                }
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
                    Log in to your account
                </h2>


                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 animate-[fadeIn_1.4s_ease-in]">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#6C7070]">Email address</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder=""
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
                                        <a
                                            href="/forgot-password"
                                            className="text-xs text-[#6C7070] hover:text-yellow-500 transition-colors duration-300"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <FormControl>
                                        <Input
                                            placeholder=""
                                            type="password"
                                            {...field}
                                            className="h-11 text-white rounded-lg border-[#6C7070] focus:border-yellow-500/50 focus:border-[3px] transition-colors duration-300 focus:text-yellow-500"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className={`w-full h-11 bg-[#3E4343] text-md rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:bg-[#4a5151] ${isLoading ? 'animate-pulse' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Submit'}
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
                        Don&apos;t have an account?{' '}
                        <a href="/signup" className="font-medium text-white hover:text-yellow-500 transition-colors duration-300">
                            Sign up
                        </a>
                    </span>

                </div>
            </div>
        </div>
    )
}
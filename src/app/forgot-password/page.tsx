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
import { Lock } from "lucide-react";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Background from "../components/Background";

const formSchema = z.object({
    email: z.string().email(""),
})

export default function ForgotPassword() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const response = await axios.post("/api/auth/forgot-password", {
                email: data.email,
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Password reset link sent to your email");
                router.push("/Login");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 404) {
                    toast.error("No account found with this email");
                } else {
                    toast.error("Unable to send password reset link");
                }
            }
        }

        setIsLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0E1313] relative overflow-hidden">
            <Background />

            <div
                className="w-full max-w-lg mx-4 space-y-6 md:space-y-8 p-6 md:px-[4.5rem] md:py-12 bg-[#0E1313]/50 backdrop-blur-md rounded-2xl relative animate-[slideUp_0.5s_ease-out] hover:border-yellow-500/20 transition-all duration-300"
                style={{
                    border: '1px solid rgba(62, 67, 67, 0.5)',
                }}
            >
                <div className="animate-[bounce_1s_ease-in-out]">
                    <Lock className="mx-auto w-12 h-12 md:w-16 md:h-16 text-white hover:text-yellow-500 transition-colors duration-300" />
                </div>

                <h2 className="text-center text-2xl md:text-3xl text-white font-semibold animate-[fadeIn_0.8s_ease-in]">
                    Reset Your Password
                </h2>

                <p className="text-center text-[#6C7070] -mt-6 text-sm md:text-base mb-6 animate-[fadeIn_1s_ease-in]">
                    Enter the email address associated with your account
                </p>

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
                                            placeholder="Enter your email"
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
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>
                    </form>
                </Form>

                <div className="mt-4 text-center text-sm animate-[fadeIn_2s_ease-in]">
                    <span className="text-gray-500">
                        Remember your password?{' '}
                        <a href="/Login" className="font-medium text-white hover:text-yellow-500 transition-colors duration-300">
                            Back to Login
                        </a>
                    </span>
                </div>
            </div>
        </div>
    )
}
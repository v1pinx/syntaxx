'use client';
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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { KeyRound } from "lucide-react";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import Background from "../components/Background";

const formSchema = z.object({
    newPassword: z.string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
            message: "Password must contain at least one letter and one number"
        })
})

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            newPassword: "",
        }
    })

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or expired reset link");
            router.push("/login");
        }
    }, [token, router]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (!token) return;

        setIsLoading(true);

        try {
            const response = await axios.post("/api/auth/reset-password", {
                token,
                newPassword: data.newPassword
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Password successfully reset");
                // router.push("/login");
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                if (error.response?.status === 400) {
                    toast.error("Invalid or expired reset token");
                } else if (error.response?.status === 401) {
                    toast.error("Unauthorized reset attempt");
                } else {
                    toast.error("Unable to reset password");
                }
            }
        }

        setIsLoading(false);
    }

    if (!token) return null;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6 animate-[fadeIn_1.4s_ease-in]">
                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[#6C7070]">New Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    {...field}
                                    className="h-11 text-white rounded-lg border-[#6C7070] focus:border-yellow-500/50 focus:border-[3px] transition-colors duration-300 focus:text-yellow-500"
                                />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className={`w-full h-11 bg-[#3E4343] text-md rounded-2xl cursor-pointer transform hover:scale-[1.02] transition-all duration-300 hover:bg-[#4a5151] ${isLoading ? 'animate-pulse' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? 'Updating...' : 'Reset Password'}
                </Button>
            </form>
        </Form>
    );
};

const FormSkeleton = () => (
    <div className="space-y-4 md:space-y-6">
        <div className="animate-pulse space-y-2">
            <div className="h-4 w-24 bg-gray-700 rounded"></div>
            <div className="h-11 bg-gray-700 rounded-lg"></div>
        </div>
        <div className="h-11 bg-gray-700 rounded-2xl animate-pulse"></div>
    </div>
);

export default function ResetPassword() {
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
                    <KeyRound className="mx-auto w-12 h-12 md:w-16 md:h-16 text-white hover:text-yellow-500 transition-colors duration-300" />
                </div>

                <h2 className="text-center text-2xl md:text-3xl text-white font-semibold animate-[fadeIn_0.8s_ease-in]">
                    Create New Password
                </h2>

                <p className="text-center text-[#6C7070] -mt-4 text-sm md:text-base mb-6 animate-[fadeIn_1s_ease-in]">
                    Enter a new strong password for your account
                </p>

                <Suspense fallback={<FormSkeleton />}>
                    <ResetPasswordForm />
                </Suspense>

                <div className="mt-4 text-center text-sm animate-[fadeIn_2s_ease-in]">
                    <span className="text-gray-500">
                        Remembered your password?{' '}
                        <a href="/login" className="font-medium text-white hover:text-yellow-500 transition-colors duration-300">
                            Back to Login
                        </a>
                    </span>
                </div>
            </div>
        </div>
    );
}
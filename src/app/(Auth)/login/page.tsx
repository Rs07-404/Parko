"use client";
import { Button } from "@/components/ui/button"
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from "@/actions/auth/login";
import { LoaderCircleIcon, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { LoginFormData, loginFormSchema } from "@/interfaces/zod/schema/auth";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { InputController } from "@/components/FormControls/InputController";
import { useState } from "react";

const Login = () => {
    const { theme, setTheme } = useTheme();
    const [ loading, setLoading ] = useState<boolean>(false);

    const loginForm = useForm({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleLogin = async (data: LoginFormData) => {
        try {
            setLoading(true);
            const response = await login(data);
            const responseData = await response.json();
            // Check if the response is okay
            if (!response.ok) {
                throw new Error(responseData.error);
            }
            toast.success("Login Successful");
            setLoading(false);
            // redirect("/home");

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message ?? "Login failed");
            } else {
                toast.error("Unexpected Error Occured");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <FormProvider {...loginForm}>
            <form className="flex flex-col gap-4 p-4 transition-all animate-fade-in" onSubmit={loginForm.handleSubmit(handleLogin)}>
                <div className="text-2xl items-center text-center flex">
                    <div>Login</div>
                    <div className="ml-auto">
                        <Button
                            variant="ghost"
                            type="button"
                            className="w-8 h-8 p-0 rounded-full bg-accent/80 hover:bg-accent dark:hover:bg-slate-800 transition-colors duration-200 ease-in-out"
                            onClick={() => {
                                setTheme(theme === "dark" ? "light" : "dark");
                            }}
                        >
                            <SunDim className="dark:hidden" />
                            <Moon className="hidden dark:inline" />
                        </Button>
                    </div>
                </div>
                <div className="text-muted-foreground text-sm">Please enter your login details below to proceed</div>
                <div className="flex flex-col space-y-4">
                    <InputController type="text" label="Email" name="email" autoComplete="off" />
                    <InputController type="password" label="Password" name="password" autoComplete="off" />
                    <Button className="btn" type="submit" disabled={loading}>{loading ? <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" /> : "Login"}</Button>
                </div>
                <div>Create a new account? <span className="cursor-pointer underline" onClick={()=>{redirect("/signup")}}>Sign Up</span></div>
            </form>
        </FormProvider>
    );
}

export default Login;
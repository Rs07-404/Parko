"use client";
import { Button } from "@/components/ui/button"
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from "@/actions/auth/login";
import { FloatingLabelInput } from "@/components/customs/floatinglabeledinput";
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";

const SignUpSchema = z.object({
    email: z.string().email().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),
    password: z.string().min(6),
});

const SignUP = () => {
    const { theme, setTheme } = useTheme();

    const SignupForm = useForm({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    return (
        <form className="flex flex-col gap-4" onSubmit={SignupForm.handleSubmit(login)}>
            <div className="text-2xl items-center text-center flex">
                <div>Sign Up</div>
                <div className="ml-auto">
                    <Button
                        variant="ghost"
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
            <div className="text-muted-foreground text-sm">Please enter details below to proceed</div>
            <div className="flex flex-col space-y-4">
                <FloatingLabelInput type="text" label="Email" name="email" autoComplete="off" />
                <FloatingLabelInput type="password" label="Password" name="password" autoComplete="off" />
                <Button className="btn" type="submit">Sign Up</Button>
            </div>
        </form>
    );
}

export default SignUP;
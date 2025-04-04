"use client";
import { Button } from "@/components/ui/button"
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { InputController } from "@/components/FormControls/InputController";
import { redirect } from "next/navigation";
import { SignupFormData, signupFormSchema } from "@/interfaces/zod/schema/auth";
import { signup } from "@/actions/auth/signup";
import { toast } from "sonner";
import { useState } from "react";


const SignUP = () => {
    const { theme, setTheme } = useTheme();
    const [ loading, setLoading ] = useState<boolean>(false);

    const SignupForm = useForm({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const handleSignUp = async (data: SignupFormData) => {
        try{
            setLoading(true);
            const response  = await signup(data);
            const responseData = await response.json();
            // Check if the response is okay
            if (!response.ok) {
                throw new Error(responseData.error);
            }
            toast.success("Signup Successful");
            setLoading(false);
            redirect("/home");
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message ?? "Signup failed");
            } else {
                toast.error("Unexpected Error Occured");
            }
        } finally {
            setLoading(false);
        }
    }


    return (
        <FormProvider {...SignupForm}>
            <form className="flex flex-col gap-4" onSubmit={SignupForm.handleSubmit(handleSignUp)}>
                <div className="text-2xl items-center text-center flex">
                    <div>Sign Up</div>
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
                <div className="text-muted-foreground text-sm">Please enter details below to proceed</div>
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-shrink gap-2">
                        <InputController type="text" label="First Name" name="firstName" autoComplete="off" className="flex-grow" />
                        <InputController type="text" label="Last Name" name="lastName" autoComplete="off" className="flex-grow" />
                    </div>
                    <div><InputController type="text" label="Email" name="email" autoComplete="off" /></div>
                    <div><InputController type="number" label="Mobile" name="mobile" autoComplete="off" /> </div>
                    <div><InputController type="password" label="Password" name="password" autoComplete="off" /></div>
                    <div><InputController type="password" label="Confirm Password" name="confirmPassword" autoComplete="off" /></div>
                    <Button type="submit">{loading ? "Loading..." : "Sign Up"}</Button>
                    <div>Already have an account? <span className="cursor-pointer underline" onClick={()=>{redirect("/login")}}>Login</span></div>
                </div>
            </form>
        </FormProvider>
    );
}

export default SignUP;
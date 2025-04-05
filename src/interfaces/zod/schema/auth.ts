import { ConfirmPasswordValidation, EmailValidation, FirstNameValidation, LastNameValidation, MobileValidation, PasswordValidation } from "@/lib/Validations/ZodValidations";
import z from "zod";

// Login Form
export const loginFormSchema = z.object({
    // email with email validator
    email: EmailValidation,
    // password with all password validators
    password: z.string(),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;

// Signup Form
export const signupFormSchema = z.object({
    firstName: FirstNameValidation,
    lastName: LastNameValidation,
    mobile: MobileValidation,
    email: EmailValidation,
    password:  PasswordValidation,
    confirm: ConfirmPasswordValidation,
});
export type SignupFormData = z.infer<typeof signupFormSchema>;
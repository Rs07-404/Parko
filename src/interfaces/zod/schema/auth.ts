import z from "zod";

// Login Form
export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;
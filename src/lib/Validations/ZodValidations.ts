import { z } from "zod";


// Validation for First Name
export const FirstNameValidation = z.string().trim()
    .regex(/^[A-Za-z]+$/, "First name contains only letters")
    .min(2, "First name must be valid")

// Validation for Last Name
export const LastNameValidation = z.string()
    .regex(/^[A-Za-z]+$/, "Last name contains only letters")
    .min(2, "Last name must be valid")

// Validation for Mobile Number
export const MobileValidation = z.string().min(10,"Mobile number must be exactly 10 digits long")
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits long")
    .regex(/^[0-9]+$/, "Mobile number must contain only digits")
    .regex(/^(?=.*[0-9])/, "Mobile number must contain at least one number")


export const EmailValidation = z.string()
    .email()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please type a valid email")


export const PasswordValidation = z.string()
    .min(3, "Password must be at least 6 characters long")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character")
    .regex(/^(?!.*\s)/, "Password must not contain spaces")

export const ConfirmPasswordValidation = z.string()
    .min(3, "Password must be at least 6 characters long")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/^(?=.*\d)/, "Password must contain at least one number")
    .regex(/^(?=.*[@$!%*?&])/, "Password must contain at least one special character")
    .regex(/^(?!.*\s)/, "Password must not contain spaces")
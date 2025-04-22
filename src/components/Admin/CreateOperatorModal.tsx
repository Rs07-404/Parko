"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAllParkingAreas } from "@/hooks/use-parkingAreas"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FloatingLabelInput } from "../ui/floating-input"
import { SelectController } from "../FormControls/selectController"
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from "@/components/ui/tooltip"
import { EmailValidation, FirstNameValidation, LastNameValidation, MobileValidation, PasswordValidation } from "@/lib/Validations/ZodValidations"
import { SearchableSelectController } from "../FormControls/SearchableSelectController"
import { toast } from "sonner"
import createOperator from "@/actions/operator/createOperator"
import { InputController } from "../FormControls/InputController"

// Define the form schema with Zod
const formSchema = z.object({
    firstName: FirstNameValidation,
    lastName: LastNameValidation,
    email: EmailValidation,
    password: PasswordValidation,
    role: z.enum(["EntryOperator", "ExitOperator", ""]),
    mobile: MobileValidation,
    parkingArea: z.string().min(1, "Please select a parking area"),
})

type FormValues = z.infer<typeof formSchema>

interface CreateOperatorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    postSubmitActions?: () => void
}

export function CreateOperatorDialog({ open, onOpenChange, postSubmitActions }: CreateOperatorDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { allParkingAreas, AllAreaLoading } = useAllParkingAreas()
    const [formData, setFormData] = useState<FormValues>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "",
        mobile: "",
        parkingArea: "",
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            role: "",
            mobile: "",
            parkingArea: "",
        },
    })

    useEffect(() => {
        form.setValue("firstName", formData.firstName, { shouldValidate: true })
        form.setValue("lastName", formData.lastName, { shouldValidate: true })
        form.setValue("email", formData.email, { shouldValidate: true })
        form.setValue("password", formData.password, { shouldValidate: true })
        form.setValue("role", formData.role, { shouldValidate: true })
        form.setValue("mobile", formData.mobile, { shouldValidate: true })
        form.setValue("parkingArea", formData.parkingArea, { shouldValidate: true })
    }, [formData])

    const handleSubmit = async (values: FormValues) => {
        setIsSubmitting(true)
        const { firstName, lastName, email, password, role, mobile, parkingArea } = formData

        if (!firstName || !lastName || !email || !password || !role || !mobile || !parkingArea) {
            toast.error("Please fill in all fields")
            setIsSubmitting(false)
            return
        }

        try {
            // Prepare the payload
            const payload = {
                email,
                userName: email,
                password,
                role,
                mobile,
                firstName,
                lastName,
                parkingArea
            }

            // Simulate API call
            const response = await createOperator(payload);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message)
            }
            form.reset()
            onOpenChange(false)
            toast.success("Operator created successfully")

            // On successful response
            if (postSubmitActions) {
                postSubmitActions()
            }

            // Close the dialog

            // Reset the form
        } catch (error) {
            console.error("Error creating operator:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Operator</DialogTitle>
                    <DialogDescription>Fill in the details to create a new operator account.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputController
                                label="First Name"
                                name="firstName"
                                type="text"
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            // control={form.control}
                            // placeholder="John"
                            />

                            <InputController
                                label="Last Name"
                                name="lastName"
                                type="text"
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            // control={form.control}
                            // placeholder="Doe"
                            />
                        </div>

                        <InputController
                            label="Email"
                            name="email"
                            type="email"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        // control={form.control}
                        // placeholder="john.doe@example.com"
                        />

                        <InputController
                            label="Password"
                            name="password"
                            type="password"
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        // control={form.control}
                        // placeholder="••••••••"
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <SelectController
                                name="role"
                                label="Role"
                                options={[{ value: "EntryOperator", label: "Entry Operator" }, { value: "ExitOperator", label: "Exit Operator" }]}
                                defaultValue=""
                                onValueChange={(value) => setFormData({ ...formData, role: value as "EntryOperator" | "ExitOperator" })}
                            />

                            <InputController
                                label="Mobile"
                                name="mobile"
                                type="tel"
                                maxLength={10}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            // control={form.control}
                            // placeholder="9845582352"
                            />
                        </div>


                        <SearchableSelectController
                            name="parkingArea"
                            label="Parking Area"
                            onValueChange={(value) => setFormData({ ...formData, parkingArea: value })}
                            options={allParkingAreas?.map(area => ({
                                value: area._id,
                                label: `${area.name} - ${area.address.slice(0, 20)}...`
                            })) ?? []}
                            placeholder="Select parking area"
                            required
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Operator"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

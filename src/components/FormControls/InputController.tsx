import { FloatingLabelInput } from "@/components/ui/floating-input";
import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { filterInputValue } from "@/lib/input-filter";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"

interface IInputControllerProps<T extends FieldValues>
    extends HTMLAttributes<HTMLInputElement> {
    control?: Control<T>;
    name: Path<T>;
    label: string;
    description?: string;
    className?: string;
    placeholder?: string;
    defaultValue?: PathValue<T, Path<T>> | undefined;
    maxLength?: number;
    minLength?: number;
    disabled?: boolean;
    readOnly?: boolean;
    reset?: boolean;
    required?: boolean;
    noSpace?: boolean;
    autoComplete?: string;
    type?: "alphaNum" | "email" | "number" | "text" | "password" | "tel" | "url" | "search" | "date" | "time" | "datetime-local" | "month" | "week" | "color" | "file";
    resetClick?: () => void;
}

export const InputController = <T extends FieldValues>({ name, label, reset, noSpace = false, ...rest }: IInputControllerProps<T>) => {
    const form = useFormContext();
    return (
        <FormField
            control={form.control}
            name={name}
            defaultValue={rest.defaultValue}
            rules={{ required: rest?.required ? `${label} is required` : undefined }}
            render={({ field }) => (
                <FormItem className="w-full">
                    <div className="relative">
                        <FloatingLabelInput
                            {...field}
                            id={name}
                            label={label}
                            className={rest?.className}
                            type={rest.type === 'number' ? 'text' : rest?.type ?? 'text'}
                            disabled={rest?.disabled}
                            readOnly={rest?.readOnly}
                            error={!!form.formState.errors[name]}
                            onChange={(e) => field.onChange(filterInputValue(rest?.type, e.target.value, noSpace))}
                            minLength={rest?.minLength}
                            maxLength={rest?.maxLength}
                            autoComplete={rest?.autoComplete}
                        />
                        {reset && field.value && <X onClick={() => form.resetField(name)}
                            className={cn("opacity-50 hover:opacity-100 size-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer")} />}
                    </div>
                    {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
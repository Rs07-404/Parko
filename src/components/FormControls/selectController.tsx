import { FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ISelectControllerProps<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement> {
  control?: Control<T>
  name: Path<T>
  label: string
  description?: string
  className?: string
  placeholder?: string
  defaultValue?: PathValue<T, Path<T>> | undefined
  disabled?: boolean
  required?: boolean
  reset?: boolean
  options: { value: string; label: string }[]
  onValueChange?: (value: string) => void
}

export const SelectController = <T extends FieldValues>({
  name,
  label,
  reset,
  options,
  ...rest
}: ISelectControllerProps<T>) => {
  const form = useFormContext()

  return (
    <FormField
      control={form.control}
      name={name}
      defaultValue={rest.defaultValue}
      rules={{ required: rest?.required ? `${label} is required` : undefined }}
      render={({ field }) => (
        <FormItem className="w-full">
          <div className="relative">
            <Select
              onValueChange={(value) => {
                field.onChange(value)
                rest.onValueChange?.(value)
              }}
              value={field.value}
              disabled={rest?.disabled}
            >
              <SelectTrigger className={cn("w-full", rest?.className)}>
                <SelectValue placeholder={rest?.placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {reset && field.value && (
              <X
                onClick={() => form.resetField(name)}
                className={cn(
                  "opacity-50 hover:opacity-100 size-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer"
                )}
              />
            )}
          </div>
          {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

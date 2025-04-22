import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import { HTMLAttributes, useState } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface ISearchableSelectControllerProps<T extends FieldValues>
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

export const SearchableSelectController = <T extends FieldValues>({
  name,
  label,
  reset,
  options,
  onValueChange,
  ...rest
}: ISearchableSelectControllerProps<T>) => {
  const form = useFormContext()
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              open={isOpen}
              onOpenChange={setIsOpen}
              onValueChange={(value) => {
                field.onChange(value)
                onValueChange?.(value)
              }}
              defaultValue={field.value}
              disabled={rest?.disabled}
            >
              <SelectTrigger className={cn("w-full", rest?.className)}>
                <SelectValue placeholder={rest?.placeholder || `Select ${label}`} />
              </SelectTrigger>
              <SelectContent className="w-[var(--radix-select-trigger-width)]">
                <div className="p-2">
                  <Input
                    placeholder={`Search ${label}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="mb-2"
                  />
                </div>
                <div className="max-h-[300px] overflow-auto">
                  {filteredOptions.length === 0 ? (
                    <div className="p-2 text-center text-sm">No {label.toLowerCase()} found.</div>
                  ) : (
                    filteredOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="truncate">
                        {option.label}
                      </SelectItem>
                    ))
                  )}
                </div>
              </SelectContent>
            </Select>
            {reset && field.value && (
              <X
                onClick={() => {
                  form.resetField(name)
                  setSearchQuery("")
                }}
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
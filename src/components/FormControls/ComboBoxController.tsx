import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { HTMLAttributes } from "react"
import { Control, FieldValues, Path, PathValue, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface IComboBoxControllerProps<T extends FieldValues>
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
}

export const ComboBoxController = <T extends FieldValues>({
  name,
  label,
  reset,
  options,
  ...rest
}: IComboBoxControllerProps<T>) => {
  const form = useFormContext()

  return (
    // <FormField
    //   control={form.control}
    //   name={name}
    //   defaultValue={rest.defaultValue}
    //   rules={{ required: rest?.required ? `${label} is required` : undefined }}
    //   render={({ field }) => (
    //     <FormItem className="flex flex-col">
    //       <FormLabel>{label}</FormLabel>
    //       <Popover>
    //         <PopoverTrigger asChild>
    //           <FormControl>
    //             <Button
    //               variant="outline"
    //               role="combobox"
    //               className={cn(
    //                 "w-full justify-between",
    //                 !field.value && "text-muted-foreground",
    //                 rest?.className
    //               )}
    //               disabled={rest?.disabled}
    //             >
    //               {field.value
    //                 ? options.find((option) => option.value === field.value)?.label
    //                 : rest?.placeholder || `Select ${label}`}
    //               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    //             </Button>
    //           </FormControl>
    //         </PopoverTrigger>
    //         <PopoverContent className="w-full p-0">
    //           <Command>
    //             <CommandInput placeholder={`Search ${label}...`} />
    //             <CommandList>
    //               <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
    //               <CommandGroup>
    //                 {options.map((option) => (
    //                   <CommandItem
    //                     key={option.value}
    //                     value={option.value}
    //                     onSelect={() => {
    //                       form.setValue(name, option.value as any, { shouldValidate: true })
    //                     }}
    //                   >
    //                     <Check
    //                       className={cn(
    //                         "mr-2 h-4 w-4",
    //                         option.value === field.value ? "opacity-100" : "opacity-0"
    //                       )}
    //                     />
    //                     {option.label}
    //                   </CommandItem>
    //                 ))}
    //               </CommandGroup>
    //             </CommandList>
    //           </Command>
    //         </PopoverContent>
    //       </Popover>
    //       {reset && field.value && (
    //         <X
    //           onClick={() => form.resetField(name)}
    //           className={cn(
    //             "opacity-50 hover:opacity-100 size-7 absolute right-1 top-1/2 -translate-y-1/2 px-1.5 font-normal cursor-pointer"
    //           )}
    //         />
    //       )}
    //       {rest?.description && <FormDescription>{rest?.description}</FormDescription>}
    //       <FormMessage />
    //     </FormItem>
    //   )}
    // />
    <></>
  )
}

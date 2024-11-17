import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'

const DropdownMenuRoot = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuContent = DropdownMenuPrimitive.Content

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    icon?: React.ReactNode
  }
>(({ className, children, icon, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className="flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
    {...props}
  >
    {icon && <span className="mr-2">{icon}</span>}
    {children}
  </DropdownMenuPrimitive.Item>
))
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
}) 
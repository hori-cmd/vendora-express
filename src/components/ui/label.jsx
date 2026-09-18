import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

// NOTE(backend): shadcn Label.
// Bind to an input using `htmlFor="my-input-id"` for accessibility + click
// focus behavior. Works well with the Input + Checkbox components.
const Label = forwardRef(function Label(
  { className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
})
Label.displayName = 'Label'

export { Label }

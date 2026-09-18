import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// NOTE(backend): Shared `cn` helper used by every shadcn component.
// Merge Tailwind classes safely and drop conflicting ones.
// Keep this in sync with shadcn defaults when you upgrade the CLI.
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

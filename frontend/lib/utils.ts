import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('GB', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function parseServerActionResponse<T>(response: T) {
  return JSON.parse(JSON.stringify(response))
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
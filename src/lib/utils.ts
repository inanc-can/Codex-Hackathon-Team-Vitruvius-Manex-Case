import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

export function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return "n/a"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatInt(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function humanizeToken(token: string): string {
  return token
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function formatRelativeWindow(dates: string[]): string {
  if (!dates || dates.length === 0) return "Recently"
  
  try {
    const validDates = dates.filter(Boolean).map(d => new Date(d))
    if (validDates.length === 0) return "Recently"
    
    const earliest = new Date(Math.min(...validDates.map(d => d.getTime())))
    const latest = new Date(Math.max(...validDates.map(d => d.getTime())))
    const days = Math.floor((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    if (days < 365) return `${Math.floor(days / 30)} months ago`
    return `${Math.floor(days / 365)} years ago`
  } catch {
    return "Recently"
  }
}


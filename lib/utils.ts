import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into regular JS OBJECT
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [int, decimal] = num.toString().split(".");
  return decimal ? `${int}.${decimal.padEnd(2, "0")}` : `${int}.00`;
}

type ErrorWithMessage = {
  name?: string;
  message?: string | unknown;
}

type ZodErrorType = ErrorWithMessage & {
  name: "ZodError";
  errors: Record<string, { message: string }>;
}

type PrismaRequestError = ErrorWithMessage & {
  name: "PrismaClientKnownRequestError";
  code: string;
  meta?: {
    target?: string[];
  };
}

export async function formatError(error: unknown): Promise<string> {
  if (typeof error === 'object' && error !== null && 
      'name' in error && error.name === 'ZodError' &&
      'errors' in error) {
    const zodError = error as ZodErrorType;
    const fieldErrors = Object.keys(zodError.errors).map(
      (field) => zodError.errors[field].message
    );
    return fieldErrors.join(". ");
  } 
  
  // Type guard for PrismaError
  if (typeof error === 'object' && error !== null &&
      'name' in error && error.name === 'PrismaClientKnownRequestError' &&
      'code' in error && error.code === 'P2002' &&
      'meta' in error) {
    const prismaError = error as PrismaRequestError;
    const field = prismaError.meta?.target ? prismaError.meta.target[0] : "Field";
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return typeof error === 'string' ? error : JSON.stringify(error);
}

export function round2(value: number | string) {
  if (typeof value === "number") {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === "string") {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error("Value is Not a number or a string");
  }
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
  minimumFractionDigits: 2,
});

export function formatCurrency(amount: number | string | null) {
  if (typeof amount === "number") {
    return CURRENCY_FORMATTER.format(amount);
  } else if (typeof amount === "string") {
    return CURRENCY_FORMATTER.format(Number(amount));
  } else {
    return "NaN";
  }
}

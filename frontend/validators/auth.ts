import { z } from "zod";

export const authInput = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .max(512, "Username cannot exceed 512 characters"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(512, "Password cannot exceed 512 characters")
    .regex(new RegExp(".*[A-Z].*"), "Password must contain at least one uppercase letter")
    .regex(new RegExp(".*[a-z].*"), "Password must contain at least one lowercase letter")
    .regex(new RegExp(".*\\d.*"), "Password must contain at least one number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}$;:\\\\].*"),
      "Password must contain at least one special character"
    ),
});

export const usernameInput = z.object({
  username: z
    .string()
    .min(6, "Username must be at least 6 characters long")
    .max(512, "Username cannot exceed 512 characters"),
})

export const passwordInput = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(512, "Password cannot exceed 512 characters")
    .regex(new RegExp(".*[A-Z].*"), "Password must contain at least one uppercase letter")
    .regex(new RegExp(".*[a-z].*"), "Password must contain at least one lowercase letter")
    .regex(new RegExp(".*\\d.*"), "Password must contain at least one number")
    .regex(
      new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}$;:\\\\].*"),
      "Password must contain at least one special character"
    ),
})
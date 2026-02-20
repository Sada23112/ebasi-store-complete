"use client"

export interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: string) => string | null
}

export interface ValidationRules {
  [key: string]: ValidationRule
}

export interface ValidationErrors {
  [key: string]: string
}

// Common validation patterns
export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[\d\s\-()]{10,}$/,
  indianPhone: /^[+]?91?[6-9]\d{9}$/,
  pincode: /^\d{6}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  name: /^[a-zA-Z\s]{2,}$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  sku: /^[A-Z0-9\-_]{3,}$/,
  price: /^\d+(\.\d{1,2})?$/,
}

// Validation functions
export const validateField = (value: string, rules: ValidationRule): string => {
  // Required check
  if (rules.required && (!value || value.trim() === "")) {
    return "This field is required"
  }

  // Skip other validations if field is empty and not required
  if (!value || value.trim() === "") {
    return ""
  }

  // Length validations
  if (rules.minLength && value.length < rules.minLength) {
    return `Must be at least ${rules.minLength} characters`
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return `Must be no more than ${rules.maxLength} characters`
  }

  // Pattern validation
  if (rules.pattern && !rules.pattern.test(value)) {
    return "Invalid format"
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value)
    if (customError) return customError
  }

  return ""
}

export const validateForm = (data: Record<string, string>, rules: ValidationRules): ValidationErrors => {
  const errors: ValidationErrors = {}

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field] || ""
    const error = validateField(value, rule)
    if (error) {
      errors[field] = error
    }
  })

  return errors
}

// Specific validation functions
export const validateEmail = (email: string): string => {
  return validateField(email, {
    required: true,
    pattern: VALIDATION_PATTERNS.email,
    custom: (value) => {
      if (!VALIDATION_PATTERNS.email.test(value)) {
        return "Please enter a valid email address"
      }
      return null
    },
  })
}

export const validatePassword = (password: string): string => {
  return validateField(password, {
    required: true,
    minLength: 8,
    custom: (value) => {
      if (!/[A-Z]/.test(value)) return "Must contain at least one uppercase letter"
      if (!/[a-z]/.test(value)) return "Must contain at least one lowercase letter"
      if (!/\d/.test(value)) return "Must contain at least one number"
      if (!/[@$!%*?&]/.test(value)) return "Must contain at least one special character"
      return null
    },
  })
}

export const validatePhone = (phone: string, country: "IN" | "GLOBAL" = "IN"): string => {
  const pattern = country === "IN" ? VALIDATION_PATTERNS.indianPhone : VALIDATION_PATTERNS.phone
  return validateField(phone, {
    required: true,
    pattern,
    custom: (value) => {
      if (country === "IN" && !VALIDATION_PATTERNS.indianPhone.test(value)) {
        return "Please enter a valid Indian phone number (10 digits)"
      }
      if (country === "GLOBAL" && !VALIDATION_PATTERNS.phone.test(value)) {
        return "Please enter a valid phone number"
      }
      return null
    },
  })
}

export const validateName = (name: string): string => {
  return validateField(name, {
    required: true,
    minLength: 2,
    pattern: VALIDATION_PATTERNS.name,
    custom: (value) => {
      if (value.trim() !== value) return "Name cannot start or end with spaces"
      if (/\s{2,}/.test(value)) return "Name cannot contain multiple consecutive spaces"
      return null
    },
  })
}

export const validatePrice = (price: string): string => {
  return validateField(price, {
    required: true,
    pattern: VALIDATION_PATTERNS.price,
    custom: (value) => {
      const num = Number.parseFloat(value)
      if (isNaN(num) || num <= 0) return "Price must be a positive number"
      if (num > 999999) return "Price cannot exceed ₹9,99,999"
      return null
    },
  })
}

export const validateStock = (stock: string): string => {
  return validateField(stock, {
    required: true,
    custom: (value) => {
      const num = Number.parseInt(value)
      if (isNaN(num) || num < 0) return "Stock must be a non-negative number"
      if (num > 99999) return "Stock cannot exceed 99,999"
      return null
    },
  })
}

// Password strength calculation
export interface PasswordStrength {
  score: number
  level: "weak" | "fair" | "good" | "strong"
  feedback: string[]
  color: string
}

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  const feedback: string[] = []

  if (password.length >= 8) {
    score += 25
  } else {
    feedback.push("At least 8 characters")
  }

  if (/[A-Z]/.test(password)) {
    score += 25
  } else {
    feedback.push("One uppercase letter")
  }

  if (/[0-9]/.test(password)) {
    score += 25
  } else {
    feedback.push("One number")
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 25
  } else {
    feedback.push("One special character")
  }

  let level: PasswordStrength["level"] = "weak"
  let color = "bg-red-500"

  if (score >= 100) {
    level = "strong"
    color = "bg-green-500"
  } else if (score >= 75) {
    level = "good"
    color = "bg-blue-500"
  } else if (score >= 50) {
    level = "fair"
    color = "bg-yellow-500"
  }

  return { score, level, feedback, color }
}

// Comprehensive validation rules for admin forms
export const ADMIN_FORM_RULES = {
  // Product form validation rules
  product: {
    name: { required: true, minLength: 2, maxLength: 100 },
    description: { required: true, minLength: 10, maxLength: 1000 },
    price: { required: true, pattern: VALIDATION_PATTERNS.price },
    comparePrice: { pattern: VALIDATION_PATTERNS.price },
    sku: { required: true, pattern: VALIDATION_PATTERNS.sku },
    stock: { required: true },
    category: { required: true },
    brand: { required: true, minLength: 2, maxLength: 50 },
    weight: { pattern: /^\d+(\.\d{1,2})?$/ },
    dimensions: { pattern: /^\d+x\d+x\d+$/ },
  },

  // User form validation rules
  user: {
    firstName: { required: true, pattern: VALIDATION_PATTERNS.name },
    lastName: { required: true, pattern: VALIDATION_PATTERNS.name },
    email: { required: true, pattern: VALIDATION_PATTERNS.email },
    phone: { required: true, pattern: VALIDATION_PATTERNS.indianPhone },
    dateOfBirth: { required: true },
    gender: { required: true },
    role: { required: true },
    address: { required: true, minLength: 10, maxLength: 200 },
    city: { required: true, minLength: 2, maxLength: 50 },
    state: { required: true, minLength: 2, maxLength: 50 },
    pincode: { required: true, pattern: VALIDATION_PATTERNS.pincode },
  },

  // Order form validation rules
  order: {
    customerEmail: { required: true, pattern: VALIDATION_PATTERNS.email },
    shippingAddress: { required: true, minLength: 10, maxLength: 200 },
    trackingNumber: { pattern: /^[A-Z0-9]{10,20}$/ },
    notes: { maxLength: 500 },
  },

  // Admin login validation rules
  adminLogin: {
    email: { required: true, pattern: VALIDATION_PATTERNS.email },
    password: { required: true, minLength: 8 },
  },
}

// Bulk validation function for complex forms
export const validateBulkData = (
  items: Record<string, string>[],
  rules: ValidationRules,
): { isValid: boolean; errors: ValidationErrors[]; summary: string } => {
  const errors: ValidationErrors[] = []
  let totalErrors = 0

  items.forEach((item, index) => {
    const itemErrors = validateForm(item, rules)
    errors[index] = itemErrors
    totalErrors += Object.keys(itemErrors).length
  })

  const isValid = totalErrors === 0
  const summary = isValid
    ? `All ${items.length} items are valid`
    : `${totalErrors} errors found across ${items.length} items`

  return { isValid, errors, summary }
}

// Real-time validation hook
import { useState } from "react"

export const useFormValidation = (initialData: Record<string, string>, rules: ValidationRules) => {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const validateSingleField = (field: string, value: string) => {
    if (rules[field]) {
      const error = validateField(value, rules[field])
      setErrors((prev) => ({ ...prev, [field]: error }))
      return error === ""
    }
    return true
  }

  const handleChange = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      validateSingleField(field, value)
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateSingleField(field, data[field] || "")
  }

  const validateAll = () => {
    const allErrors = validateForm(data, rules)
    setErrors(allErrors)
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return Object.keys(allErrors).length === 0
  }

  const reset = () => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0,
  }
}

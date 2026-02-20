"use client"

import { useState, useCallback } from "react"
import { type ValidationRules, type ValidationErrors, validateForm, validateField } from "@/lib/form-validation"

interface UseFormValidationOptions {
  validateOnChange?: boolean
  validateOnBlur?: boolean
}

export function useFormValidation(
  initialData: Record<string, string>,
  rules: ValidationRules,
  options: UseFormValidationOptions = {},
) {
  const { validateOnChange = false, validateOnBlur = true } = options

  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateSingleField = useCallback(
    (field: string, value: string) => {
      if (rules[field]) {
        const error = validateField(value, rules[field])
        setErrors((prev) => ({ ...prev, [field]: error }))
        return error === ""
      }
      return true
    },
    [rules],
  )

  const handleChange = useCallback(
    (field: string, value: string) => {
      setData((prev) => ({ ...prev, [field]: value }))

      if (validateOnChange && touched[field]) {
        validateSingleField(field, value)
      }
    },
    [validateOnChange, touched, validateSingleField],
  )

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }))

      if (validateOnBlur) {
        validateSingleField(field, data[field] || "")
      }
    },
    [validateOnBlur, data, validateSingleField],
  )

  const validateAll = useCallback(() => {
    const allErrors = validateForm(data, rules)
    setErrors(allErrors)
    setTouched(Object.keys(rules).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
    return Object.keys(allErrors).length === 0
  }, [data, rules])

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialData])

  const handleSubmit = useCallback(
    async (onSubmit: (data: Record<string, string>) => Promise<void>) => {
      setIsSubmitting(true)

      try {
        const isValid = validateAll()
        if (isValid) {
          await onSubmit(data)
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [data, validateAll],
  )

  const setFieldValue = useCallback(
    (field: string, value: string) => {
      handleChange(field, value)
    },
    [handleChange],
  )

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors((prev) => ({ ...prev, [field]: error }))
  }, [])

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }, [])

  const hasErrors = Object.values(errors).some((error) => error !== "")
  const isValid = !hasErrors && Object.keys(touched).length > 0

  return {
    data,
    errors,
    touched,
    isSubmitting,
    isValid,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    validateSingleField,
    reset,
    setFieldValue,
    setFieldError,
    clearFieldError,
  }
}

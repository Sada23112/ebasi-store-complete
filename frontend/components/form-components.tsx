"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { calculatePasswordStrength } from "@/lib/form-validation"

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  touched?: boolean
  required?: boolean
  placeholder?: string
  type?: "text" | "email" | "tel" | "number" | "password"
  className?: string
}

export function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  placeholder,
  type = "text",
  className,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false)
  const hasError = touched && error

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "transition-colors",
            hasError && "border-red-500 focus:border-red-500",
            !hasError && touched && "border-green-500",
          )}
        />
        {type === "password" && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
          </Button>
        )}
      </div>
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {!hasError && touched && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Valid
        </div>
      )}
    </div>
  )
}

interface FormTextareaProps extends Omit<FormFieldProps, "type"> {
  rows?: number
}

export function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  placeholder,
  rows = 4,
  className,
}: FormTextareaProps) {
  const hasError = touched && error

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "transition-colors resize-none",
          hasError && "border-red-500 focus:border-red-500",
          !hasError && touched && "border-green-500",
        )}
      />
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {!hasError && touched && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Valid
        </div>
      )}
    </div>
  )
}

interface FormSelectProps {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  error?: string
  touched?: boolean
  required?: boolean
  placeholder?: string
  options: { value: string; label: string }[]
  className?: string
}

export function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  placeholder,
  options,
  className,
}: FormSelectProps) {
  const hasError = touched && error

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={cn(
            "transition-colors",
            hasError && "border-red-500 focus:border-red-500",
            !hasError && touched && "border-green-500",
          )}
          onBlur={onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
      {!hasError && touched && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Valid
        </div>
      )}
    </div>
  )
}

interface PasswordStrengthMeterProps {
  password: string
  className?: string
}

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = calculatePasswordStrength(password)

  if (!password) return null

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password Strength</span>
        <Badge
          variant={strength.level === "strong" ? "default" : "secondary"}
          className={cn(
            "text-xs",
            strength.level === "strong" && "bg-green-100 text-green-800",
            strength.level === "good" && "bg-blue-100 text-blue-800",
            strength.level === "fair" && "bg-yellow-100 text-yellow-800",
            strength.level === "weak" && "bg-red-100 text-red-800",
          )}
        >
          {strength.level.toUpperCase()}
        </Badge>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={cn("h-2 rounded-full transition-all duration-300", strength.color)}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      {strength.feedback.length > 0 && (
        <div className="text-xs text-gray-600">Missing: {strength.feedback.join(", ")}</div>
      )}
    </div>
  )
}

interface FormErrorSummaryProps {
  errors: Record<string, string>
  className?: string
}

export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, error]) => error)

  if (errorEntries.length === 0) return null

  return (
    <Alert variant="destructive" className={cn("mb-6", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-2">Please fix the following errors:</div>
        <ul className="list-disc list-inside space-y-1">
          {errorEntries.map(([field, error]) => (
            <li key={field} className="text-sm">
              <span className="font-medium capitalize">{field.replace(/([A-Z])/g, " $1")}</span>: {error}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}

interface BulkValidationSummaryProps {
  summary: string
  isValid: boolean
  onDismiss?: () => void
  className?: string
}

export function BulkValidationSummary({ summary, isValid, onDismiss, className }: BulkValidationSummaryProps) {
  return (
    <Alert variant={isValid ? "default" : "destructive"} className={cn("mb-4", className)}>
      {isValid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      <AlertDescription className="flex items-center justify-between">
        <span>{summary}</span>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss} className="h-auto p-1 hover:bg-transparent">
            <X className="h-4 w-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

"use client"

import { useState, useCallback } from "react"

interface UseLoadingOptions {
  initialLoading?: boolean
}

export function useLoading(options: UseLoadingOptions = {}) {
  const [isLoading, setIsLoading] = useState(options.initialLoading ?? false)
  const [error, setError] = useState<Error | null>(null)

  const startLoading = useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
  }, [])

  const setLoadingError = useCallback((error: Error) => {
    setError(error)
    setIsLoading(false)
  }, [])

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      startLoading()
      const result = await asyncFunction()
      stopLoading()
      return result
    } catch (err) {
      setLoadingError(err instanceof Error ? err : new Error("An error occurred"))
      return null
    }
  }, [startLoading, stopLoading, setLoadingError])

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    setError: setLoadingError,
    executeAsync
  }
}

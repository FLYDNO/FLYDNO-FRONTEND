'use client'

import { useEffect, useState } from 'react'

interface SubStatus {
  hasAccess: boolean
  isAdmin: boolean
  status: string
  isTrialing?: boolean
  trialDaysLeft?: number | null
  message: string
  loading: boolean
}

export function useSubscription(email: string | undefined) {
  const [sub, setSub] = useState<SubStatus>({
    hasAccess: false,
    isAdmin: false,
    status: 'loading',
    message: 'Sjekker abonnement...',
    loading: true,
  })

  useEffect(() => {
    if (!email) {
      setSub(prev => ({ ...prev, loading: false }))
      return
    }

    async function checkStatus() {
      try {
        const res = await fetch('/api/stripe/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        setSub({
          hasAccess: data.hasAccess || false,
          isAdmin: data.isAdmin || false,
          status: data.status || 'unknown',
          isTrialing: data.isTrialing,
          trialDaysLeft: data.trialDaysLeft,
          message: data.message || '',
          loading: false,
        })
      } catch {
        // On error, grant access (fail open for better UX during development)
        setSub({
          hasAccess: true,
          isAdmin: false,
          status: 'error',
          message: 'Kunne ikke sjekke status',
          loading: false,
        })
      }
    }

    checkStatus()
  }, [email])

  const startCheckout = async () => {
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else if (data.alreadyActive) {
        setSub(prev => ({ ...prev, hasAccess: true, status: 'active', message: 'Allerede aktivt abonnement' }))
      }
    } catch {
      console.error('Checkout error')
    }
  }

  return { ...sub, startCheckout }
}

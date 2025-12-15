class RateLimiter {
  private store: Record<string, { count: number; resetTime: number }> = {}

  constructor(
    private maxRequests = 100,
    private windowMs = 60000
  ) {}

  check(key: string) {
    const now = Date.now()
    const entry = this.store[key]

    if (!entry || now > entry.resetTime) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      }
      return { allowed: true, remaining: this.maxRequests - 1 }
    }

    if (entry.count >= this.maxRequests) {
      return { allowed: false, remaining: 0 }
    }

    entry.count++
    return { allowed: true, remaining: this.maxRequests - entry.count }
  }
}

export const rateLimiter = new RateLimiter()

/**
 * In-memory token bucket rate limiter.
 * No external dependencies — one bucket per key, refilled per window.
 */

interface Bucket {
  tokens: number
  windowStart: number
}

export class RateLimiter {
  private readonly buckets = new Map<string, Bucket>()
  private readonly windowMs: number
  private readonly max: number
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor({ windowMs, max }: { windowMs: number; max: number }) {
    this.windowMs = windowMs
    this.max = max

    // Sweep stale buckets every 5 minutes
    this.cleanupTimer = setInterval(() => this.cleanup(), 5 * 60 * 1000).unref()
  }

  /**
   * Returns true if the request is allowed, false if rate-limited.
   */
  check(key: string): boolean {
    const now = Date.now()
    let bucket = this.buckets.get(key)

    if (!bucket || now - bucket.windowStart >= this.windowMs) {
      this.buckets.set(key, { tokens: this.max - 1, windowStart: now })
      return true
    }

    if (bucket.tokens > 0) {
      bucket.tokens--
      return true
    }

    return false
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, bucket] of this.buckets) {
      if (now - bucket.windowStart >= this.windowMs * 2) {
        this.buckets.delete(key)
      }
    }
  }

  destroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }
}

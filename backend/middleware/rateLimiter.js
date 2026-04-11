/**
 * In-memory rate limiter for call endpoints.
 * Prevents spam calling by enforcing a cooldown per user.
 * 
 * In production, use Redis for multi-instance support.
 */

const callCooldowns = new Map(); // userId -> lastCallTimestamp

const COOLDOWN_MS = 2 * 60 * 1000; // 2 minutes cooldown between calls

/**
 * Middleware: enforces a per-user cooldown on the call-donor endpoint.
 */
const callRateLimiter = (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const now = Date.now();
  const lastCall = callCooldowns.get(userId);

  if (lastCall && (now - lastCall) < COOLDOWN_MS) {
    const remainingSec = Math.ceil((COOLDOWN_MS - (now - lastCall)) / 1000);
    return res.status(429).json({ 
      message: `Please wait ${remainingSec} seconds before making another call.`,
      retryAfterSeconds: remainingSec
    });
  }

  // Record this call attempt
  callCooldowns.set(userId, now);

  // Periodically clean up old entries (every 100 calls)
  if (callCooldowns.size > 100) {
    for (const [uid, ts] of callCooldowns.entries()) {
      if (now - ts > COOLDOWN_MS * 5) {
        callCooldowns.delete(uid);
      }
    }
  }

  next();
};

module.exports = { callRateLimiter };

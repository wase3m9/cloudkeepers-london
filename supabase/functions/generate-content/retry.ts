export async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 5, initialDelay = 5000) {
  let lastError: any;
  let delay = initialDelay;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Enhanced error logging with detailed information
      console.error(`API Error (Attempt ${i + 1}/${maxRetries}):`, {
        status: error.status,
        message: error.message,
        type: error.type,
        remaining: error.response?.headers?.get('x-ratelimit-remaining-requests'),
        reset: error.response?.headers?.get('x-ratelimit-reset-requests')
      });

      // Handle rate limit errors (429)
      if (error.status === 429) {
        // Calculate delay with exponential backoff and random jitter
        const jitter = Math.random() * 1000; // Add random jitter up to 1 second
        const waitTime = delay + jitter;
        
        console.log(`Rate limit exceeded. Attempt ${i + 1}/${maxRetries}. Retrying in ${Math.round(waitTime/1000)}s...`);
        
        // Wait for the calculated delay
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Double the delay for next attempt (exponential backoff)
        delay *= 2;
        continue;
      }
      
      // If it's not a rate limit error, throw immediately
      if (error.status !== 429) {
        console.error('Non-rate-limit error encountered:', error);
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error with detailed information
  console.error('Max retries exceeded. Last error:', {
    status: lastError.status,
    message: lastError.message,
    type: lastError.type,
    remaining: lastError.response?.headers?.get('x-ratelimit-remaining-requests'),
    reset: lastError.response?.headers?.get('x-ratelimit-reset-requests')
  });
  
  throw lastError;
}

// Helper function to monitor remaining quota
export function logRemainingQuota(headers: Headers) {
  const remaining = headers.get('x-ratelimit-remaining-requests');
  const reset = headers.get('x-ratelimit-reset-requests');
  
  if (remaining && reset) {
    console.log(`Remaining API quota: ${remaining} requests. Resets in: ${reset}s`);
  }
}
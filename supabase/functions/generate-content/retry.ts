export async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 5, initialDelay = 2000) {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Log detailed error information
      console.error(`API Error (Attempt ${i + 1}/${maxRetries}):`, {
        status: error.status,
        message: error.message,
        type: error.type
      });

      // Handle different types of errors
      if (error.status === 429) {
        const delay = initialDelay * Math.pow(2, i);
        const jitter = Math.random() * 1000; // Add random jitter
        const waitTime = delay + jitter;
        
        console.log(`Rate limit exceeded. Attempt ${i + 1}/${maxRetries}. Retrying in ${Math.round(waitTime/1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If it's not a rate limit error, throw immediately
      if (error.status !== 429) {
        console.error('Non-rate-limit error encountered:', error);
        throw error;
      }
    }
  }
  
  // If we've exhausted all retries, throw the last error
  console.error('Max retries exceeded. Last error:', lastError);
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
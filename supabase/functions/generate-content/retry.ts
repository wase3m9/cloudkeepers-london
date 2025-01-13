// Helper function to log request metrics
async function logRequest(endpoint: string, startTime: number, success: boolean, errorCode?: string) {
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  await supabase.from('request_logs').insert({
    endpoint,
    success,
    error_code: errorCode,
    response_time: responseTime
  });
}

// Throttling queue implementation
const requestQueue: Array<() => Promise<any>> = [];
let isProcessingQueue = false;

async function processQueue() {
  if (isProcessingQueue || requestQueue.length === 0) return;
  
  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const request = requestQueue.shift();
    if (request) {
      await request();
      // Add 120ms delay between requests to stay under rate limits
      await new Promise(resolve => setTimeout(resolve, 120));
    }
  }
  
  isProcessingQueue = false;
}

export async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 5, initialDelay = 5000) {
  const startTime = Date.now();
  let lastError: any;
  let delay = initialDelay;

  // Add request to queue
  return new Promise((resolve, reject) => {
    const queuedRequest = async () => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const result = await fn();
          await logRequest('openai', startTime, true);
          resolve(result);
          return;
        } catch (error) {
          lastError = error;
          
          console.error(`API Error (Attempt ${i + 1}/${maxRetries}):`, {
            status: error.status,
            message: error.message,
            type: error.type,
            remaining: error.response?.headers?.get('x-ratelimit-remaining-requests'),
            reset: error.response?.headers?.get('x-ratelimit-reset-requests')
          });

          // Handle rate limit errors (429)
          if (error.status === 429) {
            const jitter = Math.random() * 1000;
            const waitTime = delay + jitter;
            
            console.log(`Rate limit exceeded. Attempt ${i + 1}/${maxRetries}. Retrying in ${Math.round(waitTime/1000)}s...`);
            
            await new Promise(resolve => setTimeout(resolve, waitTime));
            delay *= 2; // Exponential backoff
            continue;
          }
          
          await logRequest('openai', startTime, false, error.message);
          
          // If it's not a rate limit error, throw immediately
          if (error.status !== 429) {
            console.error('Non-rate-limit error encountered:', error);
            reject(error);
            return;
          }
        }
      }
      
      // If we've exhausted all retries
      await logRequest('openai', startTime, false, 'Max retries exceeded');
      reject(lastError);
    };

    requestQueue.push(queuedRequest);
    processQueue();
  });
}

// Helper function to monitor remaining quota
export function logRemainingQuota(headers: Headers) {
  const remaining = headers.get('x-ratelimit-remaining-requests');
  const reset = headers.get('x-ratelimit-reset-requests');
  
  if (remaining && reset) {
    console.log(`Remaining API quota: ${remaining} requests. Resets in: ${reset}s`);
  }
}
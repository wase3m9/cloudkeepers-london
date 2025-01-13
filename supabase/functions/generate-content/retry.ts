export async function retryWithBackoff(fn: () => Promise<any>, maxRetries = 5, initialDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        const jitter = Math.random() * 1000;
        const waitTime = delay + jitter;
        console.log(`Rate limited. Attempt ${i + 1}/${maxRetries}. Retrying in ${Math.round(waitTime/1000)}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      throw error;
    }
  }
}
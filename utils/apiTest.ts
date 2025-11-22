// Simple API test function to verify connectivity
export async function testApiConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('Testing API connection to dummyjson.com...');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch('https://dummyjson.com/test', {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      console.log('API connection successful:', data);
      return {
        success: true,
        message: 'API is reachable',
      };
    } else {
      return {
        success: false,
        message: `API returned status: ${response.status}`,
      };
    }
  } catch (error) {
    console.error('API test failed:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Connection timeout. Check your internet connection.',
        };
      }
      return {
        success: false,
        message: error.message || 'Network request failed',
      };
    }
    
    return {
      success: false,
      message: 'Unknown error occurred',
    };
  }
}


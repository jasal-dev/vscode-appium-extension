/**
 * WebDriver Client - HTTP wrapper for Appium WebDriver protocol
 */

interface WdResponse {
  value: any;
  sessionId?: string;
}

export class WebDriverError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'WebDriverError';
  }
}

/**
 * Make a WebDriver HTTP request
 * @param method HTTP method
 * @param url Full URL
 * @param body Optional request body
 * @param timeoutMs Timeout in milliseconds (default 30000)
 */
export async function wdRequest(
  method: string,
  url: string,
  body?: any,
  timeoutMs: number = 30000
): Promise<WdResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    let responseData: any;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      const text = await response.text();
      responseData = text ? { value: text } : { value: null };
    }

    if (!response.ok) {
      const errorMessage = responseData?.value?.message || 
                          responseData?.value?.error || 
                          `HTTP ${response.status}: ${response.statusText}`;
      throw new WebDriverError(errorMessage, response.status);
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof WebDriverError) {
      throw error;
    }
    
    if ((error as any).name === 'AbortError') {
      throw new WebDriverError('Request timeout');
    }
    
    if (error instanceof Error) {
      throw new WebDriverError(`Network error: ${error.message}`);
    }
    
    throw new WebDriverError('Unknown error occurred');
  }
}

/**
 * Extract element ID from WebDriver response (supports W3C and JSONWP formats)
 */
export function extractElementId(elementResponse: any): string {
  const W3C_ELEMENT_KEY = 'element-6066-11e4-a52e-4f735466cecf';
  const JSONWP_ELEMENT_KEY = 'ELEMENT';

  if (elementResponse[W3C_ELEMENT_KEY]) {
    return elementResponse[W3C_ELEMENT_KEY];
  }
  if (elementResponse[JSONWP_ELEMENT_KEY]) {
    return elementResponse[JSONWP_ELEMENT_KEY];
  }
  
  throw new WebDriverError('Element ID not found in response');
}

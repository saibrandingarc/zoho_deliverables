export function setZohoTokenWithExpiration(token: string, expiresInSeconds: number) {
    const expirationTime = new Date().getTime() + expiresInSeconds * 1000; // Calculate expiration time in milliseconds
    const item = {
        token,
        expirationTime,
    };
    localStorage.setItem('zohoToken', JSON.stringify(item));
}
  
export function getZohoToken(): string | null {
    const itemStr = localStorage.getItem('zohoToken');
    
    if (!itemStr) {
        return null; // No token found
    }
    
    try {
        const item = JSON.parse(itemStr);
        const currentTime = new Date().getTime();
        
        if (currentTime > item.expirationTime) {
            localStorage.removeItem('zohoToken'); // Remove expired token
            return null; // Token has expired
        }
      
        return item.token; // Token is valid
    } catch (error) {
        console.error('Error parsing token from localStorage:', error);
        return null;
    }
}
  
export function clearExpiredZohoToken() {
    const itemStr = localStorage.getItem('zohoToken');
    
    if (itemStr) {
        try {
            const item = JSON.parse(itemStr);
            const currentTime = new Date().getTime();
            
            if (currentTime > item.expirationTime) {
                localStorage.removeItem('zohoToken'); // Remove expired token
            }
        } catch (error) {
            console.error('Error parsing token from localStorage:', error);
        }
    }
}
  
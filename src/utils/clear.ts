export const clearLargeCookies = () => {
    // Clear all cookies for the domain
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    // Clear localStorage items that might be large
    Object.keys(localStorage).forEach(key => {
        if (localStorage.getItem(key).length > 1000) {
            console.warn(`Removing large localStorage item: ${key}`);
            localStorage.removeItem(key);
        }
    });
};
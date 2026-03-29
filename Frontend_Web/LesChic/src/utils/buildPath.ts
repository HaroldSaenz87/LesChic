export const buildPath = (route: string): string => {
    // const app_name = 'leschic-app';
    
    // Commented out for now as we are only working locally
    /*
    if (import.meta.env.PROD) {
        return `https://${app_name}.herokuapp.com/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
    */

    // Direct local return for current development
    return `http://localhost:5000/${route}`;
};
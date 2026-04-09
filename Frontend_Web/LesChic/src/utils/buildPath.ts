export const buildPath = (route: string): string => {
    // const app_name = 'leschic-app';
    
    // Commented out for now as we are only working locally
    
    if (import.meta.env.PROD) {
        return `http://www.ec-albo.xyz:5000/${route}`;
    } else {
        // the fall back
        return `http://localhost:5000/${route}`;
    }

};
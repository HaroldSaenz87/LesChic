export const buildPath = (route: string): string => {
    const app_name = 'leschic-app';
    
    if (import.meta.env.PROD) {
        return `https://${app_name}.herokuapp.com/${route}`;
    } else {
        return `http://localhost:5000/${route}`;
    }
    
};
import { jwtDecode } from "jwt-decode";
import { ACCESS_COOKIE_NAME } from "../constants";

export interface JwtPayload {
    user: {
        roles: string[];
        userId: string;
        username: string;
    };
}

const setCookie = (name: string, value: string, days: number = 365) => {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

const getCookie = (name: string) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

const eraseCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999; path=/; Secure; SameSite=None`;
};

const getProfile = () => {
    const accessToken = getCookie(ACCESS_COOKIE_NAME);
    if (!accessToken) return [];
    try {
        return jwtDecode(accessToken);
    } catch (error) {
        console.error("Invalid access token", error);
        return [];
    }
};
export { setCookie, getCookie, eraseCookie,getProfile };


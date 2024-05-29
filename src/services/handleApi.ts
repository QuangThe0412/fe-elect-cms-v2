import React from 'react';
import { Toast } from 'primereact/toast';
import { eraseCookie, getCookie, setCookie } from '@/utils/cookie';
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/constants';
import { AuthService } from '@/services/auth.service';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { paths } from '@/constants/api';

export const HandleApi = async (request: Promise<any>, toast: React.RefObject<Toast> | null) => {
    try {
        return HandleResponse(await request, toast);
    } catch (error: any) {
        console.error(error);
        return HandleResponse(error?.response, toast);
    }
}

export const tryGetAccessToken = async () => {
    const accessToken = getCookie(ACCESS_COOKIE_NAME);
    if (!accessToken) {
        window.location.href = paths.login;
        return;
    }

    let _accessToken = accessToken;
    const decodedToken: JwtPayload = jwtDecode(accessToken);
    const { exp } = decodedToken;
    if (exp && exp * 1000 > Date.now()) return _accessToken;

    try {
        const refreshToken = getCookie(REFRESH_COOKIE_NAME);
        if (refreshToken) {
            let result = await AuthService.refreshToken(refreshToken);
            let newAccessToken = result?.data?.data;
            setCookie(ACCESS_COOKIE_NAME, newAccessToken);
            return newAccessToken;
        }
    } catch (error) {
        console.error(error);
        eraseCookie(ACCESS_COOKIE_NAME);
        eraseCookie(REFRESH_COOKIE_NAME);

        window.location.href = paths.login;
        return null;
    }
};

const HandleResponse = (response: Response | any, toast: React.RefObject<Toast> | null) => {
    let data = response?.data?.data;
    let status = response?.status;
    let code = response?.data?.code;
    let mess = response?.data?.mess || "Có lỗi xảy ra";
    let summaryTitle = 'Thất bại';
    let severityType: "success" | "info" | "warn" | "error";
    switch (status) {
        case 200: // success
        case 201: // created
            severityType = 'success';
            summaryTitle = 'Thành công';
            break;
        case 204: // no content
            severityType = 'info';
            break;
        case 400: // bad request
            severityType = 'error';
            break;
        case 401: // unauthorized
            mess = "Chưa xác thực hoặc phiên làm việc hết hạn";
            severityType = 'error';
            break;
        case 403: // forbidden
        case 404: // not found
            severityType = 'error';
            break;
        case 500: // internal server error
            severityType = 'error';
            break;
        default:
            severityType = 'error';
            mess = "ERR_NETWORK";
            break;
    };
    toast?.current?.show({ severity: severityType, summary: summaryTitle, detail: mess, life: 3000 });
    return {
        data: data,
        status: status,
        code: code,
        mess: mess
    };
}
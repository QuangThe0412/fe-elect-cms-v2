import { linkImageGGEndpoint } from '@/config';
import erroImage from '../assets/images/error.jpg';
import { RouteArray } from '../routes/routes'
import { STATUS_ENUM } from '@/constants';

export function formatCurrency(value: number | string | undefined) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
    } else {
        return value;
    }
}

export function formatNumber(value: number | string | undefined) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).replace('₫', '').replace(/,/g, '');
    } else {
        return value;
    }
}

export function validateEmail(input: string) {
    if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(input.trim())) {
        return false;
    }
    return true;
}

export function validatePhone(input: string) {
    if (!/^\d{10,11}$/.test(input.trim())) {
        return false;
    }
    return true;
}

export function validatePassword(input: string) {
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(input.trim())) {
        return false;
    }
    return true;
}

export const handleImageError = (event: any) => {
    event.target.src = erroImage;
};

export const convertFormData = async (data: any, file?: any) => {
    const formData = new FormData();
    const date = new Date();

    for (const key of Object.keys(data)) {
        let value = data[key];
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);

        if (value instanceof Date) {
            formData.append(capitalizedKey, date.toISOString());
        } else {
            formData.append(capitalizedKey, String(value) || '');
        }
    }

    if (file) {
        formData.append('file', file.files[0]);
    }

    return formData;
};

export const trimString = (value: any): any => {
    if (typeof value === 'string') {
        return value.trim().replace(/ +/g, ' ');
    }
    return value;
}

export function checkRoleAccess(userRole: string[], paths: string) {
    let routeMap = RouteArray.find(route => route.path === paths);
    if (!routeMap) {
        return false;
    }

    let checkAccess = routeMap.roles.some(role => userRole.includes(role));
    return checkAccess;
}

export const bodyDate = (rowData: any, options: { field: keyof any }) => {
    const field = options.field;
    const dateValue = rowData[field];
    if (dateValue) {
        const date = new Date(dateValue as string);
        return date instanceof Date ? date.toLocaleDateString('vi-VN') : '';
    }
    return '';
}

export const priceOptions = [
    { label: 'Giá Lẻ', value: 'DonGiaBanLe' },
    { label: 'Giá Sỉ', value: 'DonGiaBanSi' }
  ];

export const IsPendingStatus = (status: number) => {
    return status === STATUS_ENUM.PENDING;
};

export const removeVietnameseTones = (str: string): string => {
    if(str === null || str === undefined) return '';
    const accentsMap: { [key: string]: string } = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
        'ă': 'a', 'ắ': 'a', 'ặ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
        'đ': 'd',
        'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
        'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
        'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
        'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
        'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
        'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
        'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
        'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
        'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
        // Capital letters
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
        'Ă': 'A', 'Ắ': 'A', 'Ặ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
        'Đ': 'D',
        'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
        'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
        'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
        'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
        'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
        'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
        'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
        'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
        'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
    };
    return str.split('').map(char => accentsMap[char] || char).join('');
};

export const linkImageGG = linkImageGGEndpoint;

export const generateLinkGoogleImage = (id: string) => {
    if (!id) return '';
    return `${(linkImageGGEndpoint ?? '') + id}` + '&sz=w1000';
  }
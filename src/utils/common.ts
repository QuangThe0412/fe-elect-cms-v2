import erroImage from '../assets/images/error.jpg';

export function formatCurrency(value: number | string) {
    if (value) {
        return value.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).replace('₫', '');
    } else {
        return value;
    }
}

export function validateEmail(input: HTMLInputElement) {
    if (input.type === 'email' || input.name === 'email') {
        if (!/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/.test(input.value.trim())) {
            return false;
        }
    } else {
        if (input.value.trim() === '') {
            return false;
        }
    }
    return true;
}

export const handleImageError = (event: any) => {
    event.target.src = erroImage;
};

export const linkImageGG = () => 'https://drive.google.com/uc?export=view&id=';
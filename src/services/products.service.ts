import axios from 'axios';

export const getProducts = () => {
    // Gửi yêu cầu lấy danh sách sản phẩm từ máy chủ
    return axios.get('/api/products');
}

export const getProduct = (id: string) => {
    // Gửi yêu cầu lấy thông tin chi tiết của một sản phẩm từ máy chủ
    return axios.get(`/api/products/${id}`);
}

export const createProduct = (product: any) => {
    // Gửi yêu cầu tạo một sản phẩm mới đến máy chủ
    return axios.post('/api/products', product);
}

export const updateProduct = (id: string, updatedProduct: any) => {
    // Gửi yêu cầu cập nhật thông tin của một sản phẩm đến máy chủ
    return axios.put(`/api/products/${id}`, updatedProduct);
}

export const deleteProduct = (id: string) => {
    // Gửi yêu cầu xóa một sản phẩm đến máy chủ
    return axios.delete(`/api/products/${id}`);
}
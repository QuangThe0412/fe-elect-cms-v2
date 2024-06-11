import axios from 'axios';
import { paths } from '@/constants/api';
import { Import } from '@/models';

export const ImportService = {
    getImports() {
        return axios.get(paths.import);
    },

    getImport(id: number) {
        return axios.get(paths.import + `/${id}`);
    },

    createImport(phieuNhap: Import) {
        return axios.post(paths.import, phieuNhap);
    },

    updateImport(id: number, updatedPhieuNhap: Import) {
        return axios.put(paths.import + `/${id}`, updatedPhieuNhap);
    },

    deleteImport(id: number) {
        return axios.delete(paths.import + `/${id}`);
    }
}
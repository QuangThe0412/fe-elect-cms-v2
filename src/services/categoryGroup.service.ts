import axios from 'axios';
import { CategoryGroup } from '@/models';
import { paths } from '@/constants/api';

export class CategoryGroupService {
    static getCategoryGroups() {
        return axios.get(paths.categoryGroup);
    }

    static getCategoryGroup(id: string) {
        return axios.get(paths.categoryGroup + `/${id}`);
    }

    static createCategoryGroup(category: CategoryGroup) {
        return axios.post( paths.categoryGroup, category);
    }

    static updateCategoryGroup(id: string, updatedCategoryGroup: CategoryGroup) {
        return axios.put( paths.categoryGroup + `/${id}`, updatedCategoryGroup);
    }
}
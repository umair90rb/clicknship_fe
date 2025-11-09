import { useListUnitQuery } from "@/api/unit";
import {
  useListBrandQuery,
  useListCategoryQuery,
} from "@/api/categoryAndBrands";

export default function useCategoryBrandUnitList() {
  const { data: unitList } = useListUnitQuery({});
  const { data: categoryList } = useListCategoryQuery({});
  const { data: brandList } = useListBrandQuery({});

  return {
    unitList: unitList || [],
    categoryList: categoryList || [],
    brandList: brandList || [],
  };
}

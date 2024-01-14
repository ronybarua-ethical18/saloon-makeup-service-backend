import {
  IFilterOptions,
  IShopFilterOptions,
} from '../shared/interfaces/common.interface'

export const queryFieldsManipulation = (
  searchTerm: string | undefined,
  filterableFields: IFilterOptions | IShopFilterOptions,
  searchableFields: Array<string>,
) => {
  const andConditions = []
  if (searchTerm) {
    andConditions.push({
      $or: searchableFields.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    })
  }

  if (Object.keys(filterableFields).length) {
    andConditions.push({
      $and: Object.entries(filterableFields).map(([key, value]) => ({
        [key]: value,
      })),
    })
  }

  return andConditions
}

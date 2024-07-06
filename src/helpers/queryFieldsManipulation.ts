import {
  IFilterOptions,
  IShopFilterOptions,
} from '../shared/interfaces/common.interface'

export const queryFieldsManipulation = (
  searchTerm: string | undefined,
  searchableFields: Array<string>,
  filterableFields: IFilterOptions | IShopFilterOptions,
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

  console.log('and conditions', filterableFields)

  return andConditions
}

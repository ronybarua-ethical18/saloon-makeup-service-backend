import { IFilterOptions } from '../shared/interfaces/common.interface'

export const queryFieldsManipulation = (
  searchTerm: string | undefined,
  filterableFields: IFilterOptions,
) => {
  const andConditions = []
  const serviceSearchableFields = ['name', 'category', 'subCategory']

  if (searchTerm) {
    andConditions.push({
      $or: serviceSearchableFields.map(field => ({
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

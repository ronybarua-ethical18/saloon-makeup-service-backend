'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.queryFieldsManipulation = void 0
const queryFieldsManipulation = (
  searchTerm,
  searchableFields,
  filterableFields,
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
exports.queryFieldsManipulation = queryFieldsManipulation

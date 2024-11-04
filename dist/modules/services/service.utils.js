"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotals = void 0;
const getTotals = async (model, queryPayload, statusList) => {
    console.log('queryPayload', queryPayload);
    const stats = await model.aggregate([
        { $match: queryPayload },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);
    // Initialize result object with all statuses set to 0
    const result = {
        total: 0,
        ...statusList.reduce((acc, status) => ({ ...acc, [status]: 0 }), {}),
    };
    // Map stats to the result object
    stats.forEach(({ _id, count }) => {
        // Use Object.prototype.hasOwnProperty.call to avoid linting issues
        if (Object.prototype.hasOwnProperty.call(result, _id)) {
            result[_id] = count;
            result.total += count;
        }
    });
    return result;
};
exports.getTotals = getTotals;

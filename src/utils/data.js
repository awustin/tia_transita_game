/**
 * Filters items with a condition
 * @param {Array} items Original array
 * @param {Function} condition Callback
 * @returns Array of selected items
 */
export const select = (items = [], condition = Function.prototype) => items.filter(item => condition(item));

/**
 * Selects the first item with the given ID
 * @param {Number} id ID to search
 * @param {Array} items Lookup array
 * @returns Single item
 */
export const selectById = (id = null, items = []) => !id ? {} : items.filter(item => Number(item.id) == Number(id))[0];

/**
 * Selects the items with the given IDs
 * @param {Array} ids IDs to search
 * @param {Array} items Lookup array
 * @returns Array of items
 */
export const selectByIds = (ids = [], items = []) => {
    if (!ids.length) {
        return [];
    }

    return items.filter(item => ids.includes(Number(item.id)));
}

/**
 * Performs a JOIN operation between `left` and `right` arrays, comparing `leftOn` and `rightOn` keys
 * @param {Object} Operation params 
 * @returns Array with the result
 */
export const join = (left, right) => {
    return ({
        on: (leftOn, rightOn) => ({
            as: nameAs => {
                const lookUp = {};
            
                right.forEach(item => lookUp[Number(item[rightOn])] = item);
            
                return left.map(item => {
                    return {
                        ...item,
                        ...Boolean(item[leftOn]) && { [nameAs]: lookUp[item[leftOn]] }
                    }
                })
                .filter(result => Boolean(result[nameAs]));
            }
        })
    })
}

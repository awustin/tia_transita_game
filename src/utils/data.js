/**
 * Filters items with a condition
 * @param {Array} items Original array
 * @param {Function} condition Callback
 * @returns Array of selected items
 */
export const select = (items = [], condition = Function.prototype) => items.filter(item => condition(item));

/**
 * Selects the first item with the given ID
 * @param {Array} items Lookup array
 * @param {Number} id ID to search
 * @returns Single object
 */
export const selectById = (items = [], id = null) => !id ? {} : items.filter(item => Number(item.id) == Number(id))[0];

/**
 * Selects the items with the given IDs
 * @param {Array} items Lookup array
 * @param {Array} ids IDs to search
 * @returns Array of items
 */
export const selectByIds = (items = [], ids = []) => {
    if (!ids.length) {
        return [];
    }

    return items.filter(item => ids.includes(Number(item.id)));
}

/**
 * Selects the first item that has an attribute with the specified value
 * @param {Array} items Lookup array
 * @param {String} attr Name of attribute
 * @param {Any} value Value of attribute, defaults to `true`
 * @returns Single object
 */
export const selectByValue = (items = [], attr = null, value = true) => {
    if (!attr) {
        return {};
    }

    return items.filter(item => item[attr] ? item[attr] === value : false)[0] || {};
};


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

/**
 * Groups an array of objects by the attribute provided
 * @param {Array} items Original array
 * @param {Any} by Attribute
 * @returns Object with the groups as keys and arrays of objects as values
 */
export const groupBy = (items = [], by = null) => {
    if (!by) {
        return {};
    }

    const key = String(by);

    return items.reduce((acc, current) => {
        if (current[key] == null) {
            if (!acc.unmatched) {
                acc.unmatched = [current];
            } else {
                acc.unmatched = [...acc.unmatched, current];
            }            
        } else {
            const value = String(current[key]);
    
            if (!acc[value]) {
                acc[value] = [current];
            } else {
                acc[value] = [...acc[value], current];
            }
        }

        return acc;
    }, {});
}

/**
 * Gets the element with the maximum value for the key specified
 * @param {Array} items Lookup array
 * @param {Any} key Key to sort by. Must have numeric values
 * @return The object whose value is the maximum 
 */
export const selectByMaxValue = (items = [], key = null) => {
    if (!key) {
        return {}
    }

    return items.reduce((acc, current) => {
        if (acc.max == null || Number(current[key]) >= Number(acc.max)) {
            acc.max = current[key];
            acc.result = current;
        }

        return acc;
    }, {
        max: null,
        result: {},
    }).result;
}

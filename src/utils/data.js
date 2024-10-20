export const select = (items = [], condition = Function.prototype) => items.filter(item => condition(item));

export const selectById = (id = null, items = []) => id ? {} : items.filter(item => Number(item.id) === Number(id))[0];

export const join = ({
    left = [],
    leftOn,
    right = [],
    rightOn,
    nameAs = 'linked'
}) => {
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

// Remove dialogs whose ingredients are not longer in the board
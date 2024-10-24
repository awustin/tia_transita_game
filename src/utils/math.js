/**
 * Linear combination
 * @param {Array} X Array of numbers 
 * @param {*} W Array of coefficients
 * @returns Number
 */
export const linear = (X = [], W = []) => {
    if (!X.length || (X.length !== W.length)) {
        return false;
    }

    return X.reduce((acc, xi, i) => {
        const wi = W[i] || 1;

        acc += xi * wi;

        return acc;
    }, 0);
};

// Todo - Need calibration: properties for probability computing

const spell = {
    compute: {
        // On the limit points -> infinite, the sum of the four probabilities functions should not be over 1
        blockCellsProbability: points => 3/10 - 3 / (points * 1/50 + 10),
        maxMovesProbability: points => 3/10 - 3 / (points * 1/50 + 10),
        changeBoardProbability: points => 1/5 - 1 / (points * 1/50 + 5),
        resetBoardProbability: points => 1/5 - 1 / (points * 1/50 + 5),
    }
};

const score = {
    compute: {
        // The more ingredients in one move, the more influence in the results
        weightedMove: (amount, points) => amount * amount * points,
    }
};

const tree = {
    constants: {
        MOVES_CHECK: 20,
        DECIDE_MAGIC_POINTS_COEFF: 1.1,
        DECIDE_NATURAL_POINTS_COEFF: 1
    },
};

module.exports = {
    spell,
    score,
    tree,
};

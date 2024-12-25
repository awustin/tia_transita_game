// Todo - Need calibration: properties for probability computing
const game = {
    constants: {
        POINTS_TO_GAME_OVER: 10000,
    }
};

const spell = {
    compute: {
        // On the limit points -> infinite, the sum of the four probabilities functions should not be over 1
        blockCellsProbability: points => 3/10 - 3 / (points * 50 + 10),
        minMovesProbability: points => 3/10 - 3 / (points * 1/50 + 10),
        changeBoardProbability: points => 1/5 - 1 / (points * 1/50 + 5),
        resetBoardProbability: points => 1/5 - 1 / (points * 1/50 + 5),
    },
    constants: {
        MIN_MOVES: 5,
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
        MOVES_CHECK: 15,
        MOVES_LEVEL_UP_FAILED: 5,
        MOVES_SWAP_EXTRA: 8,
    },
    compute: {
        levelUpProbability: (labourPoints = 0, astrologyPoints = 0, necromancyPoints = 0) => {
            if ((astrologyPoints + necromancyPoints + labourPoints) <= 0) {
                return 0;
            }
            const magic = 1.1 * (astrologyPoints + necromancyPoints);
            const natural = labourPoints;

            return magic / (magic + natural);
        },
        branchProbabilities: (naturalAmount = 0, amuletAmount = 0, witchcraftAmount = 0) => {
            const magicFn = (type = 'witchcraft') => {
                const x = type === 'amulet' ? amuletAmount : witchcraftAmount;
                const y = type === 'amulet' ? witchcraftAmount : amuletAmount;

                let coeff = 0;

                // Compares to natural
                if (x <= 0.75 * naturalAmount) {
                    coeff = 0.1;
                } else if (x <= 1.25 * naturalAmount) {
                    coeff = 1;
                } else {
                    coeff = 10;
                }

                // Compares to the other magical variable
                if (x <= 0.75 * y) {
                    coeff * 0.75;
                } else if (x <= 1.25 * y) {
                    coeff * 1;
                } else {
                    coeff * 1.25;
                }

                return coeff * x;
            };

            // Transformation 1: apply functions to amounts
            const naturalTransform = naturalAmount;
            const amuletTransform = magicFn('amulet');
            const witchcraftTransform = magicFn('witchcraft');
            const total = naturalTransform + amuletTransform + witchcraftTransform;

            if (total > 0) {
                // Transformation 2: weigth over total
                const naturalProbability = naturalTransform / total;
                const amuletProbability = amuletTransform / total;
                const witchcraftProbability = witchcraftTransform / total;

                return ({
                    natural: naturalProbability,
                    amulet: amuletProbability,
                    witchcraft: witchcraftProbability,
                });
            }

            return ({ natural: 1/3, amulet: 1/3, witchcraft: 1/3 });
        }
    }
};

module.exports = {
    game,
    spell,
    score,
    tree,
};

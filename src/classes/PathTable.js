const keyToString = arr => arr.join('-');
const keyToArray = str => str.split('-');
const top = (pos = []) => (pos[0] - 1) < 0 ? false : [pos[0] - 1, pos[1]];
const bottom = (pos = []) => (pos[0] + 1) > 8 ? false : [pos[0] + 1, pos[1]];
const right = (pos = []) => (pos[1] + 1) > 8 ? false : [pos[0], pos[1] + 1];
const left = (pos = []) => (pos[1] - 1) < 0 ? false : [pos[0], pos[1] - 1];
const topKey = (pos = []) => {
    const topArr = top(pos);

    if (topArr) {
        return keyToString(topArr);
    }

    return false;
};
const bottomKey = (pos = []) => {
    const bottomArr = bottom(pos);

    if (bottomArr) {
        return keyToString(bottomArr);
    }

    return false;
};
const rightKey = (pos = []) => {
    const rightArr = right(pos);

    if (rightArr) {
        return keyToString(rightArr);
    }

    return false;
};
const leftKey = (pos = []) => {
    const leftArr = left(pos);

    if (leftArr) {
        return keyToString(leftArr);
    }

    return false;
};

export default class PathTable
{
    table = {};
    ingredientsGrid = null;

    constructor(ingredientsGrid) {
        this.ingredientsGrid = ingredientsGrid;
    }

    add(id, position = []) {
        if (position.length !== 2) {
            return false;
        }

        const key = keyToString(position);

        this.table[key] = {
            position: key,
            top: null,
            right: null,
            bottom: null,
            left: null, 
        };

        this.#addAdjacentEntry(position, id, 'top');
        this.#addAdjacentEntry(position, id, 'right');
        this.#addAdjacentEntry(position, id, 'bottom');
        this.#addAdjacentEntry(position, id, 'left');
    }

    remove(position = []) {
        if (position.length !== 2) {
            return false;
        }

        this.#removeAdjacententry(position, 'top');
        this.#removeAdjacententry(position, 'right');
        this.#removeAdjacententry(position, 'bottom');
        this.#removeAdjacententry(position, 'left');
    }

    detect(min = 2) {
        let sequence;

        return Object.keys(this.table).some(root => {
            const { path, found } = this.#firstFound(root, min);
            sequence = path;

            return found;
        });
    }

    get table() {
        return this.table;
    }

    // -------
    // Private
    // -------

    #addAdjacentEntry(position = [], id, direction = 'top') {
        const grid = this.ingredientsGrid;
        const positionKey = keyToString(position);
        let inverse;
        let adjacentKey;

        switch(direction) {
            case 'top':
                adjacentKey = topKey(position);
                inverse = 'bottom';
                break;
            case 'right':
                adjacentKey = rightKey(position)
                inverse = 'left';
                break;
            case 'bottom':
                adjacentKey = bottomKey(position);
                inverse = 'top';
                break;
            case 'left':
                adjacentKey = leftKey(position);
                inverse = 'right';
                break;
            default:
                break;
        }

        if (adjacentKey !== false) {
            if (this.table.hasOwnProperty(adjacentKey)) {
                if (grid.idAtCell(...keyToArray(adjacentKey)) === id) {
                    this.table[positionKey][direction] = this.table[adjacentKey];
                    this.table[adjacentKey][inverse] = this.table[positionKey];
                } else {
                    this.table[positionKey][direction] = false;
                    this.table[adjacentKey][inverse] = false;
                }
            }
        } else {
            this.table[positionKey][direction] = false;
        }
    }

    #removeAdjacententry(position = [], direction = 'top') {
        const positionKey = keyToString(position);
        let inverse;
        let adjacentKey;

        switch(direction) {
            case 'top':
                adjacentKey = topKey(position);
                inverse = 'bottom';
                break;
            case 'right':
                adjacentKey = rightKey(position)
                inverse = 'left';
                break;
            case 'bottom':
                adjacentKey = bottomKey(position);
                inverse = 'top';
                break;
            case 'left':
                adjacentKey = leftKey(position);
                inverse = 'right';
                break;
            default:
                break;
        }

        if (typeof this.table[positionKey][direction] === 'object') {
            this.table[positionKey][direction] = false;
            this.table[adjacentKey][inverse] = false;
        }
    }

    #firstFound(root, min, path = [], visited = {}) {
        const entry = this.table[root];
        let found = false;

        path.push(root);
        visited[root] = true;

        if (path.length < min) {
            if (!found && entry.top && !visited[entry.top.position]) {
                const { found: topFound } = this.#firstFound(entry.top.position, min, path, visited);

                found = topFound;

                if (!found) {
                    path.splice(0);
                }
            }

            if (!found && entry.right && !visited[entry.right.position]) {
                const { found: rightFound } = this.#firstFound(entry.right.position, min, path, visited);

                found = rightFound;

                if (!found) {
                    path.splice(0);
                }
            }

            if (!found && entry.bottom && !visited[entry.bottom.position]) {
                const { found: bottomFound } = this.#firstFound(entry.bottom.position, min, path, visited);

                found = bottomFound;

                if (!found) {
                    path.splice(0);
                }
            }

            if (!found && entry.left && !visited[entry.left.position]) {
                const { found: leftFound } = this.#firstFound(entry.left.position, min, path, visited);

                found = leftFound;

                if (!found) {
                    path.splice(0);
                }
            }
        } else {
            found = true;
        }

        return {
            path,
            found,
        };
    }
}
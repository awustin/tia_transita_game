export const BASEMENT_X = 276;
export const BLOOD_X = 588;
export const BLOOD_Y = 364;
export const BUTTON_CLOSE_X = 1212;
export const BUTTON_COLLECT_X = 614;
export const BUTTON_COLLECT_Y = 745;
export const BUTTON_CONTROLS_Y = 26;
export const BUTTON_ON_OFF_X = 1160;
export const BUTTON_SOUND_X = 1108;
export const CELL_SIZE_PX = 52; // cell is 52x52 px
export const GRID_COUNT = 9; // 9 x 9 items
export const GRID_X = 432;
export const GRID_Y = 208;
export const HEIGHT = 832;
export const KEYBOARD_SPACE_X = 613;
export const KEYBOARD_SPACE_Y = 772;
export const LARGE_DIALOG_H = 52;
export const LARGE_DIALOG_W = 364;
export const LARGE_DIALOG_Y = 104;
export const LARGE_DIALOG_X = 484;
export const MERCURIA_X = 900;
export const MERCURIA_Y = 104;
export const SMALL_DIALOG_H = 52;
export const SMALL_DIALOG_W = 156;
export const SMALL_DIALOG_Y = 104;
export const SMALL_DIALOG_X = 692;
export const STAIRCASE_X = 224;
export const STYLE_DIALOG = {
    color: '#fff',
    font: '15px munro',
}
export const STYLE_GREEN = {
    color: '#dfff68',
    font: '20px munro',
};
export const STYLE_WHITE = {
    color: '#e6e6e6',
    font: '20px munro',
};
export const TEXT_COLLECT = 'collect';
export const TEXT_OFF = 'off';
export const TEXT_ON = 'on';
export const TEXT_PRESS_SPACE_TO_START = 'Press SPACE to start...';
export const TEXT_SOUND = 'sound';
export const TEXT_X = 'x';
export const TITLE_X = 640;
export const TITLE_Y = 416;
export const TRANSITA_X = 614;
export const TRANSITA_Y = 312;
export const WIDTH = 1280;

// Should read from config file
export const initialState = {
    ingredientsProperties: {
        1: {labour: 1, astrology: 0, necromancy: 0},
        2: {labour: 0, astrology: 1, necromancy: 0},
        3: {labour: 0, astrology: 0, necromancy: 1},
        4: {labour: 2, astrology: 0, necromancy: 0},
    },
    spells: {
        'blockCells': {id: 1, params: null},
        'maxMoves': {id: 2, params: null},
        'changeBoard': {id: 3, params: null},
        'resetBoard': {id: 4, params: null},
    },
};

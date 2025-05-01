import tinycolor from 'tinycolor2';

// Define base colors
const baseColors = {
    red: tinycolor('#E53935').brighten(10).saturate(10).toString(),
    magenta: tinycolor('#E91E63').brighten(10).saturate(10).toString(),
    volcano: tinycolor('#EE7622').brighten(10).saturate(10).toString(),
    orange: tinycolor('#FF9800').brighten(10).saturate(10).toString(),
    yellow: tinycolor('#FFEB3B').brighten(10).saturate(10).toString(),
    lime: tinycolor('#CDDC39').brighten(10).saturate(10).toString(),
    olive: tinycolor('#8BC34A').brighten(10).saturate(10).toString(),
    green: tinycolor('#4CAF50').brighten(10).saturate(10).toString(),
    cyan: tinycolor('#00ACC1').brighten(10).saturate(10).toString(),
    teal: tinycolor('#00BCD4').brighten(10).saturate(10).toString(),
    blue: tinycolor('#2196F3').brighten(10).saturate(10).toString(),
    indigo: tinycolor('#3F51B5').brighten(10).saturate(10).toString(),
    violet: tinycolor('#9C27B0').brighten(10).saturate(10).toString(),
    purple: tinycolor('#7B1FA2').brighten(10).saturate(10).toString(),
    brown: tinycolor('#795548').brighten(10).saturate(10).toString(),
    gray: tinycolor('#959595').toString(),
};

// Function to generate color gradients
const generateGradient = (baseColor: string) => {
    return {
        1: tinycolor(baseColor).lighten(40).toString(),
        2: tinycolor(baseColor).lighten(30).toString(),
        3: tinycolor(baseColor).lighten(20).toString(),
        4: tinycolor(baseColor).lighten(10).toString(),
        5: tinycolor(baseColor).toString(),
        6: tinycolor(baseColor).darken(15).toString(),
        7: tinycolor(baseColor).darken(25).toString(),
        8: tinycolor(baseColor).darken(35).toString(),
        9: tinycolor(baseColor).darken(45).toString(),
        10: tinycolor(baseColor).darken(55).toString(),
    };
};

// Generate gradients for each base color
const red = generateGradient(baseColors.red);
const magenta = generateGradient(baseColors.magenta);
const volcano = generateGradient(baseColors.volcano);
const orange = generateGradient(baseColors.orange);
const yellow = generateGradient(baseColors.yellow);
const lime = generateGradient(baseColors.lime);
const green = generateGradient(baseColors.green);
const teal = generateGradient(baseColors.teal);
const cyan = generateGradient(baseColors.cyan);
const blue = generateGradient(baseColors.blue);
const indigo = generateGradient(baseColors.indigo);
const violet = generateGradient(baseColors.violet);
const purple = generateGradient(baseColors.purple);
const brown = generateGradient(baseColors.brown);
const gray = generateGradient(baseColors.gray);
const olive = generateGradient(baseColors.olive);

const main = cyan;
const mainBase = baseColors.cyan;
const secondary = gray;

const vs = {
    blue: "#4fc1ff",
    blue5: "#569CD6",
    blue2: "#6796e6",
    blue3: "#007ACC",
    blue4: "#0078d4",
    orange: "#CE9178",
    yellow: "#DCDCAA",
    yellow2: "#d7ba7d",
    gray: "#9CDCFE",
    gray2: "#808080",
    gray3: "#d4d4d4",
    red: "#ce9178",
    red3: "#d16969",
    red2: "#F44747",
    maroon: "#c586c0",
    purple: "#B5CEA8",
    green3: "#16825D",
    green4: "#369432",
    green2: "#6A9955",
    green: "#4ec9b0",
    violet: "#646695",

    background: "#1E1E1E",
    backgroundDark: "#181818",
    foreground: "#D4D4D4",
    border: "#6B6B6B",
    gutter: "#1E1E1E",
    gutterForeground: "#858585",
    selection: "#264F78",
}

const color = {
    background: {
        default: vs.background, // main[9],
        dark: main[10],
        light: main[8],
        message: tinycolor(mainBase).darken(40).toString(),
        scrollBar: tinycolor(mainBase).darken(42).toString(),
        selection: tinycolor.mix(baseColors.cyan, baseColors.green, 50).darken(35).toString(),
    },
    text: {
        default: secondary[3],
        dark: secondary[2],
        light: secondary[5],
        mainDefault: main[3],
        mainLight: main[6],
        mainDisabled: main[7],
        successs: lime[3],
        selection: green[1],
        selectionDark: green[5],
        error: red[3],
    },
    icon: {
        default: main[3],
        dark: main[1],
        light: main[6],
        disabled: main[7],
    },
    border: {
        active: main[6],
        default: main[7],
        light: main[8],
        success: lime[4],
        error: red[7],
        selection: green[6],
        selectionLight: green[8],
    },
    shadow: {
        default: `0 0 20px 0px ${cyan[6]}`,
    },
    error: {
        background: red[10],
        text: red[3],
        border: red[9],
        textHover: red[5],
    },
    success: {
        background: green[9],
        text: green[3],
        border: green[8],
        textHover: green[5],
    },
    warning: {
        background: yellow[10],
        text: yellow[3],
        border: yellow[9],
        textHover: yellow[7],
    },
    grid: {
        headerCellBackground: vs.backgroundDark, // main[9],
        headerCellColor: secondary[5],
        dataCellBackground: vs.background, //main[9],
        borderColor: tinycolor(main[8]).darken(1).toString(),
        dataCellColor: secondary[3],
        selectionColor: {
            selected: tinycolor(cyan[4]).setAlpha(0.12).toString(),
            hovered: tinycolor(cyan[4]).setAlpha(0.06).toString(),
            border: cyan[6],
            borderLight: cyan[8],
        }
    },
    gray,
    blue,
    teal,
    cyan,
    green,
    indigo,
    magenta,
    orange,
    red,
    violet,
    purple,
    volcano,
    yellow,
    lime,
    olive,
    brown,
    vs,
};

export default color;

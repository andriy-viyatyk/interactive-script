const vscode = {
    focusBorder: "var(--vscode-focusBorder, #007acc)",
    editor: {
        background: "var(--vscode-editor-background, #1f1f1f)",
        foreground: "var(--vscode-editor-foreground, #cccccc)",
        selectionBackground: "var(--vscode-editor-selectionBackground, #264f78)",
        selectionHighlightBackground: "var(--vscode-editor-selectionHighlightBackground, rgba(173, 214, 255, 0.15))",
    },
    editorInlayHint: {
        background: "var(--vscode-editorInlayHint-background, rgba(97, 97, 97, 0.1))",
        foreground: "var(--vscode-editorInlayHint-foreground, #969696)",
    },
    sidebar: {
        background: "var(--vscode-sideBar-background, #181818)",
        foreground: "var(--vscode-sideBar-foreground, #cccccc)",
        border: "var(--vscode-sideBar-border, #2b2b2b)",
    },
    widget: {
        border: "var(--vscode-widget-border, #313131)",
        shadow: "var(--vscode-widget-shadow, rgba(0, 0, 0, 0.36))",
    },
    input: {
        background: "var(--vscode-input-background, #313131)",
        foreground: "var(--vscode-input-foreground, #cccccc)",
        border: "var(--vscode-input-border, #3c3c3c)",
    },
    icon: {
        foreground: "var(--vscode-icon-foreground, #cccccc)",
        disabled: "var(--vscode-debugIcon-breakpointDisabledForeground, #848484)",
    },
    minimapSlider: {
        background: "var(--vscode-minimapSlider-background, rgba(121, 121, 121, 0.2))",
        hoverBackground: "var(--vscode-minimapSlider-hoverBackground, rgba(100, 100, 100, 0.35))",
        activeBackground: "var(--vscode-minimapSlider-activeBackground, rgba(191, 191, 191, 0.2))",
    },
    terminal: {
        ansiBlack: "var(--vscode-terminal-ansiBlack, #000000)",
        ansiRed: "var(--vscode-terminal-ansiRed, #cd3131)",
        ansiGreen: "var(--vscode-terminal-ansiGreen, #0dbc79)",
        ansiYellow: "var(--vscode-terminal-ansiYellow, #e5e510)",
        ansiBlue: "var(--vscode-terminal-ansiBlue, #2472c8)",
        ansiMagenta: "var(--vscode-terminal-ansiMagenta, #bc3fbc)",
        ansiCyan: "var(--vscode-terminal-ansiCyan, #11a8cd)",
        ansiWhite: "var(--vscode-terminal-ansiWhite, #e5e5e5)",
        ansiBrightBlack: "var(--vscode-terminal-ansiBrightBlack, #666666)",
        ansiBrightRed: "var(--vscode-terminal-ansiBrightRed, #f14c4c)",
        ansiBrightGreen: "var(--vscode-terminal-ansiBrightGreen, #23d18b)",
        ansiBrightYellow: "var(--vscode-terminal-ansiBrightYellow, #f5f543)",
        ansiBrightBlue: "var(--vscode-terminal-ansiBrightBlue, #3b8eea)",
        ansiBrightMagenta: "var(--vscode-terminal-ansiBrightMagenta, #d670d6)",
        ansiBrightCyan: "var(--vscode-terminal-ansiBrightCyan, #29b8db)",
    },
    terminalSymbolIcon: {
        methodForeground: "var(--vscode-terminalSymbolIcon-methodForeground, #b180d7)",
        argumentForeground: "var(--vscode-terminalSymbolIcon-argumentForeground, #75beff)",
        optionForeground: "var(--vscode-terminalSymbolIcon-optionForeground, #ee9d28)",
    },
    list: {
        errorForeground: "var(--vscode-list-errorForeground, #f88070)",
        warningForeground: "var(--vscode-list-warningForeground, #cca700)",
        highlightForeground: "var(--vscode-list-highlightForeground, #2aaaff)",
    },
    charts: {
        red: "var(--vscode-charts-red, #f14c4c)",
        blue: "var(--vscode-charts-blue, #3794ff)",
        yellow: "var(--vscode-charts-yellow, #cca700)",
        orange: "var(--vscode-charts-orange, #d18616)",
        green: "var(--vscode-charts-green, #89d185)",
        purple: "var(--vscode-charts-purple, #b180d7)",
    },
    button: {
        secondaryBackground: "var(--vscode-button-secondaryBackground, #313131)",
    },
}

const color = {
    background: {
        default: vscode.editor.background, 
        dark: vscode.sidebar.background, 
        light: vscode.button.secondaryBackground,
    },
    text: {
        default: vscode.editor.foreground,
        dark: vscode.editor.foreground,
        light: vscode.editorInlayHint.foreground,
    },
    icon: {
        default: vscode.icon.foreground,
        dark: vscode.icon.foreground,
        light: vscode.editorInlayHint.foreground,
        disabled: vscode.icon.disabled,
    },
    border: {
        active: vscode.focusBorder, 
        default: vscode.input.border, 
        light: vscode.sidebar.border, 
    },
    shadow: {
        default: vscode.widget.shadow,
    },
    grid: {
        headerCellBackground: vscode.sidebar.background, 
        headerCellColor: vscode.sidebar.foreground,
        dataCellBackground: vscode.editor.background,
        borderColor: vscode.sidebar.border,
        dataCellColor: vscode.editor.foreground,
        selectionColor: {
            selected: vscode.minimapSlider.background,
            hovered: vscode.minimapSlider.background,
            border: vscode.focusBorder,
            borderLight: vscode.input.border,
        }
    },
    misc: {
        blue: vscode.charts.blue,
        green: vscode.charts.green,
        red: vscode.list.errorForeground,
        yellow: vscode.charts.yellow,
        cian: vscode.terminal.ansiBrightCyan,
    },
};

export default color;

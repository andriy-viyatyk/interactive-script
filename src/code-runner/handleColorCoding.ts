import Anser from "anser";
import { UiText } from "../../shared/ViewMessage";

export function handleColorCoding(line: string): UiText {
    try {
        const parsed = Anser.ansiToJson(line, { json: true, remove_empty: true });
        const uiText = parsed.map((part) => {
            const styles: Record<string, any> = {};
            if (part.fg) styles.color = ansiColorToCss(part.fg);
            if (part.bg) styles.backgroundColor = ansiColorToCss(part.bg);

            if (part.decoration) {
                const decorations = part.decoration.split(" ");
                for (const deco of decorations) {
                    if (deco === "bold") styles.fontWeight = "bold";
                    if (deco === "italic") styles.fontStyle = "italic";
                    if (deco === "underline") styles.textDecoration = "underline";
                }
            }

            return {
                text: part.content,
                styles,
            };
        });

        return uiText;
    } catch {
        return line; // Fallback to plain text if parsing fails
    }
    
}

function ansiColorToCss(ansiColor: string | number): string | undefined {
    // Map of ANSI color names and codes to CSS color values
    const colorMap: Record<string | number, string> = {
        // Standard colors
        black: "#000000", 30: "#000000",
        red: "#f14c4c", 31: "#f14c4c",
        green: "#00ff00", 32: "#00ff00",
        yellow: "#ffff00", 33: "#ffff00",
        blue: "#0000ff", 34: "#0000ff",
        magenta: "#ff00ff", 35: "#ff00ff",
        cyan: "#00ffff", 36: "#00ffff",
        white: "#ffffff", 37: "#ffffff",
        // Bright colors
        brightBlack: "#808080", 90: "#808080",
        brightRed: "#ff6666", 91: "#ff6666",
        brightGreen: "#55ff55", 92: "#55ff55",
        brightYellow: "#ffff55", 93: "#ffff55",
        brightBlue: "#5555ff", 94: "#5555ff",
        brightMagenta: "#ff55ff", 95: "#ff55ff",
        brightCyan: "#55ffff", 96: "#55ffff",
        brightWhite: "#ffffff", 97: "#ffffff",
        "187, 0, 0": "#f14c4c",
    };

    // Try direct match
    if (ansiColor in colorMap) {
        return colorMap[ansiColor];
    }
    // Try string conversion for numeric codes
    if (typeof ansiColor === "number" && colorMap[String(ansiColor)]) {
        return colorMap[String(ansiColor)];
    }
    // Handle RGB string like "187, 0, 0"
    if (typeof ansiColor === "string" && /^\d{1,3},\s*\d{1,3},\s*\d{1,3}$/.test(ansiColor)) {
        return `rgb(${ansiColor})`;
    }
    // Fallback: return as-is if it's a valid CSS color name
    if (typeof ansiColor === "string" && /^#[0-9a-f]{6}$/i.test(ansiColor)) {
        return ansiColor;
    }
    return undefined;
}
const delimiters = "-_/ :.,"; // Define the delimiters to split string values

export const packedGridArrayType = "packed-array";
export interface PackedGridData {
    type: string;
    map: Record<string, string>;
    items: any[];
}

// Generate UTF-16 characters sequentially, excluding delimiters
function* utf16Generator() {
    const start = 0x0020; // Start from printable characters
    const end = 0xffff; // End of BMP (Basic Multilingual Plane)

    // Filter out invalid surrogate pairs and delimiters
    const validChars = [];
    for (let i = start; i <= end; i++) {
        if (i >= 0xd800 && i <= 0xdfff) continue; // Skip surrogate pairs
        const char = String.fromCharCode(i);
        if (!delimiters.includes(char)) validChars.push(char);
    }

    let currentLength = 1; // Start with single-character strings

    while (true) {
        const combinations = generateCombinations(validChars, currentLength);
        for (const combination of combinations) {
            yield combination;
        }
        currentLength++; // Increase the length of strings
    }
}

// Helper function to generate combinations of characters of a given length
function* generateCombinations(
    chars: string[],
    length: number
): Generator<string> {
    if (length === 1) {
        for (const char of chars) {
            yield char;
        }
    } else {
        for (const char of chars) {
            for (const subCombination of generateCombinations(
                chars,
                length - 1
            )) {
                yield char + subCombination;
            }
        }
    }
}

export class PackedGridArray {
    private map: Record<string, string> = {};
    private reverseMap: Record<string, string> = {};
    private generator = utf16Generator();
    private items: any[] = [];

    private readonly getKey = (value: string): string => {
        if (!this.reverseMap[value]) {
            const key = this.generator.next().value;
            if (!key) throw new Error("Exhausted UTF-16 character space!");
            this.map[key] = value;
            this.reverseMap[value] = key;
        }
        return this.reverseMap[value];
    };

    private readonly packValue = (value: any): any => {
        if (typeof value !== "string") {
            return value; // Do not replace non-string values
        }

        // Split the string by delimiters
        const parts = value.split(new RegExp(`[${delimiters}]`));
        const separators =
            value.match(new RegExp(`[${delimiters}]`, "g")) || [];

        // Replace each part with a generated key
        const packedParts = parts.map((part) => this.getKey(part));

        // Rejoin the parts with the original separators
        let packedValue = packedParts[0];
        for (let i = 0; i < separators.length; i++) {
            packedValue += separators[i] + packedParts[i + 1];
        }
        return packedValue;
    };

    addItem = (item: any): void => {
        const packedItem: Record<string, any> = {};
        for (const [key, value] of Object.entries(item)) {
            packedItem[this.getKey(key)] = this.packValue(value);
        }
        this.items.push(packedItem);
    };

    addItems = (items: any[]): void => {
        for (const item of items) {
            this.addItem(item);
        }
    };

    get result() {
        return { type: packedGridArrayType, map: this.map, items: this.items };
    }

    // Unpack a compact JSON format back into the original array
    static unpackArray = (packed: {
        type: string;
        map: Record<string, string>;
        items: any[];
    }): any[] => {
        if (packed.type !== packedGridArrayType) {
            throw new Error("Invalid packed array format");
        }
        
        const { map, items } = packed;

        function unpackValue(value: any): any {
            if (typeof value !== "string") {
                return value; // Do not replace non-string values
            }

            // Split the string by delimiters
            const parts = value.split(new RegExp(`[${delimiters}]`));
            const separators =
                value.match(new RegExp(`[${delimiters}]`, "g")) || [];

            // Replace each part with the original value from the map
            const unpackedParts = parts.map((part) => map[part]);

            // Rejoin the parts with the original separators
            let unpackedValue = unpackedParts[0];
            for (let i = 0; i < separators.length; i++) {
                unpackedValue += separators[i] + unpackedParts[i + 1];
            }
            return unpackedValue;
        }

        return items.map((item) => {
            const unpackedItem: Record<string, any> = {};
            for (const [key, value] of Object.entries(item)) {
                unpackedItem[map[key]] = unpackValue(value);
            }
            return unpackedItem;
        });
    };
}

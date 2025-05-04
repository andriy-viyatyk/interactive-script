function getRow(index: number) {
    return {
        name: `Item ${index}`,
        description: `Description for item ${index}`,
        value: index,
        timestamp: new Date().toISOString(),
        isActive: index % 2 === 0,
        isSelected: index % 3 === 0,
        city: `City ${index}`,
        country: `Country ${index}`,
        address: `Address ${index}`,
        phone: `${index.toString()[0].repeat(3)}-${(index.toString()[1] ?? "0").repeat(3)}-${(index.toString()[2] ?? "0").repeat(4)}`,
    };
}

export function generateRows(count: number) {
    return Array.from({ length: count }, (_, i) => getRow(i + 1));
}
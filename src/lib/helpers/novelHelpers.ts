export function truncateDescription(
    description: string,
    maxLength: number = 150,
): string {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + "...";
}

export function formatBigNumber(value: number): string {
    const absValue = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    const format = (num: number, suffix: string) => {
        // remove unnecessary .00 decimals
        const formatted = parseFloat(num.toFixed(2));
        return formatted % 1 === 0
            ? `${sign}${formatted.toFixed(0)}${suffix}`
            : `${sign}${formatted}${suffix}`;
    };

    if (absValue >= 1_000_000_000_000) {
        return format(value / 1_000_000_000_000, 'T');
    }
    if (absValue >= 1_000_000_000) {
        return format(value / 1_000_000_000, 'B');
    }
    if (absValue >= 1_000_000) {
        return format(value / 1_000_000, 'M');
    }
    if (absValue >= 1_000) {
        return format(value / 1_000, 'K');
    }

    // For numbers below 1000, show plain integer (no decimals or commas)
    return `${value}`;
}


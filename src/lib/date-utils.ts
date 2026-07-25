/**
 * Formats date strings (e.g. "2026-03-01", "2026-06-30", "March 01, 2026")
 * into the "DD Month" format with no year (e.g. "01 March", "30 June").
 */
export function formatResearchDate(dateStr?: string): string {
    if (!dateStr) return '';
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const trimmed = dateStr.trim();

    // Check ISO format YYYY-MM-DD
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
        const day = parseInt(isoMatch[3], 10);
        const monthIndex = parseInt(isoMatch[2], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            const paddedDay = String(day).padStart(2, '0');
            return `${paddedDay} ${monthNames[monthIndex]}`;
        }
    }

    // Fallback Date parser
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
        const day = parsed.getUTCDate();
        const monthName = monthNames[parsed.getUTCMonth()];
        const paddedDay = String(day).padStart(2, '0');
        return `${paddedDay} ${monthName}`;
    }

    return dateStr;
}

/**
 * Formats date strings with full year (e.g. "March 1, 2026").
 */
export function formatResearchDateFull(dateStr?: string): string {
    if (!dateStr) return '';
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const trimmed = dateStr.trim();

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoMatch) {
        const year = isoMatch[1];
        const day = parseInt(isoMatch[3], 10);
        const monthIndex = parseInt(isoMatch[2], 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            const paddedDay = String(day).padStart(2, '0');
            return `${paddedDay} ${monthNames[monthIndex]} ${year}`;
        }
    }

    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
        const day = parsed.getUTCDate();
        const paddedDay = String(day).padStart(2, '0');
        const monthName = monthNames[parsed.getUTCMonth()];
        const year = parsed.getUTCFullYear();
        return `${paddedDay} ${monthName} ${year}`;
    }

    return dateStr;
}

/**
 * Calculates estimated reading time in minutes and total word count for HTML/Markdown text.
 */
export function calculateReadingTime(text: string): { minutes: number; wordCount: number } {
    if (!text) return { minutes: 1, wordCount: 0 };
    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText ? cleanText.split(' ').length : 0;
    const minutes = Math.max(1, Math.ceil(words / 225));
    return { minutes, wordCount: words };
}

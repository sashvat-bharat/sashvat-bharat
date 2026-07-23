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

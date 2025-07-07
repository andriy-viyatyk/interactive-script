export function validDateOrNull(date?: string | Date): Date | null {
    if (!date) return null;
    const parsedDate = new Date(date);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
}
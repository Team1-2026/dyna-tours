/**
 * Returns today's date string in 'YYYY-MM-DD' local time format
 * Suitable for HTML5 <input type="date" min="..." />
 */
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

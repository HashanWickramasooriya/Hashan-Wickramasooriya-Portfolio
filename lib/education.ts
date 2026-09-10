/** Derives a study status label from a "YYYY – YYYY" or "YYYY" period string — never authored, always computed. */
export function getStudyStatus(period: string): 'In Progress' | 'Completed' {
  const years = period.match(/\d{4}/g);
  const endYear = years ? Number(years[years.length - 1]) : 0;
  const currentYear = new Date().getFullYear();
  return endYear >= currentYear ? 'In Progress' : 'Completed';
}

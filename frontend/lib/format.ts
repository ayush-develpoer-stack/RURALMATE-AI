export function formatINR(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function formatINRShort(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2) + ' Cr';
  if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
  if (n >= 1000) return '₹' + (n / 1000).toFixed(1) + 'K';
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function formatMonths(n: number | null | undefined): string {
  if (n === null || n === undefined) return 'Not reached';
  if (n <= 0) return 'Not reached';
  if (n < 12) return `${n} month${n === 1 ? '' : 's'}`;
  const years = Math.floor(n / 12);
  const months = n % 12;
  return `${years}y ${months}m`;
}

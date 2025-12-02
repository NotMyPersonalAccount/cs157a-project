type BirthDateInfo = {
  formatted: string | null;
  year: number | null;
  age: number | null;
};

export function formatBirthDate(dateStr: string | null): BirthDateInfo {
  const EMPTY: BirthDateInfo = { formatted: null, year: null, age: null };
  if (!dateStr) return EMPTY;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return EMPTY;

  const year = date.getFullYear();

  const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
  const age = Math.floor((Date.now() - date.getTime()) / MS_PER_YEAR);

  const formatted = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return { formatted, year, age };
}
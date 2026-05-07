export function getColumnsAssignedText(mappedColumnsCount: number): string {
  if (mappedColumnsCount === 0) return 'No columns assigned';
  if (mappedColumnsCount === 1) return '1 column assigned';
  return `${mappedColumnsCount} columns assigned`;
}

// TODO: refine the logic for generating abbreviations
export function generateAbbreviation(label: string): string {
  if (!label) return '';
  const words = label.trim().split(/[\s_-]+/);
  if (words.length > 1) {
    return words.map((word) => word[0].toUpperCase()).join('');
  }
  return label;
}

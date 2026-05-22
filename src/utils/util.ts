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

// URL validation uses the browser's native WHATWG URL parser (the exact same standard rust-url implements)
export const isValidUrl = (string: string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Email regex corresponds to the HTML5 specification (approximates the RFC 5322 standard used by Pydantic's email-validator)
export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

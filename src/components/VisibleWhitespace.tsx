import { useContext } from 'react';
import { FormattingMarksContext } from '../contexts/FormattingMarksContext';

interface VisibleWhitespaceProps {
  value: unknown;
}

export default function VisibleWhitespace({ value }: VisibleWhitespaceProps) {
  const showFormattingMarks = useContext(FormattingMarksContext);

  if (typeof value !== 'string') {
    return <span>{JSON.stringify(value)}</span>;
  }

  if (!showFormattingMarks) {
    return <span>{value}</span>;
  }

  if (value === '') {
    return <span className="whitespace-pre-wrap font-mono">&quot;&quot;</span>;
  }

  const visuallyFormatted = value
    .replace(/ /g, '·')
    .replace(/\t/g, '→')
    .replace(/\n/g, '¶\n')
    .replace(/\r/g, '¤');

  return <span className="whitespace-pre-wrap font-mono">{visuallyFormatted}</span>;
}

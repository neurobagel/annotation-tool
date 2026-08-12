import { useContext } from 'react';
import { FormattingMarksContext } from '../contexts/FormattingMarksContext';
import { formatVisibleWhitespace } from '../utils/util';

interface VisibleWhitespaceProps {
  value: unknown;
}

export default function VisibleWhitespace({ value }: VisibleWhitespaceProps) {
  const showFormattingMarks = useContext(FormattingMarksContext);

  if (typeof value !== 'string') {
    const stringified = JSON.stringify(value);
    return (
      <span data-cy="visible-whitespace" className="whitespace-pre-wrap font-mono">
        {stringified ?? String(value)}
      </span>
    );
  }

  if (!showFormattingMarks) {
    return (
      <span data-cy="visible-whitespace" className="whitespace-pre-wrap font-mono">
        {value}
      </span>
    );
  }

  if (value === '') {
    return (
      <span data-cy="visible-whitespace" className="whitespace-pre-wrap font-mono">
        &quot;&quot;
      </span>
    );
  }

  return (
    <span data-cy="visible-whitespace" className="whitespace-pre-wrap font-mono">
      {formatVisibleWhitespace(value)}
    </span>
  );
}

import React, { useState } from 'react';
import { FormattingMarksContext } from './FormattingMarksContext';

export function FormattingMarksProvider({ children }: { children: React.ReactNode }) {
  const [showFormattingMarks, setShowFormattingMarks] = useState(false);

  return (
    <FormattingMarksContext.Provider value={{ showFormattingMarks, setShowFormattingMarks }}>
      {children}
    </FormattingMarksContext.Provider>
  );
}

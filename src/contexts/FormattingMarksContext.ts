import { createContext, useContext } from 'react';

export interface FormattingMarksContextType {
  showFormattingMarks: boolean;
  setShowFormattingMarks: (show: boolean) => void;
}

export const FormattingMarksContext = createContext<FormattingMarksContextType | boolean>({
  showFormattingMarks: false,
  setShowFormattingMarks: () => {},
});

export function useFormattingMarks() {
  const context = useContext(FormattingMarksContext);
  if (typeof context === 'boolean') {
    return { showFormattingMarks: context, setShowFormattingMarks: () => {} };
  }
  return context;
}

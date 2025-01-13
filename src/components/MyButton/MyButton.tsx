import { useState } from 'react';
import Button from '@mui/material/Button';

export function MyButton() {
  const [count, setCount] = useState(0);

  return (
    <Button type="button" onClick={() => setCount((countInline) => countInline + 1)}>
      count is {count}
    </Button>
  );
}

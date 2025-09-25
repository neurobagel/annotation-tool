import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { List, type RowComponentProps } from 'react-window';

const ROW_HEIGHT = 52;
const MAX_ROWS = 6;

function RowComponent({ index, items, style }: RowComponentProps<{ items: ReactNode[] }>) {
  return <li style={style}>{items[index]}</li>;
}

const VirtualListbox = forwardRef<HTMLDivElement, HTMLAttributes<HTMLElement>>((props, ref) => {
  const { children, ...other } = props;
  const innerRef = useRef<HTMLDivElement>(null);

  const items = (Array.isArray(children) ? children : [children]) as ReactNode[];
  const rowCount = items.length;
  const height = Math.min(rowCount * ROW_HEIGHT, MAX_ROWS * ROW_HEIGHT);

  return (
    <div ref={ref}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <div ref={innerRef} style={{ height, overflow: 'auto' }} {...other}>
        <List
          rowComponent={RowComponent}
          rowCount={rowCount}
          rowHeight={ROW_HEIGHT}
          rowProps={{ items }}
        />
      </div>
    </div>
  );
});

export default VirtualListbox;

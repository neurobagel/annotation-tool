import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

const DEFAULT_ROW_HEIGHT = 52;
const MAX_ROWS = 6;

function RowComponent({ index, items, style }: RowComponentProps<{ items: ReactNode[] }>) {
  return <li style={style}>{items[index]}</li>;
}

export interface VirtualListboxProps extends HTMLAttributes<HTMLElement> {
  itemSize?: (index: number) => number;
}

const VirtualListbox = forwardRef<HTMLDivElement, VirtualListboxProps>((props, ref) => {
  const { children, itemSize, ...other } = props;
  const innerRef = useRef<HTMLDivElement>(null);

  const items = (Array.isArray(children) ? children : [children]) as ReactNode[];
  const rowCount = items.length;

  const getSize = itemSize || (() => DEFAULT_ROW_HEIGHT);

  let height = 0;
  for (let i = 0; i < Math.min(rowCount, MAX_ROWS); i += 1) {
    height += getSize(i);
  }

  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: DEFAULT_ROW_HEIGHT });

  return (
    <div ref={ref}>
      <div ref={innerRef} style={{ height, overflow: 'auto' }} {...other}>
        <List
          rowComponent={RowComponent}
          rowCount={rowCount}
          rowHeight={dynamicRowHeight}
          rowProps={{ items }}
        />
      </div>
    </div>
  );
});

export default VirtualListbox;

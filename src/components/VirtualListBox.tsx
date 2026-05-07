import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

const DEFAULT_ROW_HEIGHT = 52;
const MAX_ROWS = 6;

interface RenderProp {
  (props: { index: number; style: React.CSSProperties }): ReactNode;
}

function RowComponent({ index, items, style }: RowComponentProps<{ items: RenderProp }>) {
  return items({ index, style }) as React.ReactElement | null;
}

export interface VirtualListboxProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  itemSize?: (index: number) => number;
  itemCount: number;
  children: RenderProp;
}

const VirtualListbox = forwardRef<HTMLDivElement, VirtualListboxProps>((props, ref) => {
  const { children, itemSize, itemCount, ...other } = props;
  const innerRef = useRef<HTMLDivElement>(null);

  const getSize = itemSize || (() => DEFAULT_ROW_HEIGHT);

  let height = 0;
  for (let i = 0; i < Math.min(itemCount, MAX_ROWS); i += 1) {
    height += getSize(i);
  }

  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: DEFAULT_ROW_HEIGHT });

  return (
    <div ref={ref}>
      <div ref={innerRef} style={{ height, overflow: 'auto' }} {...other}>
        <List
          rowComponent={RowComponent}
          rowCount={itemCount}
          rowHeight={dynamicRowHeight}
          rowProps={{ items: children }}
        />
      </div>
    </div>
  );
});

export default VirtualListbox;

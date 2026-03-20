import { ReactNode, memo } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

const DEFAULT_ROW_HEIGHT = 160;

function RowComponent({ index, items, style }: RowComponentProps<{ items: ReactNode[] }>) {
  return (
    <div style={style} className="w-full px-1 pb-3">
      {items[index]}
    </div>
  );
}

interface VirtualColumnListProps {
  children: ReactNode | ReactNode[];
}

function VirtualColumnList({ children }: VirtualColumnListProps) {
  const items = (Array.isArray(children) ? children : [children]) as ReactNode[];
  const rowCount = items.length;

  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: DEFAULT_ROW_HEIGHT });

  return (
    <div className="flex-1 w-full h-full relative overflow-y-auto" data-cy="virtual-column-list">
      <List
        rowCount={rowCount}
        rowHeight={dynamicRowHeight}
        rowComponent={RowComponent}
        rowProps={{ items }}
      />
    </div>
  );
}

export default memo(VirtualColumnList);

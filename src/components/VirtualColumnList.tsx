import { ReactNode } from 'react';
import { List, type RowComponentProps, useDynamicRowHeight } from 'react-window';

const DEFAULT_ROW_HEIGHT = 160;

interface RenderProp {
  (props: { index: number; style: React.CSSProperties }): ReactNode;
}

function RowComponent({ index, items, style }: RowComponentProps<{ items: RenderProp }>) {
  return (
    <div style={style} className="w-full px-1 pb-3">
      {items({ index, style: {} })}
    </div>
  );
}

interface VirtualColumnListProps {
  children: RenderProp;
  itemCount: number;
}

function VirtualColumnList({ children, itemCount }: VirtualColumnListProps) {
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: DEFAULT_ROW_HEIGHT });

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden" data-cy="virtual-column-list">
      <List
        rowCount={itemCount}
        rowHeight={dynamicRowHeight}
        rowComponent={RowComponent}
        rowProps={{ items: children }}
      />
    </div>
  );
}

export default VirtualColumnList;

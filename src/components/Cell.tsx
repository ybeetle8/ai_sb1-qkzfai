import React, { memo } from 'react';
import { Disc } from 'lucide-react';

interface CellProps {
  value: number;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = memo(({ value, onClick }) => {
  return (
    <div
      className="w-10 h-10 bg-green-600 flex items-center justify-center cursor-pointer hover:bg-green-500 transition-colors duration-200"
      onClick={onClick}
    >
      {value === 1 && <Disc className="w-8 h-8 text-black" />}
      {value === 2 && <Disc className="w-8 h-8 text-white border border-black" />}
    </div>
  );
});

Cell.displayName = 'Cell';

export default Cell;
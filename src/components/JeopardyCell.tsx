"use client";
import React from "react";
import { JeopardyCell, useBoardStore } from "../store/editorStore";

interface CellProps {
  cell: JeopardyCell;
}

const Cell: React.FC<CellProps> = ({ cell }) => {
  const selectCell = useBoardStore((state) => state.selectCell);

  return (
    <div
      onClick={() => selectCell(cell)}
      className="flex items-center justify-center border border-gray-400 cursor-pointer bg-blue-500 text-white font-bold h-20 w-32 hover:bg-blue-600 transition"
    >
      
      {cell.points}
    </div>
  );
};

export default Cell;

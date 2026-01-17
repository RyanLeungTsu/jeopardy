"use client";
import React from "react";
import { useBoardStore } from "../store/editorStore";
import EditorUI from "./EditorUI";
import QuestionSlide from "./QuestionSlide";

const BoardGrid: React.FC = () => {
  const {
    cells,
    categories,
    selectedCell,
    selectCell,
    usedCells,
    markCellUsed,
    editMode,
    addRow,
    addColumn,
    removeRow,
    removeColumn,
  } = useBoardStore();

  return (
    <div className="p-4">
      {/* Categories */}
      <div
        className="grid gap-2 mb-2"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={i}
            className="flex items-center justify-center border border-gray-400 bg-gray-800 text-white font-bold h-16"
          >
            {cat}
          </div>
        ))}
      </div>
      {/* Adding and removing rows/columns */}
      {editMode && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={addRow}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            + Row
          </button>

          <button
            onClick={removeRow}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            - Row
          </button>

          <button
            onClick={addColumn}
            className="px-3 py-1 bg-green-500 text-white rounded"
          >
            + Column
          </button>

          <button
            onClick={removeColumn}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            - Column
          </button>
        </div>
      )}

      {/* Cells */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))`,
        }}
      >
        {cells.map((cell) => {
          const isUsed = usedCells[`${cell.row}-${cell.col}`];

          return (
            <div
              key={`${cell.row}-${cell.col}`}
              onClick={() => {
                if (editMode) {
                  selectCell(cell);
                } else if (!isUsed) {
                  markCellUsed(cell);
                  selectCell(cell);
                }
              }}
              className={`flex items-center justify-center border border-gray-400 font-bold h-20 w-32 transition
        ${isUsed ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"}`}
            >
              {cell.points}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {selectedCell &&
        (editMode ? (
          <EditorUI cell={selectedCell} close={() => selectCell(null)} />
        ) : (
          <QuestionSlide cell={selectedCell} close={() => selectCell(null)} />
        ))}
    </div>
  );
};

export default BoardGrid;

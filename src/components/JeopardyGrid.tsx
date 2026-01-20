"use client";
import { useBoardStore } from "../store/editorStore";
import EditorUI from "./EditorUI";
import QuestionSlide from "./QuestionSlide";

const BoardGrid: React.FC = () => {
  const {
    activeBoard,
    editMode,
    selectedCell,
    selectCell,
    markCellUsed,
    addRow,
    removeRow,
    addColumn,
    removeColumn,
    setCategoryAt,
  } = useBoardStore();

  if (!activeBoard) return null;

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Board wrapper */}
      <div className="relative w-full max-w-[1400px] h-[700px]">
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateRows: `repeat(${activeBoard.rows + 1}, 1fr)`,
            gridTemplateColumns: `repeat(${activeBoard.columns}, 1fr)`,
          }}
        >
          {/* Categories */}
          {activeBoard.categories.map((cat, i) => (
            <div
              key={`cat-${i}`}
              className="border border-gray-400 bg-gray-800 text-white font-bold flex items-center justify-center px-1 text-center break-words"
              style={{ gridRow: 1, gridColumn: i + 1 }}
            >
              <input
                type="text"
                value={cat}
                onChange={(e) => setCategoryAt(i, e.target.value)}
                readOnly={!editMode}
                className="w-full h-full bg-gray-800 text-white text-center font-bold border-none outline-none"
              />
            </div>
          ))}

          {/* Cells */}
          {activeBoard.cells.map((cell) => {
            const isUsed = activeBoard.usedCells[`${cell.row}-${cell.col}`];
            return (
              <div
                key={`cell-${cell.row}-${cell.col}`}
                onClick={() => {
                  selectCell(cell);
                  if (!editMode) markCellUsed(cell);
                }}
                className={`border border-gray-400 font-bold flex items-center justify-center cursor-pointer text-center px-1 break-words transition
                  ${isUsed ? "bg-gray-400 text-gray-700" : "bg-blue-500 text-white hover:bg-blue-600"}`}
                style={{
                  gridRow: cell.row + 2,
                  gridColumn: cell.col + 1,
                }}
              >
                {cell.points}
              </div>
            );
          })}
        </div>
      </div>

      {/* Row/Column */}
      {editMode && (
        <div className="flex gap-2 mt-4">
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

      {/* Modals */}
      {selectedCell && editMode && (
        <EditorUI cell={selectedCell} close={() => selectCell(null)} />
      )}
      {selectedCell && !editMode && (
        <QuestionSlide cell={selectedCell} close={() => selectCell(null)} />
      )}
    </div>
  );
};

export default BoardGrid;

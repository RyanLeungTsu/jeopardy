import { create } from "zustand";

export type CellType = "text" | "image" | "audio" | "video";

export interface Slide {
  type: CellType;
  content: string;
}

export interface JeopardyCell {
  row: number;
  col: number;
  points: number;
  slides: Slide[];
}

interface BoardState {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  rows: number;
  columns: number;
  addRow: () => void;
  addColumn: () => void;
  removeRow: () => void;
  removeColumn: () => void;
  categories: string[];
  cells: JeopardyCell[];
  selectedCell: JeopardyCell | null;
  selectCell: (cell: JeopardyCell | null) => void;
  updateCell: (cell: JeopardyCell) => void;
}

export const useBoardStore = create<BoardState>((set, get) => {
  const rows = 5;
  const columns = 6;

  const cells: JeopardyCell[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      cells.push({
        row: r,
        col: c,
        points: (r + 1) * 100,
        slides: [
          { type: "text", content: `Question ${r + 1}-${c + 1}` },
          { type: "text", content: `Answer ${r + 1}-${c + 1}` },
        ],
      });
    }
  }

  return {
    editMode: false,
    setEditMode: (mode: boolean) => set({ editMode: mode }),

    rows,
    columns,
    categories: Array(columns).fill("Category"),
    cells,

    selectedCell: null,
    selectCell: (cell) => set({ selectedCell: cell }),

    updateCell: (updated) =>
      set({
        cells: get().cells.map((c) =>
          c.row === updated.row && c.col === updated.col ? updated : c
        ),
      }),

    addRow: () => {
      const { rows, columns, cells } = get();
      const newRow = rows;

      const newCells = [...cells];

      for (let c = 0; c < columns; c++) {
        newCells.push({
          row: newRow,
          col: c,
          points: (newRow + 1) * 100,
          slides: [
            { type: "text", content: "" },
            { type: "text", content: "" },
          ],
        });
      }

      set({
        rows: rows + 1,
        cells: newCells,
      });
    },

    addColumn: () => {
      const { rows, columns, cells } = get();
      const newCol = columns;

      const newCells = [...cells];

      for (let r = 0; r < rows; r++) {
        newCells.push({
          row: r,
          col: newCol,
          points: (r + 1) * 100,
          slides: [
            { type: "text", content: "" },
            { type: "text", content: "" },
          ],
        });
      }

      set({
        columns: columns + 1,
        cells: newCells,
        categories: [...get().categories, "Category"],
      });
    },

    removeRow: () => {
      const { rows, cells } = get();
      if (rows <= 1) return;

      set({
        rows: rows - 1,
        cells: cells.filter((c) => c.row < rows - 1),
      });
    },

    removeColumn: () => {
      const { columns, cells, categories } = get();
      if (columns <= 1) return;

      set({
        columns: columns - 1,
        cells: cells.filter((c) => c.col < columns - 1),
        categories: categories.slice(0, -1),
      });
    },
  };
});

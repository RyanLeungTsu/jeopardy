import { create } from "zustand";

export type ElementKind = "text" | "image" | "audio" | "video";

export interface SlideElement {
  id: string;
  kind: ElementKind;
  content: string;

  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Slide {
  elements: SlideElement[];
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
  usedCells: { [key: string]: boolean };
  markCellUsed: (cell: JeopardyCell) => void;
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
          {
            elements: [
              {
                id: crypto.randomUUID(),
                kind: "text",
                content: "",
                x: 20,
                y: 20,
                width: 200,
                height: 200,
              },
            ],
          },
          {
            elements: [
              {
                id: crypto.randomUUID(),
                kind: "text",
                content: "",
                x: 20,
                y: 20,
                width: 200,
                height: 200,
              },
            ],
          },
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
          c.row === updated.row && c.col === updated.col ? updated : c,
        ),
      }),

    usedCells: {},

    markCellUsed: (cell) => {
      const key = `${cell.row}-${cell.col}`;
      set((state) => ({
        usedCells: { ...state.usedCells, [key]: true },
      }));
    },

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
            {
              elements: [
                {
                  id: crypto.randomUUID(),
                  kind: "text",
                  content: "",
                  x: 20,
                  y: 20,
                  width: 200,
                  height: 200,
                },
              ],
            },
            {
              elements: [
                {
                  id: crypto.randomUUID(),
                  kind: "text",
                  content: "",
                  x: 20,
                  y: 20,
                  width: 200,
                  height: 200,
                },
              ],
            },
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
            {
              elements: [
                {
                  id: crypto.randomUUID(),
                  kind: "text",
                  content: "",
                  x: 20,
                  y: 20,
                  width: 200,
                  height: 200,
                },
              ],
            },
            {
              elements: [
                {
                  id: crypto.randomUUID(),
                  kind: "text",
                  content: "",
                  x: 20,
                  y: 20,
                  width: 200,
                  height: 200,
                },
              ],
            },
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

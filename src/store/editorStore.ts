import { create } from "zustand";

export type ElementKind = "text" | "image" | "audio" | "video";
export const DefaultFontSize = 40;

export interface SlideElement {
  id: string;
  kind: ElementKind;
  content: string;
  fontSize?: number;
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

export interface Board {
  id: string;
  name: string;
  rows: number;
  columns: number;
  categories: string[];
  cells: JeopardyCell[];
  usedCells: { [key: string]: boolean };
  createdAt: number;
  updatedAt: number;
}

const Default_Board = createEmptyBoard("Untitled Board");

interface BoardState {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;

  boards: Board[];
  activeBoardId: string | null;
  activeBoard: Board | null;

  createBoard: (name?: string) => void;
  deleteBoard: (id: string) => void;
  setActiveBoard: (id: string) => void;
  updateActiveBoard: (board: Board) => void;

  selectedCell: JeopardyCell | null;
  selectCell: (cell: JeopardyCell | null) => void;
  updateCell: (cell: JeopardyCell) => void;
  markCellUsed: (cell: JeopardyCell) => void;

  rows: number;
  columns: number;
  addRow: () => void;
  addColumn: () => void;
  removeRow: () => void;
  removeColumn: () => void;

  // categories: string[];
  // setCategories: (cats: string[]) => void;
  setCategoryAt: (index: number, value: string) => void;
}

export function createEmptyBoard(name = ""): Board {
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
                width: 500,
                height: 300,
                fontSize: DefaultFontSize,
              },
            ],
          },
        ],
      });
    }
  }

  return {
    id: crypto.randomUUID(),
    name,
    rows,
    columns,
    categories: Array(columns).fill("Category"),
    cells,
    usedCells: {},
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const useBoardStore = create<BoardState>((set, get) => {
  const savedBoards =
    typeof window !== "undefined"
      ? localStorage.getItem("jeopardyBoards")
      
      : null;
  const boards: Board[] = savedBoards
    ? JSON.parse(savedBoards)
    : [createEmptyBoard()];

  return {
    editMode: false,
    setEditMode: (mode: boolean) => set({ editMode: mode }),

    boards,
    activeBoardId: boards[0].id,
    activeBoard: boards[0],
    // get activeBoard() {
    //   const { boards, activeBoardId } = get();
    //   return boards.find((b) => b.id === activeBoardId) || null;
    // },

    setCategoryAt: (index: number, value: string) => {
      const { activeBoard } = get();
      if (!activeBoard) return;

      const categories = [...activeBoard.categories];
      categories[index] = value;

      get().updateActiveBoard({
        ...activeBoard,
        categories,
        updatedAt: Date.now(),
      });
    },

    createBoard: (name) => {
      const { activeBoard, boards } = get();
      if (!activeBoard) return;

      const newBoard: Board = {
        ...Default_Board,
        id: crypto.randomUUID(),
        name: name || "Untitled Board",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        cells: activeBoard.cells.map((cell) => ({
          ...cell,
          slides: cell.slides.map((slide) => ({
            elements: slide.elements.map((el) => ({ ...el })),
          })),
        })),
        usedCells: { ...activeBoard.usedCells },
      };

      const updatedBoards = [...boards, newBoard];
      localStorage.setItem("jeopardyBoards", JSON.stringify(updatedBoards));

      set({
        boards: updatedBoards,
      });
    },

    // setActiveBoard: (id) => set({ activeBoardId: id }),

    // updateActiveBoard: (updatedBoard) => {
    //   set((state) => {
    //     const updatedBoards = state.boards.map((b) =>
    //       b.id === updatedBoard.id ? updatedBoard : b,
    //     );
    //     localStorage.setItem("jeopardyBoards", JSON.stringify(updatedBoards));
    //     return {
    //       boards: updatedBoards,
    //       activeBoardId: updatedBoard.id,
    //     };
    //   });
    // },

    setActiveBoard: (id) =>
      set((state) => ({
        activeBoardId: id,
        activeBoard: state.boards.find((b) => b.id === id) || null,
      })),

    updateActiveBoard: (updatedBoard) => {
      set((state) => {
        const updatedBoards = state.boards.map((b) =>
          b.id === updatedBoard.id ? updatedBoard : b,
        );

        localStorage.setItem("jeopardyBoards", JSON.stringify(updatedBoards));

        return {
          boards: updatedBoards,
          activeBoardId: updatedBoard.id,
          activeBoard: updatedBoard,
        };
      });
    },

    deleteBoard: (id) =>
      set((state) => {
        const remainingBoards = state.boards.filter((b) => b.id !== id);
        let newActiveBoard = null;
        let newActiveBoardId = null;
        if (remainingBoards.length > 0) {
          newActiveBoard = remainingBoards[0];
          newActiveBoardId = newActiveBoard.id;
        } else {
          const empty = createEmptyBoard();
          remainingBoards.push(empty);
          newActiveBoard = empty;
          newActiveBoardId = empty.id;
        }
        localStorage.setItem("jeopardyBoards", JSON.stringify(remainingBoards));
        return {
          boards: remainingBoards,
          activeBoardId: newActiveBoardId,
          activeBoard: newActiveBoard,
        };
      }),

    selectedCell: null,
    selectCell: (cell) => set({ selectedCell: cell }),

    updateCell: (updated) => {
      const { activeBoard } = get();
      if (!activeBoard) return;
      const newCells = activeBoard.cells.map((c) =>
        c.row === updated.row && c.col === updated.col ? updated : c,
      );
      const updatedBoard = {
        ...activeBoard,
        cells: newCells,
        updatedAt: Date.now(),
      };
      get().updateActiveBoard(updatedBoard);
    },

    markCellUsed: (cell) => {
      const { activeBoard } = get();
      if (!activeBoard) return;
      const key = `${cell.row}-${cell.col}`;
      const updatedBoard = {
        ...activeBoard,
        usedCells: { ...activeBoard.usedCells, [key]: true },
        updatedAt: Date.now(),
      };
      get().updateActiveBoard(updatedBoard);
    },

    rows: boards[0].rows,
    columns: boards[0].columns,
    addRow: () => {
      const { activeBoard } = get();
      if (!activeBoard) return;
      const newRow = activeBoard.rows;
      const newCells = [...activeBoard.cells];

      for (let c = 0; c < activeBoard.columns; c++) {
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
                  fontSize: DefaultFontSize,
                },
              ],
            },
          ],
        });
      }

      get().updateActiveBoard({
        ...activeBoard,
        cells: newCells,
        rows: newRow + 1,
        updatedAt: Date.now(),
      });
    },

    addColumn: () => {
      const { activeBoard } = get();
      if (!activeBoard) return;
      const newCol = activeBoard.columns;
      const newCells = [...activeBoard.cells];

      for (let r = 0; r < activeBoard.rows; r++) {
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
                  fontSize: DefaultFontSize,
                },
              ],
            },
          ],
        });
      }

      get().updateActiveBoard({
        ...activeBoard,
        cells: newCells,
        columns: newCol + 1,
        categories: [...activeBoard.categories, ""],
        updatedAt: Date.now(),
      });
    },

    removeRow: () => {
      const { activeBoard } = get();
      if (!activeBoard || activeBoard.rows <= 1) return;
      const updatedCells = activeBoard.cells.filter(
        (c) => c.row < activeBoard.rows - 1,
      );
      get().updateActiveBoard({
        ...activeBoard,
        cells: updatedCells,
        rows: activeBoard.rows - 1,
        updatedAt: Date.now(),
      });
    },

    removeColumn: () => {
      const { activeBoard } = get();
      if (!activeBoard || activeBoard.columns <= 1) return;
      const updatedCells = activeBoard.cells.filter(
        (c) => c.col < activeBoard.columns - 1,
      );
      get().updateActiveBoard({
        ...activeBoard,
        cells: updatedCells,
        columns: activeBoard.columns - 1,
        categories: activeBoard.categories.slice(0, -1),
        updatedAt: Date.now(),
      });
    },
  };
});

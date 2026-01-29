"use client";
import React, { useState } from "react";
import { useBoardStore } from "../store/editorStore";

const Interface: React.FC = () => {
  const {
    boards,
    activeBoard,
    activeBoardId,
    setActiveBoard,
    updateActiveBoard,
    createBoard,
    deleteBoard,
    editMode,
    setEditMode,
    resetPlayedCells,
  } = useBoardStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");

  if (!activeBoard) return null;
  return (
    <>
      {/* Ui for the buttons (stackin on the right side)*/}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-4 py-2 rounded shadow-lg ${
            editMode
              ? "bg-green-500 hover:bg-green-600"
              : "bg-gray-500 hover:bg-gray-600"
          } text-white`}
        >
          {editMode ? "Save" : "Edit"}
        </button>

        <button
          onClick={() => {
            if (!confirm("Reset all cells to unplayed?")) return;
            resetPlayedCells();
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded shadow-lg hover:bg-yellow-600"
        >
          Reset Play Area
        </button>

        <button
          onClick={() => setProfileOpen(!profileOpen)}
          className="px-4 py-2 bg-purple-500 text-white rounded shadow-lg hover:bg-purple-600"
        >
          Profile
        </button>

        <button
          onClick={() => setSaveModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-600"
        >
          My Boards
        </button>
      </div>

      {profileOpen && (
        <div className="fixed right-16 top-1/4 w-64 bg-white border rounded shadow-lg p-4 z-50">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Current Board: {activeBoard?.name || "Untitled Board"}
          </h2>
          <h2 className="font-bold mb-2 text-gray-900">My Boards</h2>
          {boards.length === 0 && (
            <p className="text-gray-900">No boards yet</p>
          )}
          {boards.map((board) => (
            <div
              key={board.id}
              className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${
                board.id === activeBoardId
                  ? "font-bold text-gray-900 bg-gray-100"
                  : "text-gray-900"
              }`}
              onClick={() => {
                setActiveBoard(board.id);
                setProfileOpen(false);
              }}
            >
              {board.name}
            </div>
          ))}
        </div>
      )}

      {saveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90vw] max-w-[600px]">
            <h2 className="text-lg font-bold mb-4 text-gray-900">
              Current Board
            </h2>

            <div className="mb-4">
              <button
                onClick={() => {
                  createBoard(boardName || "Untitled Board");
                  setBoardName("");
                }}
                className="mt-2 w-full bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600"
              >
                Create New Board
              </button>
            </div>

            {boards.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">My Boards</h3>
                <ul className="max-h-64 overflow-y-auto border p-2 rounded">
                  {boards.map((board) => (
                    <li
                      key={board.id}
                      className="flex justify-between items-center mb-1 p-1 border rounded hover:bg-gray-100 cursor-pointer"
                    >
                      <span className="flex-1 text-gray-900">{board.name}</span>

                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!confirm(`Overwrite "${board.name}"?`)) return;
                            updateActiveBoard({
                              ...activeBoard!,
                              id: board.id,
                              updatedAt: Date.now(),
                            });
                          }}
                          className="text-sm bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
                        >
                          Overwrite
                        </button>

                        <button
                          onClick={() => {
                            setActiveBoard(board.id);
                          }}
                          className="px-2 py-1 bg-green-500 text-white rounded"
                        >
                          Load
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newName = prompt(
                              "Enter new board name",
                              board.name,
                            );
                            if (!newName) return;
                            updateActiveBoard({
                              ...board,
                              name: newName,
                              updatedAt: Date.now(),
                            });
                          }}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Rename
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              !confirm(
                                `Delete "${board.name}"? This cannot be undone.`,
                              )
                            )
                              return;
                            deleteBoard(board.id);
                          }}
                          className="text-sm bg-gray-500 text-white px-2 py-0.5 rounded hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setSaveModalOpen(false)}
                className="px-3 py-1 border rounded hover:bg-gray-200 text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Interface;

"use client";
import React, { useState, useEffect } from "react";
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
  } = useBoardStore();

  const [profileOpen, setProfileOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [boardName, setBoardName] = useState("");

  {
    editMode && (
      <button
        onClick={() => {
          setBoardName(activeBoard?.name || "Untitled Board");
          setSaveModalOpen(true);
        }}
        className="fixed right-4 top-24 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 z-50"
      >
        Save Board
      </button>
    );
  }

  if (!activeBoard) return null;
  return (
    <>
      {/* Profile tab */}
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-purple-500 text-white rounded shadow-lg z-50"
      >
        Profile
      </button>

      {profileOpen && (
        <div className="fixed right-16 top-1/4 w-64 bg-white border rounded shadow-lg p-4 z-50">
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

      {/* Save Board Button */}
      {editMode && (
        <button
          onClick={() => setSaveModalOpen(true)}
          className="fixed right-4 top-24 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 z-50"
        >
          Save Board
        </button>
      )}

      {/* Save modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-[90vw] max-w-[600px]">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Save Board</h2>

            {/* Rename n save as new */}
            <div className="mb-4">
              <input
                type="text"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
                placeholder="New board name"
                className="border w-full p-2 rounded text-gray-900"
              />

              <button
                onClick={() => {
                  createBoard(boardName || "Untitled Board");
                  setSaveModalOpen(false);
                }}
                className="mt-2 w-full bg-green-500 text-white rounded px-3 py-1 hover:bg-green-600"
              >
                Save as New
              </button>
            </div>

            {/* Existing Boards */}
            {boards.length > 1 && (
              <div>
                <h3 className="font-semibold mb-2 text-gray-900">
                  My Boards
                </h3>
                <ul className="max-h-64 overflow-y-auto border p-2 rounded">
                  {boards
                    .filter((b) => b.id !== activeBoard.id)
                    .map((board) => (
                      <li
                        key={board.id}
                        className="flex justify-between items-center mb-1 p-1 border rounded hover:bg-gray-100 cursor-pointer"
                      >
                        <span
                          onClick={() => setActiveBoard(board.id)}
                          className="flex-1 text-gray-900"
                        >
                          {board.name}
                        </span>

                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!confirm(`Overwrite "${board.name}"?`))
                                return;
                              updateActiveBoard({
                                ...activeBoard,
                                id: board.id,
                                updatedAt: Date.now(),
                              });
                            }}
                            className="text-sm bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
                          >
                            Overwrite
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

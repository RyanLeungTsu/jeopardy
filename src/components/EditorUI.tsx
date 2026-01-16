"use client";
import React, { useState } from "react";
import { JeopardyCell, useBoardStore, Slide } from "../store/editorStore";

interface EditorUIProps {
  cell: JeopardyCell;
  close: () => void;
}

const EditorUI: React.FC<EditorUIProps> = ({ cell, close }) => {
  const updateCell = useBoardStore((state) => state.updateCell);
  const [slides, setSlides] = useState<Slide[]>(cell.slides);

  const updateSlideContent = (index: number, content: string) => {
    const newSlides = [...slides];
    newSlides[index].content = content;
    setSlides(newSlides);
  };

  const addSlide = () => setSlides([...slides, { type: "text", content: "" }]);
  const removeSlide = (index: number) =>
    setSlides(slides.filter((_, i) => i !== index));

  const save = () => {
    updateCell({ ...cell, slides });
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="font-bold mb-2 text-black">
          Edit Cell ({cell.row + 1},{cell.col + 1})
        </h2>

        {slides.map((slide, index) => (
          <div key={index} className="mb-4 border p-2 rounded">
            <div className="flex justify-between items-center mb-1">
              <span className="text-black font-medium">Slide {index + 1}</span>
              {slides.length > 1 && (
                <button
                  onClick={() => removeSlide(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <textarea
              value={slide.content}
              onChange={(e) => updateSlideContent(index, e.target.value)}
              className="border w-full p-1 text-black"
            />
          </div>
        ))}

        <button
          onClick={addSlide}
          className="mb-4 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Add Slide
        </button>

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="px-3 py-1 border rounded hover:bg-gray-200 text-black"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditorUI;

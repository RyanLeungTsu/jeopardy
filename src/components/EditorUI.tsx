"use client";
import React, { useState } from "react";
import { JeopardyCell, useBoardStore, Slide, DefaultFontSize } from "../store/editorStore";
import MediaUploader from "./MediaUploader";
import SlideCanvas from "./SlideCanvas";

interface EditorUIProps {
  cell: JeopardyCell;
  close: () => void;
}

const EditorUI: React.FC<EditorUIProps> = ({ cell, close }) => {
  const updateCell = useBoardStore((state) => state.updateCell);

const [slides, setSlides] = useState<Slide[]>(
  cell.slides.map((slide) => ({
    ...slide,
    elements: slide.elements.map((el) => ({
      ...el,
      fontSize: el.fontSize ?? DefaultFontSize, 
      content: el.content ?? "",    
    })),
  })),
);

  const [mediaTarget, setMediaTarget] = useState<number | null>(null);

  // const updateSlideContent = (index: number, content: string) => {
  //   const newSlides = [...slides];
  //   newSlides[index].content = content;
  //   setSlides(newSlides);
  // };

  // const addSlide = () => setSlides([...slides, { type: "text", content: "" }]);
  const addSlide = () =>
    setSlides([
      ...slides,
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
    ]);

  const removeSlide = (index: number) =>
    setSlides(slides.filter((_, i) => i !== index));

  // const handleMediaAdded = (url: string, type: Slide["type"]) => {
  //   if (mediaTarget === null) return;

  //   const updated = [...slides];
  //   updated[mediaTarget] = {
  //     type,
  //     content: url,
  //   };

  //   setSlides(updated);
  //   setMediaTarget(null);
  // };

  const handleMediaAdded = (url: string, type: "image" | "audio" | "video") => {
    if (mediaTarget === null) return;

    const updated = [...slides];

    updated[mediaTarget].elements.push({
      id: crypto.randomUUID(),
      kind: type,
      content: url,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
    });

    setSlides(updated);
    setMediaTarget(null);
  };

  const RemoveMedia = (slideIndex: number, elementId: string) => {
    const updated = [...slides];

    updated[slideIndex] = {
      ...updated[slideIndex],
      elements: updated[slideIndex].elements.filter(
        (el) => el.id !== elementId,
      ),
    };

    setSlides(updated);
  };

  const save = () => {
  updateCell({
    ...cell,
    slides: slides.map(slide => ({
      ...slide,
      elements: slide.elements.map(el => ({
        ...el,
        fontSize: el.fontSize ?? DefaultFontSize, 
      })),
    })),
  });
  close();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={close}>
      <div className="bg-white p-4 rounded w-[90vw] h-[85vh] max-w-[60vw] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
            <div className="h-[45vh]">
              <SlideCanvas
                slide={slide}
                update={(newSlide) => {
                  const updated = [...slides];
                  updated[index] = newSlide;
                  setSlides(updated);
                }}
                className="w-full aspect-video border bg-gray-100 mx-auto"
                onRemoveMedia={(elementId) => RemoveMedia(index, elementId)}
              />
            </div>
            {/* <textarea
              value={slide.content}
              onChange={(e) => updateSlideContent(index, e.target.value)}
              className="border w-full p-1 text-black"
            /> */}

            <div className="mt-2 flex gap-2 items-center">
              <button
                onClick={() => setMediaTarget(index)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white hover:bg-purple-600"
                title="Add Media"
              >
                +
              </button>
            </div>
          </div>
        ))}

        {mediaTarget !== null && (
          <MediaUploader
            onAdd={(type, content) => handleMediaAdded(content, type)}
          />
        )}

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

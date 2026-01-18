"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Slide, SlideElement } from "../store/editorStore";

interface SlideCanvasProps {
  slide: Slide;
  update: (slide: Slide) => void;
  onRemoveMedia: (elementId: string) => void; 
}

const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  update,
  onRemoveMedia, 
}) => {
  const updateElement = (id: string, changes: Partial<SlideElement>) => {
    update({
      elements: slide.elements.map((el) =>
        el.id === id ? { ...el, ...changes } : el
      ),
    });
  };

  const renderElement = (el: SlideElement) => {
    return (
      <div className="relative group w-full h-full">
        {el.kind === "text" && (
          <textarea
            className="w-full h-full bg-transparent resize-none text-black cursor-text"
            value={el.content}
            onChange={(e) =>
              updateElement(el.id, { content: e.target.value })
            }
          />
        )}

        {el.kind === "image" && (
          <img
            src={el.content}
            className="w-full h-full object-contain"
            draggable={false}
          />
        )}

        {el.kind === "audio" && <audio controls src={el.content} />}

        {el.kind === "video" && (
          <video src={el.content} controls className="w-full h-full" />
        )}

        {el.kind !== "text" && (
          <button
            onClick={() => onRemoveMedia(el.id)} // now TypeScript knows this exists
            className="
              absolute top-1 right-1
              bg-red-500 text-white
              rounded-full w-6 h-6
              flex items-center justify-center
              opacity-0 group-hover:opacity-100
              transition hover:bg-red-600
            "
          >
            ✕
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative border h-64 bg-gray-50 overflow-hidden">
      {slide.elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.width, height: el.height }}
          position={{ x: el.x, y: el.y }}
          bounds="parent"
          enableResizing={{
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }}
          onDragStop={(_, d) =>
            updateElement(el.id, { x: d.x, y: d.y })
          }
          onResizeStop={(_, __, ref, ___, position) =>
            updateElement(el.id, {
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: position.x,
              y: position.y,
            })
          }
        >
          <div className="border bg-white p-1 h-full">{renderElement(el)}</div>
        </Rnd>
      ))}
    </div>
  );
};

export default SlideCanvas;
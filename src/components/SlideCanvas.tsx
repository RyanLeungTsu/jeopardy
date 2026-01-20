"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Slide, SlideElement, DefaultFontSize } from "../store/editorStore";

interface SlideCanvasProps {
  slide: Slide;
  update: (slide: Slide) => void;
  onRemoveMedia: (elementId: string) => void;
  className?: string;
}

const SlideCanvas: React.FC<SlideCanvasProps> = ({
  slide,
  update,
  onRemoveMedia,
}) => {
  const updateElement = (id: string, changes: Partial<SlideElement>) => {
    update({
      elements: slide.elements.map((el) =>
        el.id === id ? { ...el, ...changes } : el,
      ),
    });
  };

  const renderElement = (el: SlideElement) => {
    return (
      <div className="relative group w-full h-full">
        {el.kind === "text" && (
          <div className="relative h-full w-full">
            <div className="absolute top-1 left-1 flex gap-1 z-10">
              <button
                onClick={() =>
                  updateElement(el.id, {
                    fontSize: (el.fontSize || DefaultFontSize) + 4,
                  })
                }
                className="bg-gray-300 p-1 rounded text-xs"
              >
                A+
              </button>
              <button
                onClick={() =>
                  updateElement(el.id, {
                    fontSize: Math.max((el.fontSize || DefaultFontSize) - 4, 8),
                  })
                }
                className="bg-gray-300 p-1 rounded text-xs"
              >
                A-
              </button>
            </div>

            <textarea
              className="w-full h-full bg-transparent resize-none text-black cursor-text p-1"
              value={el.content}
              style={{ fontSize: el.fontSize }}
              onChange={(e) =>
                updateElement(el.id, { content: e.target.value })
              }
            />

            {/* Drag handle for the text area to prevent dragging in content areas */}
            <div
              className="drag-handle absolute top-1 right-1 w-6 h-6 bg-gray-300 text-black flex items-center justify-center rounded cursor-move"
              title="Drag Handler"
            >
              ↕
            </div>
          </div>
        )}

        {el.kind === "image" && (
          <img
            src={el.content}
            className="w-full h-full object-contain drag-handle"
            draggable={false}
          />
        )}

        {el.kind === "audio" && (
          <audio controls src={el.content} className="w-full drag-handle" />
        )}

        {el.kind === "video" && (
          <video
            src={el.content}
            controls
            className="w-full h-full drag-handle"
          />
        )}

        {el.kind !== "text" && (
          <button
            onClick={() => onRemoveMedia(el.id)}
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
    <div className="relative border bg-gray-50 overflow-hidden h-[45vh]">
      {slide.elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.width ?? "50%", height: el.height }}
          position={{ x: el.x, y: el.y }}
          bounds="parent"
          //   makes sure the icon added above on the class of drag-handle is the only way to move textarea box
          dragHandleClassName="drag-handle"
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
          onDragStop={(_, d) => updateElement(el.id, { x: d.x, y: d.y })}
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

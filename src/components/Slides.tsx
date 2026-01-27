"use client";
import React, { useState, useRef, useEffect } from "react";
import { Rnd } from "react-rnd";
import {
  JeopardyCell,
  Slide,
  SlideElement,
  DefaultFontSize,
} from "../store/editorStore";
import MediaUploader from "../components/MediaUploader";
import MediaDisplay from "../components/MediaDisplay";
import { saveMedia } from "../lib/mediaStorage";
import { useBoardStore } from "../store/editorStore";

interface SlidesProps {
  cell: JeopardyCell;
  close: () => void;
}

const Slides: React.FC<SlidesProps> = ({ cell, close }) => {
  const updateCell = useBoardStore((s) => s.updateCell);

  const [slides, setSlides] = useState<Slide[]>(cell.slides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<number | null>(null);

  const currentSlide = slides[currentSlideIndex];

  const mediaInputRef = useRef<HTMLInputElement>(null);

  const updateElement = (id: string, changes: Partial<SlideElement>) => {
    const updated = slides.map((slide, idx) =>
      idx === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.map((el) =>
              el.id === id ? { ...el, ...changes } : el,
            ),
          }
        : slide,
    );
    setSlides(updated);
  };
  // const for adding media
  const handleMediaAdded = (
    type: "image" | "audio" | "video",
    mediaId: string,
  ) => {
    if (mediaTarget === null) return;
    const updated = [...slides];
    updated[mediaTarget].elements.push({
      id: crypto.randomUUID(),
      kind: type,
      content: mediaId,
      x: 50,
      y: 50,
      width: 200,
      height: 200,
    });
    setSlides(updated);
    setMediaTarget(null);
  };
  // Const for deleting slides
  const deleteCurrentSlide = () => {
    if (slides.length <= 1) return;

    const updatedSlides = slides.filter((_, i) => i !== currentSlideIndex);

    let newIndex = currentSlideIndex;
    if (currentSlideIndex >= updatedSlides.length) {
      newIndex = updatedSlides.length - 1;
    }

    setSlides(updatedSlides);
    setCurrentSlideIndex(newIndex);
  };
  // const for removing elements
  const removeElement = (elementId: string) => {
    const updated = slides.map((slide, idx) =>
      idx === currentSlideIndex
        ? {
            ...slide,
            elements: slide.elements.filter((el) => el.id !== elementId),
          }
        : slide,
    );
    setSlides(updated);
  };

  // const nextSlide = () => {
  //   if (currentSlideIndex < slides.length - 1)
  //     setCurrentSlideIndex(currentSlideIndex + 1);
  //   else close();
  // };

  const saveChanges = () => {
    updateCell({ ...cell, slides });
  };

  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      if (!editing) return;

      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (item.type.startsWith("image/")) {
          e.preventDefault();

          const file = item.getAsFile();
          if (!file) continue;

          try {
            const mediaId = crypto.randomUUID();
            await saveMedia(mediaId, file);

            const updated = [...slides];
            updated[currentSlideIndex].elements.push({
              id: crypto.randomUUID(),
              kind: "image",
              content: `idb://${mediaId}`,
              x: 50,
              y: 50,
              width: 300,
              height: 300,
            });
            setSlides(updated);

            console.log(`Image pasted successfully: ${mediaId}`);
          } catch (error) {
            console.error("Error pasting image:", error);
            alert("Failed to paste image. Please try again.");
          }

          break;
        }
      }
    };

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [editing, slides, currentSlideIndex]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-[90vw] h-[85vh] max-w-[1400px] overflow-y-auto relative">
        <div className="relative w-full h-[70vh] border mb-4">
          {currentSlide.elements.map((el) =>
            editing ? (
              <Rnd
                key={el.id}
                size={{ width: el.width ?? 200, height: el.height ?? 100 }}
                position={{ x: el.x, y: el.y }}
                bounds="parent"
                dragHandleClassName="drag-handle"
                onDragStop={(_, d) => updateElement(el.id, { x: d.x, y: d.y })}
                onResizeStop={(_, __, ref, ___, position) =>
                  updateElement(el.id, {
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                    x: position.x,
                    y: position.y,
                  })
                }
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
                style={{ boxSizing: "border-box" }}
              >
                <div
                  className="border bg-white h-full relative group"
                  style={{ boxSizing: "border-box" }}
                >
                  {el.kind === "text" && (
                    <>
                      <div
                        className="drag-handle absolute bottom-1 right-1 w-6 h-6 bg-gray-300 flex items-center justify-center cursor-move z-20"
                        title="Drag"
                      >
                        ↕
                      </div>

                      <textarea
                        className="w-full h-full resize-none bg-transparent text-black p-1"
                        value={el.content}
                        style={{
                          fontSize: el.fontSize ?? DefaultFontSize,
                          textAlign: el.textAlign ?? "left",
                          boxSizing: "border-box",
                        }}
                        onMouseDown={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          updateElement(el.id, { content: e.target.value })
                        }
                      />

                      {/* Button for increasing and decresing font size */}
                      <div className="absolute bottom-1 left-1 flex gap-1">
                        <button
                          onClick={() =>
                            updateElement(el.id, {
                              fontSize: (el.fontSize ?? DefaultFontSize) + 2,
                            })
                          }
                          className="bg-gray-300 p-1 rounded text-xs"
                          title="Increase Font"
                        >
                          A+
                        </button>
                        <button
                          onClick={() =>
                            updateElement(el.id, {
                              fontSize: Math.max(
                                (el.fontSize ?? DefaultFontSize) - 2,
                                8,
                              ),
                            })
                          }
                          className="bg-gray-300 p-1 rounded text-xs"
                          title="Decrease Font"
                        >
                          A-
                        </button>
                        {/* Text alignment controls */}
                        <button
                          onClick={() =>
                            updateElement(el.id, { textAlign: "left" })
                          }
                          className="bg-gray-300 p-1 rounded text-xs"
                          title="Align Left"
                        >
                          ⬅
                        </button>
                        <button
                          onClick={() =>
                            updateElement(el.id, { textAlign: "center" })
                          }
                          className="bg-gray-300 p-1 rounded text-xs"
                          title="Align Center"
                        >
                          ⬌
                        </button>
                        <button
                          onClick={() =>
                            updateElement(el.id, { textAlign: "right" })
                          }
                          className="bg-gray-300 p-1 rounded text-xs"
                          title="Align Right"
                        >
                          ➡
                        </button>
                        <button
                          onClick={() => removeElement(el.id)}
                          className="bg-red-500 text-white p-1 rounded text-xs hover:bg-red-600"
                          title="Delete Text Box"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )}

                  {el.kind !== "text" && (
                    <div className="drag-handle relative w-full h-full">
                      <MediaDisplay
                        element={el}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          pointerEvents: "none",
                          maxWidth: "none",
                          maxHeight: "none",
                          display: "block",
                        }}
                      />
                      {/* <MediaDisplay
                        element={el}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "fill",
                          pointerEvents: "none",
                          display: "block",
                        }}
                      /> */}
                      <button
                        onClick={() => removeElement(el.id)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </Rnd>
            ) : (
              <div
                key={el.id}
                style={{
                  position: "absolute",
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                }}
              >
                {el.kind === "text" && (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      fontSize: el.fontSize ?? DefaultFontSize,
                      color: "black",
                      textAlign: el.textAlign ?? "left",
                      whiteSpace: "pre-wrap",
                      padding: 4,
                      boxSizing: "border-box",
                    }}
                  >
                    {el.content}
                  </div>
                )}
                {el.kind === "image" && (
                  <MediaDisplay
                    element={el}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      maxWidth: "none",
                      maxHeight: "none",
                      display: "block",
                    }}
                  />
                )}
                {el.kind === "audio" && <MediaDisplay element={el} />}
                {el.kind === "video" && <MediaDisplay element={el} />}
              </div>
            ),
          )}
        </div>

        {/*Exit button for slide ui */}
        <button
          onClick={() => {
            saveChanges();
            close();
          }}
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 z-50"
          title="Close"
        >
          ✕
        </button>

        {/* Controls */}
        {/* Button for adding a slide */}
        {editing && (
          <button
            onClick={() => {
              const newSlide: Slide = {
                elements: [
                  {
                    id: crypto.randomUUID(),
                    kind: "text",
                    content: "",
                    x: 20,
                    y: 20,
                    width: 200,
                    height: 100,
                    fontSize: DefaultFontSize,
                  },
                ],
              };

              const updatedSlides = [...slides];
              updatedSlides.splice(currentSlideIndex + 1, 0, newSlide);

              setSlides(updatedSlides);
              setCurrentSlideIndex(currentSlideIndex + 1);
            }}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 mb-2"
          >
            + Add Slide
          </button>
        )}
        {/* Button for deleting a slide */}
        {editing && slides.length > 1 && (
          <button
            onClick={deleteCurrentSlide}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete Slide
          </button>
        )}
        {/* Toggle for editing and non-editing for slides */}
        <div className="flex justify-between mb-2">
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-2 rounded ${editing ? "bg-green-500" : "bg-blue-500"} text-white`}
          >
            {editing ? "Editing" : "Playing"}
          </button>
          {/* Add media button for slides */}
          {editing && (
            <button
              onClick={() => {
                setMediaTarget(currentSlideIndex);
                setTimeout(() => mediaInputRef.current?.click(), 0);
              }}
              className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Add Media
            </button>
          )}
        </div>
        {/* Adding more text boxes than default */}
        <button
          onClick={() => {
            const updated = [...slides];
            updated[currentSlideIndex].elements.push({
              id: crypto.randomUUID(),
              kind: "text",
              content: "",
              x: 100,
              y: 100,
              width: 200,
              height: 100,
              fontSize: DefaultFontSize,
            });
            setSlides(updated);
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Text Box +
        </button>

        <div className="flex justify-between">
          <button
            onClick={() =>
              setCurrentSlideIndex(Math.max(currentSlideIndex - 1, 0))
            }
            className="px-3 py-1 border rounded bg-blue-500 hover:bg-blue-600"
          >
            ◀ Prev
          </button>
          <button
            onClick={() => {
              if (currentSlideIndex < slides.length - 1) {
                setCurrentSlideIndex(currentSlideIndex + 1);
              }
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Next ▶
          </button>
        </div>

        <MediaUploader
          ref={mediaInputRef}
          onAdd={(type, mediaId) => handleMediaAdded(type, mediaId)}
        />
        {/* <button
          onClick={close}
          className="absolute top-4 right-4 text-white hover:text-gray-900"
        >
          X
        </button> */}
      </div>
    </div>
  );
};

export default Slides;

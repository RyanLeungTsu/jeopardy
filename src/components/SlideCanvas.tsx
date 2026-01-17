"use client";
import React from "react";
import { Rnd } from "react-rnd";
import { Slide, SlideElement } from "../store/editorStore";

interface Props {
  slide: Slide;
  update: (slide: Slide) => void;
}

const SlideCanvas: React.FC<Props> = ({ slide, update }) => {
  const updateElement = (id: string, changes: Partial<SlideElement>) => {
    update({
      elements: slide.elements.map((el) =>
        el.id === id ? { ...el, ...changes } : el,
      ),
    });
  };

  const renderElement = (el: SlideElement) => {
    switch (el.kind) {
      case "text":
        return (
          <textarea
            className="w-full h-full bg-transparent resize-none text-black"
            value={el.content}
            onChange={(e) => updateElement(el.id, { content: e.target.value })}
          />
        );

      case "image":
        return (
          <img
            src={el.content}
            className="w-full h-full object-contain"
            draggable={false}
          />
        );

      case "audio":
        return <audio controls src={el.content} />;

      case "video":
        return <video src={el.content} controls className="w-full h-full" />;
    }
  };

  return (
    <div className="relative border h-64 bg-gray-50 overflow-hidden">
      {slide.elements.map((el) => (
        <Rnd
          key={el.id}
          size={{ width: el.width, height: "auto" }}
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

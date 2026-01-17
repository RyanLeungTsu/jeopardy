"use client";
import React, { useState } from "react";
import { JeopardyCell, Slide } from "../store/editorStore";

interface QuestionSlideProps {
  cell: JeopardyCell;
  close: () => void;
}

const QuestionSlide: React.FC<QuestionSlideProps> = ({ cell, close }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = () => {
    if (currentSlideIndex < cell.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      close();
    }
  };

  const slide: Slide = cell.slides[currentSlideIndex];

  const renderSlideContent = (slide: Slide) => {
    return (
      <div className="relative w-full h-[60vh]">
        {slide.elements.map((el) => {
          const style: React.CSSProperties = {
            position: "absolute",
            left: el.x,
            top: el.y,
            width: el.width,
          };

          switch (el.kind) {
            case "text":
              return (
                <div
                  key={el.id}
                  style={style}
                  className="text-black whitespace-pre-wrap"
                >
                  {el.content}
                </div>
              );

            case "image":
              return (
                <img
                  key={el.id}
                  src={el.content}
                  style={style}
                  className="max-w-full"
                />
              );

            case "audio":
              return (
                <audio key={el.id} controls src={el.content} style={style} />
              );

            case "video":
              return (
                <video key={el.id} controls src={el.content} style={style} />
              );
          }
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded w-[90vw] h-[85vh] max-w-[1400px] overflow-y-auto">
        {renderSlideContent(slide)}

        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          &rarr;
        </button>

        <button
          onClick={close}
          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default QuestionSlide;

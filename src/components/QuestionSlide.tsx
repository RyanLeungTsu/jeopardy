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
    switch (slide.type) {
      case "text":
        return <p className="text-black">{slide.content}</p>;
      case "image":
        return <img src={slide.content} alt="slide" className="max-h-[60vh] w-auto mx-auto" />;
      case "audio":
        return <audio controls src={slide.content} className="w-full mt-2" />;
      case "video":
        return <video controls src={slide.content} className="max-h-[60vh] w-full mx-auto" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[80vw] max-w-lg text-center relative max-h-[80vh] overflow-y-auto">
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

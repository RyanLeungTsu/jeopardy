import React, { forwardRef } from "react";

interface Props {
  onAdd: (type: "image" | "audio" | "video", content: string) => void;
}

const MAX_SIZE = {
  // restrainst for now: img 30mb, audio n vid 100mb
  image: 30 * 1024 * 1024,
  audio: 100 * 1024 * 1024,
  video: 100 * 1024 * 1024,
};

const ALLOWED = {
  image: ["image/png", "image/jpeg", "image/gif", "image/webp"],
  audio: ["audio/mpeg", "audio/wav", "audio/ogg"],
  video: ["video/mp4", "video/webm"],
};

const MediaUploader = forwardRef<HTMLInputElement, Props>(({ onAdd }, ref) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: "image" | "audio" | "video" | null = null;

    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("audio/")) type = "audio";
    else if (file.type.startsWith("video/")) type = "video";

    if (!type) {
      alert("Unsupported file type");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => onAdd(type!, reader.result as string);
    reader.readAsDataURL(file);
  };

  // React.useEffect(() => {
  //   document.getElementById("media-input")?.click();
  // }, []);
  return (
    <input ref={ref} type="file" onChange={handleFile} className="hidden" />
  );
});

MediaUploader.displayName = "MediaUploader";

export default MediaUploader;

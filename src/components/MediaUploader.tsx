import React from "react";

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

const MediaUploader: React.FC<Props> = ({ onAdd }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let type: "image" | "audio" | "video" | null = null;

    if (ALLOWED.image.includes(file.type)) type = "image";
    else if (ALLOWED.audio.includes(file.type)) type = "audio";
    else if (ALLOWED.video.includes(file.type)) type = "video";

    if (!type) {
      alert("Unsupported file type");
      return;
    }

    if (file.size > MAX_SIZE[type]) {
      alert(
        `File too large. Max for ${type}: ${MAX_SIZE[type] / 1024 / 1024}MB`,
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onAdd(type!, reader.result as string);
    };

    reader.readAsDataURL(file);
  };
  React.useEffect(() => {
    document.getElementById("media-input")?.click();
  }, []);
  return (
    <input
      type="file"
      onChange={handleFile}
      className="hidden"
      id="media-input"
    />
  );
};

export default MediaUploader;

import React, { forwardRef } from "react";
import { saveMedia } from "../lib/mediaStorage";

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
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (file.size > MAX_SIZE[type]) {
      alert(`File too large. Maximum size for ${type}: ${MAX_SIZE[type] / 1024 / 1024}MB`);
      return;
    }

    if (!ALLOWED[type].includes(file.type)) {
      alert(`File type not allowed: ${file.type}`);
      return;
    }

    try {
      const mediaId = crypto.randomUUID();
      
      // this is for saving file as a blob to IndexDB
      await saveMedia(mediaId, file);
      
      // Return the media ID with a prefix to indicate it's stored in IndexedDB, this is for telling it from old base64 data
      onAdd(type, `idb://${mediaId}`);
      
      console.log(`Media uploaded successfully: ${mediaId}`);
    } catch (error) {
      console.error("Error saving media:", error);
      alert("Failed to save media. Please try again.");
    }

    //This  Resets the input allowing same file to be uploaded
    e.target.value = '';
  };

  return (
    <input 
      ref={ref} 
      type="file" 
      accept="image/*,audio/*,video/*"
      onChange={handleFile} 
      className="hidden" 
    />
  );
});

MediaUploader.displayName = "MediaUploader";

export default MediaUploader;

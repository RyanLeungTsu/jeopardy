import JeopardyGrid from "../components/JeopardyGrid";
import EditToggle from "../components/EditToggle";
// NOTE: try and cahgne structure to support multiple media files and make the edit screen for question more like a canvas instead of current text based limited cells. 
export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <JeopardyGrid />
      <EditToggle />
    </main>
  );
}
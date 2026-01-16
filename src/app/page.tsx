import JeopardyGrid from "../components/JeopardyGrid";
import EditToggle from "../components/EditToggle";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <JeopardyGrid />
      <EditToggle />
    </main>
  );
}
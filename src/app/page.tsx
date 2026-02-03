import JeopardyGrid from "../components/JeopardyGrid";
import Interface from "../components/Interface";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 from-0% via-blue-200 via-70% via-orange-300 via-7% to-red-400 to-99%">
      <JeopardyGrid />
      <Interface />
    </main>
  );
}

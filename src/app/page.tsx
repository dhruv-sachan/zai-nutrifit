import { MeshBackground } from "@/components/nutrifit/MeshBackground";
import { AppShell } from "@/components/nutrifit/AppShell";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <MeshBackground />
      <AppShell />
    </div>
  );
}

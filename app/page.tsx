import { SearchBar } from "./SearchBar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-gray-900 text-white">
      <h1 className="text-4xl font-bold">AI Media Platform 🎬</h1>
      <div className="mt-4"><SearchBar /></div>
    </main>
  )
}

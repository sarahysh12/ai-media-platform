import { SearchBar } from "./components/SearchBar";

export default function Home() {

  return (
    <main className="flex flex-col min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold p-3">AI Media Platform 🎬</h1>
      <div className="flex flex-col gap-4">
        <SearchBar />
        </div>
    </main>
  )
}

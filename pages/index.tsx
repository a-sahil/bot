import PriceDisplay from "@/components/PriceDisplay";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-black">Ethereum Price Bot</h1>
      <PriceDisplay />
    </main>
  );
}

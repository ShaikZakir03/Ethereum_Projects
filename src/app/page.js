import Faucet from './components/Faucet';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Ethereum Test Faucet
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Get test ETH for development purposes
        </p>
        <Faucet />
      </div>
    </main>
  );
}

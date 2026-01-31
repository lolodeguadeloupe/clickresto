import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Clickresto Back-Office
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Plateforme de gestion pour Clickresto
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}

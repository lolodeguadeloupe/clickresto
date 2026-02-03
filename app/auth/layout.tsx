import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh bg-[#F1FAEE]">
      {/* Header with logo */}
      <header className="p-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#E63946] font-serif text-xl"
        >
          <span className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center text-white text-sm font-bold">
            C
          </span>
          Clickresto
        </Link>
      </header>

      {/* Main content */}
      <main>{children}</main>
    </div>
  );
}

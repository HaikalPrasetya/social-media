import { Metadata } from "next";
import TrendsSidebar from "../TrendsSidebar";
import SearchResults from "./SearchResults";

interface PageProps {
  searchParams: Promise<{ q: string }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return {
    title: `Hasil pencarian untuk "${q}"`,
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-secondary p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Hasil pencarian untuk &quot;{q} &quot;
          </h1>
        </div>
        <SearchResults query={q} />
      </div>
      <TrendsSidebar />
    </main>
  );
}

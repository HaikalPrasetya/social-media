"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

function SearchField() {
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const value = (form.q as HTMLInputElement).value.trim();

    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative" action="/search">
      <Input type="text" className="" name="q" />
      <SearchIcon className="absolute right-0 top-1/2 ml-2 size-4 -translate-x-1/2 -translate-y-1/2" />
    </form>
  );
}

export default SearchField;

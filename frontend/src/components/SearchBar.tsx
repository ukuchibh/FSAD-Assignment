import { useState, FormEvent } from "react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      className="flex flex-row gap-2 justify-center items-center"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="p-2 bg-violet-100 rounded-lg w-lg"
        name="searchTerm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search"
      />
      <button className="p-1 bg-violet-400 rounded-lg border-2 border-violet-400 cursor-pointer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="text-violet-700 size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </button>
    </form>
  );
}

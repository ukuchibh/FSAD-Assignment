import Link from "next/link";

export default function Menu() {
  return (
    <aside className="flex relative left-0 flex-col bg-violet-300 md:p-4 w-[250px]">
      <h1 className="font-bold">Menu</h1>
      <section className="flex flex-col gap-3 mt-2">
        <Link
          className="p-2 font-bold bg-violet-200 rounded-lg transition-all cursor-pointer hover:text-white hover:bg-violet-400"
          href="/"
        >
          Dashboard
        </Link>
        <Link
          className="p-2 font-bold bg-violet-200 rounded-lg transition-all cursor-pointer hover:text-white hover:bg-violet-400"
          href="/students"
        >
          Manage Students
        </Link>
        <Link
          className="p-2 font-bold bg-violet-200 rounded-lg transition-all cursor-pointer hover:text-white hover:bg-violet-400"
          href="/drives"
        >
          Manage Drives
        </Link>
        <Link
          className="p-2 font-bold bg-violet-200 rounded-lg transition-all cursor-pointer hover:text-white hover:bg-violet-400"
          href="/reports"
        >
          Generate Reports
        </Link>
      </section>
    </aside>
  );
}

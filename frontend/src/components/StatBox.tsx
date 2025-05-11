interface Props {
  description: string;
  value: string | number | undefined | null;
}

export default function StatBox({ description, value }: Props) {
  return (
    <div className="flex flex-col gap-4 justify-start items-center p-2 bg-gray-400 rounded-lg w-[300px] h-[200px]">
      <h1 className="text-sm font-bold">{description}</h1>
      <h1 className="h-full text-8xl text-center">{value}</h1>
    </div>
  );
}

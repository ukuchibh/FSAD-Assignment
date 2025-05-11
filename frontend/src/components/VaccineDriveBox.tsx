import Link from "next/link";

interface Props {
  title: string;
  drives: Drive[] | null;
}

interface Drive {
  notes: string;
  vaccineName: string;
  date: string;
  availableDoses: number;
  applicableClasses: string[];
  venue: string;
  organizer: string;
}

function getDate(input: string) {
  const date = new Date(input);
  return date.toLocaleString();
}

export default function VaccineDriveBox({ title, drives }: Props) {
  return (
    <div className="flex flex-col gap-4 justify-start items-center p-2 h-full bg-gray-400 rounded-lg w-[400px]">
      <h1 className="text-sm font-bold">{title}</h1>
      <section className="flex overflow-auto flex-col gap-2 w-full h-full">
        {drives && drives.length === 0 ? (
          <div className="flex flex-col justify-center items-center p-2 w-full text-left bg-white rounded-lg h-[148px]">
            <h1 className="mb-2 font-bold text-center">No Upcoming Drives</h1>
            <Link
              className="p-2 text-center bg-violet-300 rounded-lg transition-all hover:bg-violet-400"
              href="/drives"
            >
              Schedule one here
            </Link>
          </div>
        ) : (
          drives &&
          drives.map(
            (
              {
                notes,
                vaccineName,
                date,
                availableDoses,
                applicableClasses,
                venue,
                organizer,
              },
              index,
            ) => {
              return (
                <div
                  className="p-2 w-full text-left bg-white rounded-lg"
                  key={index}
                >
                  <h1 className="mb-2 font-bold text-center">{notes}</h1>
                  <p className="text-xl font-bold">{vaccineName}</p>
                  <p className="mb-2 font-bold">{getDate(date)}</p>
                  <p className="mb-2 font-bold">
                    Available Doses:{" "}
                    <span className="font-normal">{availableDoses}</span>
                  </p>
                  <p className="font-bold">Applicable Classes:</p>
                  <section className="flex flex-row gap-2 justify-start items-center my-2 w-full text-center">
                    {applicableClasses.map((text) => {
                      return (
                        <p
                          className="px-2 font-bold bg-gray-400 rounded-lg"
                          key={text}
                        >
                          {text}
                        </p>
                      );
                    })}
                  </section>
                  <p className="font-bold">
                    Location: <span className="font-normal">{venue}</span>
                  </p>
                  <p className="font-bold">
                    Organizer: <span className="font-normal">{organizer}</span>
                  </p>
                </div>
              );
            },
          )
        )}
      </section>
    </div>
  );
}

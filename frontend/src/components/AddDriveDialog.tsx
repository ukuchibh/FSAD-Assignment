import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";

interface VaccineDriveDetails {
  notes: string;
  vaccineName: string;
  date: string;
  availableDoses: number;
  applicableClasses: string[];
  venue: string;
  organizer: string;
}

export default function AddDriveDialog() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [drive, setDrive] = useState<VaccineDriveDetails>({
    notes: "",
    vaccineName: "",
    date: "",
    availableDoses: 0,
    applicableClasses: [],
    venue: "",
    organizer: "",
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken); // Initialize token state
  }, [token]);

  async function handleAddDrive(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/vaccination-drives",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(drive),
        },
      );

      if (response.ok) {
        router.reload();
      } else {
        console.error("Failed to fetch drive data");
      }
    } catch (error) {
      console.error("Error fetching drive data:", error);
    }
    return;
  }

  return (
    <section className="flex flex-row gap-24 justify-center items-center p-8 w-full bg-violet-200 rounded-lg">
      <form className="flex flex-col gap-y-2" onSubmit={handleAddDrive}>
        <label className="text-sm font-bold">Vaccine Name</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="vaccineName"
          name="vaccineName"
          value={drive.vaccineName}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              vaccineName: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Drive Date</label>
        <input
          type="date"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="date"
          name="date"
          value={drive.date}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              date: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Available Doses</label>
        <input
          type="number"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="availableDoses"
          name="availableDoses"
          value={drive.availableDoses}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              availableDoses: parseInt(e.target.value),
            }))
          }
        />
        <label className="text-sm font-bold">Applicable Classes</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="applicableClasses"
          name="applicableClasses"
          value={drive.applicableClasses}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              applicableClasses: e.target.value.split(/,\s*/),
            }))
          }
        />
        <label className="text-sm font-bold">Venue</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="venue"
          name="venue"
          value={drive.venue}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              venue: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Organizer</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="organizer"
          name="organizer"
          value={drive.organizer}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              organizer: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Notes</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="notes"
          name="notes"
          value={drive.notes}
          onChange={(e) =>
            setDrive((prevDrive) => ({
              ...prevDrive,
              notes: e.target.value,
            }))
          }
        />
        <button className="self-center p-2 mt-5 w-40 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400">
          Add Drive
        </button>
      </form>
    </section>
  );
}

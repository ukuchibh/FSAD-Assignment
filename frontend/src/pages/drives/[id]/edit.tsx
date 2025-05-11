import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";

interface ProtectedData {
  message: string;
  userId: string;
  user: string;
}

interface VaccineDriveDetails {
  _id: string;
  notes: string;
  vaccineName: string;
  date: string;
  availableDoses: number;
  applicableClasses: string[];
  venue: string;
  organizer: string;
  __v: number;
}

function convertDate(input: string) {
  const date = new Date(input);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with leading zero if needed
  const day = String(date.getDate()).padStart(2, "0"); // Pad with leading zero if needed
  return `${year}-${month}-${day}`;
}

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_data, setData] = useState<ProtectedData | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [drive, setDrive] = useState<VaccineDriveDetails>({
    _id: router.query.id as string,
    notes: "",
    vaccineName: "",
    date: "",
    availableDoses: 0,
    applicableClasses: [],
    venue: "",
    organizer: "",
    __v: 0,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken); // Initialize token state

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/v1/protected", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: ProtectedData = await response.json();
          setData(data);
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("authToken");
          router.push("/login");
        } else {
          console.error("Failed to fetch protected data");
        }
      } catch (error) {
        console.error("Error fetching protected data:", error);
        localStorage.removeItem("authToken");
        router.push("/login");
      }
    };

    const fetchDriveData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/vaccination-drives/${router.query.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data: VaccineDriveDetails = await response.json();
          setDrive(data);
          console.log(data);
        } else {
          console.error("Failed to fetch drive data");
        }
      } catch (error) {
        console.error("Error fetching drive data:", error);
      }
    };

    if (token) {
      fetchData();
      fetchDriveData();
    }
  }, [router, token]);

  async function handleAddDrive(e: FormEvent) {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/vaccination-drives/${router.query.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: JSON.stringify(drive),
        },
      );

      if (response.ok) {
        router.push("/drives");
      } else {
        console.error("Failed to fetch drive data");
      }
    } catch (error) {
      console.error("Error fetching drive data:", error);
    }
    return;
  }

  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-row h-full">
        <Menu />
        <section className="p-10 w-full">
          <h1 className="text-2xl font-bold">Modify Vaccination Drive</h1>
          <section className="flex flex-col gap-8 justify-start items-center w-full h-full">
            <form className="flex flex-col gap-y-2" onSubmit={handleAddDrive}>
              <label className="text-sm font-bold">Vaccine Name</label>
              <input
                type="text"
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
                id="date"
                name="date"
                value={convertDate(drive.date)}
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[300px]"
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
                Save Drive
              </button>
            </form>
          </section>
        </section>
      </main>
    </div>
  );
}

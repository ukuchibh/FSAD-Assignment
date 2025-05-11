import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import AddDriveDialog from "@/components/AddDriveDialog";

interface ProtectedData {
  message: string;
  userId: string;
  user: string;
}

interface VaccineDriveDetails {
  _id: string;
  title: string;
  notes: string;
  vaccineName: string;
  date: string;
  availableDoses: number;
  applicableClasses: string[];
  venue: string;
  organizer: string;
  __v: number;
}

function getDate(input: string) {
  const date = new Date(input);
  return date.toLocaleDateString();
}

export default function DashboardPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData] = useState<ProtectedData | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [drives, setDrives] = useState<VaccineDriveDetails[] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  function toggleAddDialog() {
    setShowAddDialog(!showAddDialog);
  }

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
          "http://localhost:3000/api/v1/vaccination-drives",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data: VaccineDriveDetails[] = await response.json();
          setDrives(data);
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

  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-row h-full">
        <Menu />
        <section className="p-10 w-full">
          <h1 className="text-2xl font-bold">Manage Vaccination Drives</h1>
          <section className="flex flex-col gap-8 w-full h-full">
            <button
              className="flex flex-row justify-center items-center self-end p-2 w-48 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400"
              onClick={toggleAddDialog}
            >
              {showAddDialog ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="inline mr-2 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width={2}
                  stroke="currentColor"
                  className="inline mr-2 size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              )}
              Schedule Drive
            </button>
            {showAddDialog && <AddDriveDialog />}
            <section className="overflow-scroll w-full">
              <table className="w-full border-2 border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="p-2 bg-violet-300 border-2">Vaccine Name</th>
                    <th className="p-2 bg-violet-300 border-2">Date</th>
                    <th className="p-2 bg-violet-300 border-2">
                      Available Doses
                    </th>
                    <th className="p-2 bg-violet-300 border-2">
                      Applicable Classes
                    </th>
                    <th className="p-2 bg-violet-300 border-2">Venue</th>
                    <th className="p-2 bg-violet-300 border-2">Organizer</th>
                    <th className="p-2 bg-violet-300 border-2">
                      Additional Notes
                    </th>
                    <th className="p-2 bg-violet-300 border-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {drives &&
                    drives!.map((drive) => {
                      return (
                        <tr key={drive._id}>
                          <td className="p-2 border-2">{drive.vaccineName}</td>
                          <td className="p-2 border-2">
                            {getDate(drive.date)}
                          </td>
                          <td className="p-2 border-2">
                            {drive.availableDoses}
                          </td>
                          <td className="p-2 border-2">
                            {drive.applicableClasses.map((text) => {
                              return (
                                <p className="inline mr-2" key={text}>
                                  {text}
                                </p>
                              );
                            })}
                          </td>
                          <td className="p-2 border-2">{drive.venue}</td>
                          <td className="p-2 border-2">{drive.organizer}</td>
                          <td className="p-2 border-2">{drive.notes}</td>
                          <td className="p-2 border-2">
                            <a href={`/drives/${drive._id}/edit`}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </section>
          </section>
        </section>
      </main>
    </div>
  );
}

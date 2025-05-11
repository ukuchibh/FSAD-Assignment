import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";

interface ProtectedData {
  message: string;
  userId: string;
  user: string;
}

interface Student {
  _id?: string;
  name: string;
  class: string;
  studentId: string;
  guardian: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
  __v?: number;
}

interface VaccinationDrive {
  _id?: string;
  vaccineName: string;
  date: Date;
  availableDoses: number;
  applicableClasses: string[];
  venue?: string;
  organizer?: string;
  notes?: string;
  __v?: number;
}

interface VaccinationRecord {
  _id?: string;
  studentId: Student;
  vaccinationDriveId: VaccinationDrive;
  vaccinated: boolean;
  vaccinationDate: string;
  administeredBy?: string;
  batchNumber?: string;
  notes?: string;
  __v?: number;
}

function getDate(input: string) {
  const date = new Date(input);
  return date.toLocaleDateString();
}

export default function ReportsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_data, setData] = useState<ProtectedData | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [vaccinationRecords, setVaccinationRecords] = useState<
    VaccinationRecord[] | null
  >(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function toggleFilter() {
    setShowFilter(!showFilter);
  }

  function convertToCSV(data: VaccinationRecord[]) {
    if (!data || data.length === 0) {
      return "";
    }

    const headers = Object.keys(data[0]).join(",");

    const rows = data.map((record) => {
      const values = Object.values(record).map((value) => {
        if (typeof value === "object" && value !== null) {
          return JSON.stringify(value); // Stringify nested objects
        }
        return String(value).replace(/"/g, '""'); // Escape double quotes
      });
      return values.join(",");
    });

    return `${headers}\n${rows.join("\n")}`;
  }

  function downloadCsv() {
    const csvData = convertToCSV(filteredRecords as VaccinationRecord[]);
    if (csvData) {
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vaccination_records.csv"; // Set the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
      URL.revokeObjectURL(url);
    } else {
      alert("No data to download.");
    }
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

    const fetchVaccineRecordData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/vaccination-records",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data: VaccinationRecord[] = await response.json();
          setVaccinationRecords(data);
          console.log(data);
        } else {
          console.error("Failed to fetch vaccination data");
        }
      } catch (error) {
        console.error("Error fetching vaccination data:", error);
      }
    };

    if (token) {
      fetchData();
      fetchVaccineRecordData();
    }
  }, [router, token]);

  const filteredRecords = vaccinationRecords?.filter((record) => {
    const lowercasedTerm = searchTerm.toLowerCase().trim();
    if (!lowercasedTerm) return true; // Show all if no filter term

    const studentMatches =
      record.studentId.name.toLowerCase().includes(lowercasedTerm) ||
      record.studentId.class.toLowerCase().includes(lowercasedTerm) ||
      record.studentId.studentId.toLowerCase().includes(lowercasedTerm) ||
      record.studentId.guardian.toLowerCase().includes(lowercasedTerm);

    const vaccineMatches =
      record.vaccinationDriveId.vaccineName
        .toLowerCase()
        .includes(lowercasedTerm) ||
      (record.administeredBy &&
        record.administeredBy.toLowerCase().includes(lowercasedTerm)) ||
      (record.batchNumber &&
        record.batchNumber.toLowerCase().includes(lowercasedTerm)) ||
      (record.notes && record.notes.toLowerCase().includes(lowercasedTerm));

    const statusMatches =
      (lowercasedTerm === "vaccinated" && record.vaccinated) ||
      (lowercasedTerm === "not vaccinated" && !record.vaccinated) ||
      (lowercasedTerm === "yes" && record.vaccinated) ||
      (lowercasedTerm === "no" && !record.vaccinated);

    return studentMatches || vaccineMatches || statusMatches;
  });

  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-row h-full">
        <Menu />
        <section className="p-10 w-full">
          <h1 className="text-2xl font-bold">Reports</h1>
          <section className="flex flex-col gap-8 w-full h-full">
            <section className="flex flex-row gap-2 justify-end w-full">
              <button
                className="flex flex-row justify-center items-center self-end p-2 w-48 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400"
                onClick={toggleFilter}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="mr-2 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                  />
                </svg>
                Filter
              </button>
              <button
                className="flex flex-row justify-center items-center self-end p-2 w-48 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400"
                onClick={downloadCsv}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="mr-2 size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download CSV
              </button>
            </section>
            {showFilter && (
              <section className="flex flex-row justify-center items-center p-2 w-full bg-violet-200 rounded-lg">
                <input
                  id="searchTerm"
                  value={searchTerm}
                  className="p-2 w-1/2 bg-violet-100 rounded-lg border-2"
                  placeholder="Search here"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </section>
            )}
            <section className="overflow-scroll w-full">
              <table className="w-full border-2 border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="p-2 bg-violet-300 border-2">ID</th>
                    <th className="p-2 bg-violet-300 border-2">Name</th>
                    <th className="p-2 bg-violet-300 border-2">Class</th>
                    <th className="p-2 bg-violet-300 border-2">Vaccinated?</th>
                    <th className="p-2 bg-violet-300 border-2">
                      Vaccination Date
                    </th>
                    <th className="p-2 bg-violet-300 border-2">Vaccine Name</th>
                    <th className="p-2 bg-violet-300 border-2">
                      Administered By
                    </th>
                    <th className="p-2 bg-violet-300 border-2">Batch Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords &&
                    filteredRecords!.map((record) => {
                      return (
                        <tr key={record._id}>
                          <td className="p-2 border-2">
                            {record.studentId.studentId}
                          </td>
                          <td className="p-2 border-2">
                            {record.studentId.name}
                          </td>
                          <td className="p-2 border-2">
                            {record.studentId.class}
                          </td>
                          <td className="p-2 border-2">
                            {record.vaccinated ? "Yes" : "No"}
                          </td>
                          <td className="p-2 border-2">
                            {getDate(record.vaccinationDate)}
                          </td>
                          <td className="p-2 border-2">
                            {record.vaccinationDriveId
                              ? record.vaccinationDriveId.vaccineName
                              : ""}
                          </td>
                          <td className="p-2 border-2">
                            {record.administeredBy}
                          </td>
                          <td className="p-2 border-2">{record.batchNumber}</td>
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

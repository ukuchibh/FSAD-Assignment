import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import AddStudentDialog from "@/components/AddStudentDialog";

interface ProtectedData {
  message: string;
  userId: string;
  user: string;
}

interface Student {
  _id: string;
  name: string;
  class: string;
  studentId: string;
  guardian: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
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
  const [students, setStudents] = useState<Student[] | null>(null);
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

    const fetchStudentData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: Student[] = await response.json();
          setStudents(data);
        } else {
          console.error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    if (token) {
      fetchData();
      fetchStudentData();
    }
  }, [router, token]);

  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-row h-full">
        <Menu />
        <section className="p-10 w-full">
          <h1 className="text-2xl font-bold">Manage Students</h1>
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
              Add Students
            </button>
            {showAddDialog && <AddStudentDialog />}
            <section className="overflow-scroll w-full">
              <table className="w-full border-2 border-collapse table-auto">
                <thead>
                  <tr>
                    <th className="p-2 bg-violet-300 border-2">ID</th>
                    <th className="p-2 bg-violet-300 border-2">Name</th>
                    <th className="p-2 bg-violet-300 border-2">Class</th>
                    <th className="p-2 bg-violet-300 border-2">Guardian</th>
                    <th className="p-2 bg-violet-300 border-2">Birthday</th>
                    <th className="p-2 bg-violet-300 border-2">Gender</th>
                    <th className="p-2 bg-violet-300 border-2">
                      Contact Number
                    </th>
                    <th className="p-2 bg-violet-300 border-2">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {students &&
                    students!.map((student) => {
                      return (
                        <tr key={student.studentId}>
                          <td className="p-2 border-2">{student.studentId}</td>
                          <td className="p-2 border-2">{student.name}</td>
                          <td className="p-2 border-2">{student.class}</td>
                          <td className="p-2 border-2">{student.guardian}</td>
                          <td className="p-2 border-2">
                            {getDate(student.dateOfBirth)}
                          </td>
                          <td className="p-2 border-2">{student.gender}</td>
                          <td className="p-2 border-2">
                            {student.contactNumber}
                          </td>
                          <td className="p-2 border-2">{student.address}</td>
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

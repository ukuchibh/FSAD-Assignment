import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Menu from "@/components/Menu";
import StatBox from "@/components/StatBox";
import VaccineDriveBox from "@/components/VaccineDriveBox";

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

interface VaccineStats {
  totalStudents: number;
  vaccinatedStudents: number;
  vaccinationPercentage: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<ProtectedData | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null); // State to hold the token
  const [students, setStudents] = useState<Student[] | null>(null);
  const [vaccineDrives, setVaccineDrives] = useState<
    VaccineDriveDetails[] | null
  >(null);
  const [vaccineStats, setVaccineStats] = useState<VaccineStats | null>(null);

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

    const fetchUpcomingVaccineDrives = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/vaccination-drives/upcoming",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data: VaccineDriveDetails[] = await response.json();
          setVaccineDrives(data);
        } else {
          console.error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    const fetchVaccineStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/vaccination-records/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setVaccineStats(data);
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
      fetchUpcomingVaccineDrives();
      fetchVaccineStats();
    }
  }, [router, token]);

  return (
    <div className="h-full">
      <Navbar />
      <main className="flex flex-row h-full">
        <Menu />
        <section className="p-10">
          <p className="text-gray-500">Welcome back,</p>
          <h1 className="text-3xl font-bold">Admin User</h1>
          <section>
            <div className="flex flex-row gap-4 mt-5">
              <StatBox description="Total Students" value={students?.length} />
              <StatBox
                description="% of Students Vaccinated"
                value={vaccineStats && vaccineStats.vaccinationPercentage + "%"}
              />
              <VaccineDriveBox
                title="Upcoming Vaccination Drives"
                drives={vaccineDrives}
              />
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

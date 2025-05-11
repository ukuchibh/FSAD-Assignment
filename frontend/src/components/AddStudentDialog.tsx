import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/router";

interface Student {
  name: string;
  class: string;
  studentId: string;
  guardian: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  address: string;
}

export default function AddStudentDialog() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [student, setStudent] = useState<Student>({
    name: "",
    class: "",
    studentId: "",
    guardian: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    address: "",
  });

  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken); // Initialize token state
  }, [token]);

  async function handleAddSingleStudent(e: FormEvent) {
    e.preventDefault();
    console.log(student);
    try {
      const response = await fetch("http://localhost:3000/api/v1/students", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(student),
      });

      if (response.ok) {
        router.reload();
      } else {
        console.error("Failed to fetch student data");
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
    return;
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    } else {
      setCsvFile(null);
    }
  }

  async function handleAddMultipleStudents(e: FormEvent) {
    e.preventDefault();
    if (csvFile) {
      const formData = new FormData();
      formData.append("file", csvFile);

      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/students/upload-csv",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            method: "POST",
            body: formData,
          },
        );

        if (response.ok) {
          router.reload();
        } else {
          console.error("Failed to fetch student data");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }
    return;
  }

  return (
    <section className="flex flex-row gap-24 justify-center items-center p-8 w-full bg-violet-200 rounded-lg">
      <form className="flex flex-col gap-y-2" onSubmit={handleAddSingleStudent}>
        <label className="text-sm font-bold">Student ID</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="studentId"
          name="studentId"
          value={student.studentId}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              studentId: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Student Name</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="name"
          name="name"
          value={student.name}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              name: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Class</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="class"
          name="class"
          value={student.class}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              class: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Guardian Name</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="guardian"
          name="guardian"
          value={student.guardian}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              guardian: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Date of Birth</label>
        <input
          type="date"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="dateOfBirth"
          name="dateOfBirth"
          value={student.dateOfBirth}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              dateOfBirth: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Gender</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="gender"
          name="gender"
          value={student.gender}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              gender: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Contact Number</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="contactNumber"
          name="contactNumber"
          value={student.contactNumber}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              contactNumber: e.target.value,
            }))
          }
        />
        <label className="text-sm font-bold">Address</label>
        <input
          type="text"
          className="p-1 bg-white rounded-lg border-2 border-violet-400 w-[200px]"
          id="address"
          name="address"
          value={student.address}
          onChange={(e) =>
            setStudent((prevStudent) => ({
              ...prevStudent,
              address: e.target.value,
            }))
          }
        />
        <button className="self-center p-2 mt-5 w-40 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400">
          Add Student
        </button>
      </form>
      <p className="text-2xl font-bold">(or)</p>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={handleAddMultipleStudents}
      >
        <input
          type="file"
          className="p-2 rounded-lg border-2 file:rounded-lg file:text-black file:hover:bg-violet-400 file:border-black file:transition-all file:border-2 file:mr-4 file:bg-violet-300 file:p-2"
          id="file"
          name="file"
          onChange={handleFileChange}
        />
        <button className="self-center p-2 mt-5 bg-violet-300 rounded-lg border-2 transition-all cursor-pointer hover:bg-violet-400">
          Add Multiple Students
        </button>
      </form>
    </section>
  );
}

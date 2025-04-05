"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SideBar from "@/components/SideBar";
import { getAllStudents} from "@/utils/api";

interface Student {
  id: number;
  userFullName: string;
  nickname: string;
  gender: string;
  point: number;
  heart: number;
  level: number;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getAllStudents();
        setStudents(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Failed to load students. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleAddPoint = (id: number) => {
    router.push(`/student/addPoint/${id}`);
  };

  const handleModifyHeart = (id: number) => {
    router.push(`/student/modifyHeart/${id}`);
  };

  const handleModifyLevel = (id: number) => {
    router.push(`/student/modifyLevel/${id}`);
  };

  return (
    <div className="h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Students</h1>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => router.push("/student-manage/create")}
            >
              Add New Student
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
              {error}
            </div>
          ) : students.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-yellow-700">
              No students found. Add your first student to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center p-4 border-b">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={student.gender.toLowerCase() === "boy" ? "/boy-profile.png" : "/girl-profile.png"}
                        alt={`${student.nickname} profile`}
                        fill
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {student.userFullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {student.nickname} • {student.gender}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-3 gap-3 bg-gray-50">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">Points</div>
                      <div className="text-xl font-bold text-blue-600">{student.point}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">Hearts</div>
                      <div className="text-xl font-bold text-red-600">{student.heart}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-500">Level</div>
                      <div className="text-xl font-bold text-green-600">{student.level}</div>
                    </div>
                  </div>

                  <div className="p-4 grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAddPoint(student.id)}
                      className="py-2 px-3 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                    >
                      Add Point
                    </button>
                    <button
                      onClick={() => handleModifyHeart(student.id)}
                      className="py-2 px-3 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Modify Heart
                    </button>
                    <button
                      onClick={() => handleModifyLevel(student.id)}
                      className="py-2 px-3 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Modify Level
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
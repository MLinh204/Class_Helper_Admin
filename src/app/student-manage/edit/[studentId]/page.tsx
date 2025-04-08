"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getStudentById, updateStudent } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";


interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default function EditStudentPage({ params }: PageProps) {
  const [studentId, setStudentId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    age: "",
    gender: "Boy",
    nickname: "",
    userFullName: "",
    level: "",
    point: "",
    heart: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setStudentId(parseInt(resolvedParams.studentId));
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if(studentId !== null){
      fetchStudentData();
    }

  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      if (studentId === null) {
        throw new Error("Student ID is null");
      }
      const response = await getStudentById(studentId);
      const student = response.data;
      
      setFormData({
        address: student.address || "",
        age: student.age?.toString() || "",
        gender: student.gender || "Boy",
        nickname: student.nickname || "",
        userFullName: student.userFullName || "",
        level: student.level || "",
        point: student.point?.toString() || "",
        heart: student.heart?.toString() || "",
      });
    } catch (error) {
      console.error("Error fetching student data:", error);
      alert("Failed to load student data. Please try again.");
      router.push("/student-manage");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear any error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.userFullName.trim()) {
      newErrors.userFullName = "Full name is required";
    }
    
    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.nickname.trim()) {
      newErrors.nickname = "Nickname is required";
    }
    
    if (formData.point && (isNaN(Number(formData.point)) || Number(formData.point) < 0)) {
      newErrors.point = "Points must be a non-negative number";
    }
    
    if (formData.heart && (isNaN(Number(formData.heart)) || Number(formData.heart) < 0)) {
      newErrors.heart = "Hearts must be a non-negative number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setSubmitting(true);
      const dataToSubmit = {
        ...formData,
        age: Number(formData.age),
        point: formData.point ? Number(formData.point) : undefined,
        heart: formData.heart ? Number(formData.heart) : undefined,
      };
      
      if (studentId === null) {
        throw new Error("Student ID is null");
      }
      await updateStudent(studentId, dataToSubmit);
      router.push("/student-manage");
    } catch (error: unknown) {
      console.error("Error update student:", error);
      if (isAxiosError(error) && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to update student. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <SideBar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <SideBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Student</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="mb-4">
                <label htmlFor="userFullName" className="block text-gray-700 font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="userFullName"
                  name="userFullName"
                  value={formData.userFullName}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.userFullName ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter full name"
                />
                {errors.userFullName && (
                  <p className="mt-1 text-red-500 text-sm">{errors.userFullName}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="nickname" className="block text-gray-700 font-medium mb-2">
                  Nickname *
                </label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.nickname ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter nickname"
                />
                {errors.nickname && (
                  <p className="mt-1 text-red-500 text-sm">{errors.nickname}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="age" className="block text-gray-700 font-medium mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter age"
                  min="1"
                />
                {errors.age && (
                  <p className="mt-1 text-red-500 text-sm">{errors.age}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="gender" className="block text-gray-700 font-medium mb-2">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Boy">Boy</option>
                  <option value="Girl">Girl</option>
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="level" className="block text-gray-700 font-medium mb-2">
                  Level
                </label>
                <input
                  type="text"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter level"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="point" className="block text-gray-700 font-medium mb-2">
                  Points
                </label>
                <input
                  type="number"
                  id="point"
                  name="point"
                  value={formData.point}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.point ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter points"
                  min="0"
                />
                {errors.point && (
                  <p className="mt-1 text-red-500 text-sm">{errors.point}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="heart" className="block text-gray-700 font-medium mb-2">
                  Hearts
                </label>
                <input
                  type="number"
                  id="heart"
                  name="heart"
                  value={formData.heart}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.heart ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter hearts"
                  min="0"
                />
                {errors.heart && (
                  <p className="mt-1 text-red-500 text-sm">{errors.heart}</p>
                )}
              </div>

              <div className="mb-4 md:col-span-2">
                <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="mt-1 text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-4 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {submitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Update Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
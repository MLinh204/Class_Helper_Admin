"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getTeacherById, updateTeacher } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";


interface PageProps {
  params: Promise<{ teacherId: string }>;
}

export default function EditTeacherPage({ params }: PageProps) {
  const [teacherId, setTeacherId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scheduleDate: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchTeacherData = useCallback(async () => {
    try {
      setLoading(true);
      if (teacherId === null) {
        throw new Error("Teacher ID is null");
      }
      const response = await getTeacherById(teacherId);
      const teacher = response.data;

      // Handle scheduleDate that could be a string, array, or null
      let scheduleDates: string[] = [];
      if (teacher.scheduleDate) {
        if (typeof teacher.scheduleDate === 'string') {
          // Convert comma-separated string to array
          scheduleDates = teacher.scheduleDate.split(',');
        } else if (Array.isArray(teacher.scheduleDate)) {
          scheduleDates = teacher.scheduleDate;
        }
      }

      setFormData({
        scheduleDate: scheduleDates,
      });
    } catch (error) {
      console.error("Error fetching teacher data:", error);
      alert("Failed to load teacher data. Please try again.");
      router.push("/teacher");
    } finally {
      setLoading(false);
    }
  }, [teacherId, router]);

  
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setTeacherId(parseInt(resolvedParams.teacherId));
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (teacherId !== null){
      fetchTeacherData();
    }
  }, [teacherId, fetchTeacherData]);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    if (type === "checkbox") {
      // Handle multi-checkbox selection
      setFormData((prev) => {
        const newScheduleDate = checked
          ? [...prev.scheduleDate, value]
          : prev.scheduleDate.filter((day) => day !== value);
        return { ...prev, scheduleDate: newScheduleDate };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
      };

      if(teacherId === null) {
        throw new Error("Teacher ID is null");
      }
      await updateTeacher(teacherId, dataToSubmit);
      router.push("/teacher");
    } catch (error: unknown) {
      console.error("Error update teacher:", error);
      if (isAxiosError(error) && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to update teacher. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-800">Edit Teacher</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Weekday Selection */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Teaching Dates</label>
                <div className="flex flex-wrap gap-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={day}
                        name="scheduleDate"
                        value={day}
                        checked={formData.scheduleDate.includes(day)}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label htmlFor={day} className="text-gray-700">{day}</label>
                    </div>
                  ))}
                </div>
                {errors.scheduleDate && (
                  <p className="mt-1 text-red-500 text-sm">{errors.scheduleDate}</p>
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
                Update Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
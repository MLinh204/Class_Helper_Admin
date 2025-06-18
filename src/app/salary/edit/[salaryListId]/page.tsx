"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getSalaryListById, updateSalaryList } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";

interface PageProps {
  params: Promise<{ salaryListId: string }>;
}

export default function EditSalaryPage({ params }: PageProps) {
  const [salaryListId, setSalaryListId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    month_year: "",
    daily_rate: 0,
    status: "",
    total_records: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchSalaryData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getSalaryListById(salaryListId!);
      const salary = response.data;
      setFormData({
        title: salary.title || "",
        month_year: salary.month_year || "",
        daily_rate: salary.daily_rate || 0,
        status: salary.status || "",
        total_records: salary.total_records || 0,
      });
    } catch (error) {
      console.error("Error fetching salary data:", error);
      alert("Failed to load salary data. Please try again.");
      router.push("/salary");
    } finally {
      setLoading(false);
    }
  }, [salaryListId, router]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setSalaryListId(parseInt(resolved.salaryListId));
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (salaryListId !== null) fetchSalaryData();
  }, [salaryListId, fetchSalaryData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "daily_rate" || name === "total_records"
          ? Number(value)
          : value,
    }));
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
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.month_year.trim())
      newErrors.month_year = "Month-Year is required";
    if (!formData.daily_rate)
      newErrors.daily_rate = "Valid daily rate is required";
    if (!formData.status.trim()) newErrors.status = "Status is required";
    if (!formData.total_records)
      newErrors.total_records = "Valid total records is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await updateSalaryList(salaryListId!, formData);
      router.push("/salary");
    } catch (error: unknown) {
      console.error("Error updating salary list:", error);
      if (isAxiosError(error) && error.response?.data?.message)
        alert(`Error: ${error.response.data.message}`);
      else alert("Failed to update salary list. Please try again.");
    } finally {
      setSubmitting(false);
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Edit Salary List</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "title", label: "Title" },
                { name: "month_year", label: "Month-Year" },
                { name: "daily_rate", label: "Daily Rate" },
                {
                  name: "status",
                  label: "Status",
                  select: true,
                  options: ["active", "completed"],
                },
              ].map((field) => (
                <div key={field.name} className="mb-4">
                  <label
                    htmlFor={field.name}
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {field.label} *
                  </label>
                  {field.select ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                      {field.options!.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.name === "daily_rate" ? "number" : "text"}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className={`w-full border ${errors[field.name] ? "border-red-500" : "border-gray-300"} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}
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
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                Update Salary List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

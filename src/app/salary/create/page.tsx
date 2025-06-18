"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { createSalaryList } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";

export default function CreateSalaryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    monthYear: "",
    dailyRate: "",
    status: "",
    total_records: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.monthYear.trim())
      newErrors.monthYear = "Month-Year is required";
    if (!formData.dailyRate || isNaN(Number(formData.dailyRate)))
      newErrors.dailyRate = "Valid daily rate is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setLoading(true);
      await createSalaryList({
        monthYear: formData.monthYear,
        dailyRate: Number(formData.dailyRate),
      });
      router.push("/salary");
    } catch (error: unknown) {
      console.error("Error creating salary list:", error);
      if (isAxiosError(error) && error.response?.data?.message)
        alert(`Error: ${error.response.data.message}`);
      else alert("Failed to create salary list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800">
            Create Salary List
          </h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "monthYear", label: "Month-Year", type: "text" },
                { name: "dailyRate", label: "Daily Rate", type: "number" },
              ].map((field) => (
                <div key={field.name} className="mb-4">
                  <label
                    htmlFor={field.name}
                    className="block text-gray-700 font-medium mb-2"
                  >
                    {field.label} *
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select status</option>
                    </select>
                  ) : (
                    <input
                      type={field.type}
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
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
                Create Salary List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

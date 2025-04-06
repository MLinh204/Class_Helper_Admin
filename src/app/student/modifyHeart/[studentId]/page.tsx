"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { modifyHeart } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";


interface ModifyHeartPageProps {
    params: {
        studentId: string;
    };
}

export default function ModifyHeartPage({ params }: ModifyHeartPageProps) {
    const studentId = parseInt(params.studentId);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        heart: 0,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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

        if (!formData.heart.toString().trim()) {
            newErrors.heart = "Heart is required";
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
            setLoading(true);

            await modifyHeart(studentId, { heart: Number(formData.heart) });
            router.push("/student");
        } catch (error: unknown) {
            console.error("Error modify heart:", error);
            if (isAxiosError(error) && error.response.data.message) {
              alert(`Error: ${error.response.data.message}`);
            } else {
              alert("Failed to modify heart. Please try again.");
            }
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">Modify Heart</h1>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="mb-4">
                                <label htmlFor="heart" className="block text-gray-700 font-medium mb-2">
                                    Heart to add *
                                </label>
                                <input
                                    type="number"
                                    id="heart"
                                    name="heart"
                                    value={formData.heart}
                                    onChange={handleChange}
                                    className={`w-full border ${errors.name ? "border-red-500" : "border-gray-300"
                                        } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="Enter heart"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-red-500 text-sm">{errors.heart}</p>
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
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                Add Heart
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
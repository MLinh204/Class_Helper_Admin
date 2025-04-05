"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { createStudent } from "@/utils/api";

export default function CreateStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    age: "",
    gender: "Boy", // Default value
    nickname: "",
    password: "",
    userFullName: "",
    username: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const dataToSubmit = {
        ...formData,
        age: Number(formData.age),
      };
      
      await createStudent(dataToSubmit);
      router.push("/student-manage");
    } catch (error: any) {
      console.error("Error creating student:", error);
      if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to create student. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-800">Create New Student</h1>
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
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter username"
                />
                {errors.username && (
                  <p className="mt-1 text-red-500 text-sm">{errors.username}</p>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
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
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Create Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
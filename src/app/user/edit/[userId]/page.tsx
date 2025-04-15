"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getUserById, updateUser, getRoles, updateUserRole } from "@/utils/api";
import { isAxiosError } from "@/utils/errorUtils";


interface EditUserPageProps {
  params: Promise<{ userId: string }>;
}
type Role = {
  id: number;
  name: string;
}
export default function EditUserPage({ params }: EditUserPageProps) {
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    role_id: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      if (userId === null) {
        throw new Error("User ID is null");
      }
      const response = await getUserById(userId);
      const user = response.data;
      
      setFormData({
        username: user.username || "",
        role_id: user.role_id?.toString() || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user data. Please try again.");
      router.push("/user");
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  },[]);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setUserId(parseInt(resolvedParams.userId));
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    fetchUserData();
    fetchRoles();
  }, [userId, fetchUserData, fetchRoles]);

  

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
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
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
      
      // User data update
      const userDataToSubmit = {
        username: formData.username
      };
      
      if (userId === null) {
        throw new Error("User ID is null");
      }
      await updateUser(userId, userDataToSubmit);
      
      // Update role if needed
      if (formData.role_id) {
        const roleDataToSubmit = {
          role_id: Number(formData.role_id),
        };
        await updateUserRole(userId, roleDataToSubmit);
      }
      
      router.push("/user");
    } catch (error: unknown) {
      console.error("Error update user:", error);
      if (isAxiosError(error) && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("Failed to update user. Please try again.");
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
          <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <label htmlFor="role_id" className="block text-gray-700 font-medium mb-2">
                  Role *
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
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
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
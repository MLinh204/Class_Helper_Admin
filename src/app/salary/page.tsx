"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import {
  getAllSalaryLists,
  deleteSalaryList,
  sortSalaryListsBy,
  searchSalaryList,
} from "@/utils/api";

interface SalaryList {
  id: number;
  title: string;
  month_year: string;
  daily_rate: number;
  status: string;
  total_records: number;
  created_at: string;
}

export default function SalaryPage() {
  const router = useRouter();
  const [salaryLists, setSalaryLists] = useState<SalaryList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaryToDelete, setSalaryToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchSalaryLists();
  }, []);

  const fetchSalaryLists = async () => {
    try {
      setLoading(true);
      const response = await getAllSalaryLists();
      setSalaryLists(response.data);
    } catch (error) {
      console.error("Error fetching salary lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (column: string) => {
    try {
      if (sortColumn === column) {
        const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
        setSortOrder(newOrder);
        const response = await sortSalaryListsBy(column, newOrder);
        setSalaryLists(response.data);
      } else {
        setSortColumn(column);
        setSortOrder("ASC");
        const response = await sortSalaryListsBy(column, "ASC");
        setSalaryLists(response.data);
      }
    } catch (error) {
      console.error("Error sorting salary lists:", error);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await searchSalaryList(searchQuery);
      setSalaryLists(
        response.data.filter((salary: SalaryList) =>
          Object.values(salary).some(
            (value) =>
              value &&
              value.toString().toLowerCase().includes(searchQuery.toLowerCase())
          )
        )
      );
    } catch (error) {
      console.error("Error searching salary lists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/salary/edit/${id}`);
  };

  const confirmDelete = (id: number) => {
    setSalaryToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!salaryToDelete) return;
    try {
      await deleteSalaryList(salaryToDelete);
      setShowDeleteModal(false);
      setSalaryToDelete(null);
      await fetchSalaryLists();
    } catch (error) {
      console.error("Error deleting salary list:", error);
    }
  };

  const handleCreate = () => {
    router.push("/salary/create");
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return "↕️";
    return sortOrder === "ASC" ? "↑" : "↓";
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-yellow-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SideBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Salary Management
          </h1>
          <div className="flex items-center space-x-4">
            {showSearchBar ? (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search Salary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition duration-200"
                >
                  Search
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchBar(true)}
                className="p-2 rounded-full hover:bg-gray-200 transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
            <button
              onClick={handleCreate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Salary List
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: "id", label: "ID" },
                      { key: "title", label: "Title" },
                      { key: "month_year", label: "Month-Year" },
                      { key: "daily_rate", label: "Daily Rate" },
                      { key: "status", label: "Status" },
                      { key: "total_records", label: "Total Records" },
                      { key: "created_at", label: "Created At" },
                    ].map((column) => (
                      <th
                        key={column.key}
                        onClick={() => handleSort(column.key)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      >
                        {column.label} {getSortIcon(column.key)}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaryLists.map((salary) => (
                    <tr key={salary.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.month_year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.daily_rate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(salary.status)}`}
                        >
                          {salary.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {salary.total_records}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(salary.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEdit(salary.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => confirmDelete(salary.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="mb-4">
                Are you sure you want to delete this salary list?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 mr-4 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

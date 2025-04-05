"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getAttendanceLists, deleteAttendanceList, sortAttendanceListsBy, searchAttendanceList } from "@/utils/api";

interface AttendanceList {
    id: number;
    title: string;
    teacher_id: number;
    status: string;
    created_at: string;
}

export default function AttendancePage() {
    const router = useRouter();
    const [attendanceLists, setAttendanceLists] = useState<AttendanceList[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [attendanceToDelete, setAttendanceToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchAttendanceLists();
    }, []);

    const fetchAttendanceLists = async () => {
        try {
            setLoading(true);
            const response = await getAttendanceLists();
            setAttendanceLists(response.data);
        } catch (error) {
            console.error("Error fetching attendance lists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = async (column: string) => {
        try {
            if (sortColumn === column) {
                // Toggle sort order if same column is clicked
                const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
                setSortOrder(newOrder);
                const response = await sortAttendanceListsBy(column, newOrder);
                setAttendanceLists(response.data);
            } else {
                // New column, reset to ASC
                setSortColumn(column);
                setSortOrder("ASC");
                const response = await sortAttendanceListsBy(column, "ASC");
                setAttendanceLists(response.data);
            }
        } catch (error) {
            console.error("Error sorting registration lists:", error);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await searchAttendanceList(searchQuery);
            setAttendanceLists(response.data.filter((attendance: AttendanceList) =>
                Object.values(attendance).some(value =>
                    value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            ));
        } catch (error) {
            console.error("Error searching registration lists:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/attendance/edit/${id}`);
    };

    const confirmDelete = (id: number) => {
        setAttendanceToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!attendanceToDelete) return;

        try {
            await deleteAttendanceList(attendanceToDelete);
            setShowDeleteModal(false);
            setAttendanceToDelete(null);
            await fetchAttendanceLists();
        } catch (error) {
            console.error("Error deleting attendance list:", error);
        }
    };

    const handleCreate = () => {
        router.push("/attendance/create");
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) return "↕️";
        return sortOrder === "ASC" ? "↑" : "↓";
    };

    const getStatusClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-yellow-100 text-green-800';
            case 'closed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SideBar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
                    <div className="flex items-center space-x-4">
                        {showSearchBar ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search Attendance..."
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
                            Create Attendance List
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
                                            { key: "teacher_id", label: "Created Teacher Id" },
                                            { key: "status", label: "Status" },
                                            { key: "created_at", label: "Created At" },
                                            { key: "actions", label: "Actions" },
                                        ].map((column) => (
                                            <th
                                                key={column.key}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                onClick={() => column.key !== "actions" && handleSort(column.key)}
                                            >
                                                {column.label} {column.key !== "actions" && getSortIcon(column.key)}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {attendanceLists.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                                No registration entries found
                                            </td>
                                        </tr>
                                    ) : (
                                        attendanceLists.map((attendance) => (
                                            <tr key={attendance.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.title}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{attendance.teacher_id}</td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getStatusClass(attendance.status)}`}>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(attendance.status)}`}>
                                                        {attendance.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(attendance.created_at).toLocaleDateString()}</td>
                                                {/* Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(attendance.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(attendance.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                            <p className="mb-6">Are you sure you want to delete this registration? This action cannot be undone.</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
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
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import SideBar from "@/components/SideBar";
import { getVocabByListId, searchVocabViaListId, sortVocabViaListId, deleteVocab } from "@/utils/api";

interface Vocab {
    id: number;
    list_id: number;
    word: string;
    translation: string;
    definition: string;
    part_of_speech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'phrase verb' | 'collocation';
    example_sentence: string;
    synonyms: string;
    antonyms: string;
    created_by: string;
    created_at: string;
}

export default function Vocab({ params }: { params: Promise<{ listId: number }> }) {
    const router = useRouter();
    const {listId} = use(params);
    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortColumn, setSortColumn] = useState("");
    const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [vocabToDelete, setVocabToDelete] = useState<number | null>(null);



    useEffect(() => {
        fetchVocabs();
    }, []);

    const fetchVocabs = async () => {
        try {
            setLoading(true);
            const response = await getVocabByListId(listId);
            setVocabs(response.data);
            setLoading(false);
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
                const response = await sortVocabViaListId(listId, column, newOrder);
                setVocabs(response.data);
            } else {
                // New column, reset to ASC
                setSortColumn(column);
                setSortOrder("ASC");
                const response = await sortVocabViaListId(listId, column, "ASC");
                setVocabs(response.data);
            }
        } catch (error) {
            console.error("Error sorting registration lists:", error);
        }
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const response = await searchVocabViaListId(listId, searchQuery);
            setVocabs(response.data.filter((vocabList: Vocab) =>
                Object.values(vocabList).some(value =>
                    value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            ));
        } catch (error) {
            console.error("Error searching Vocabs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id: number) => {
        router.push(`/vocab/${id}`);
    };

    const confirmDelete = (id: number) => {
        setVocabToDelete(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!vocabToDelete) return;

        try {
            await deleteVocab(vocabToDelete);
            setShowDeleteModal(false);
            setVocabToDelete(null);
            await fetchVocabs();
        } catch (error) {
            console.error("Error deleting attendance list:", error);
        }
    };

    const handleCreate = () => {
        router.push("/vocab/list/create");
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) return "↕️";
        return sortOrder === "ASC" ? "↑" : "↓";
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <SideBar />
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Vocabs Management</h1>
                    <div className="flex items-center space-x-4">
                        {showSearchBar ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    placeholder="Search Vocabs..."
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
                            Create Vocab
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
                                            { key: "list_id", label: "Vocab List Id" },
                                            { key: "word", label: "Word" },
                                            { key: "translation", label: "Translation" },
                                            { key: "definition", label: "Definition" },
                                            { key: "part_of_speech", label: "Type of Word" },
                                            { key: "example_sentence", label: "Example Sentences" },
                                            { key: "synonyms", label: "Synonyms" },
                                            { key: "antonyms", label: "Antonyms" },
                                            { key: "created_by", label: "Created By" },
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
                                    {vocabs.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                                                No registration entries found
                                            </td>
                                        </tr>
                                    ) : (
                                        vocabs.map((vocab) => (
                                            <tr key={vocab.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.list_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.word}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.translation}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.definition}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.part_of_speech}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.example_sentence}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.synonyms}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.antonyms}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{vocab.created_by}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(vocab.created_at).toLocaleDateString()}</td>
                                                {/* Actions */}
                                                <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(vocab.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(vocab.id)}
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
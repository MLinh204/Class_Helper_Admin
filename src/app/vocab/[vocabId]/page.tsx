// src/app/vocab/[vocabId]/page.tsx

'use client';

import React, { useEffect, useState, use } from 'react';
import { getVocabById, updateVocab } from '@/utils/api';
import { ArrowLeft, BookOpen, Clock, User, Save, X, Edit } from 'lucide-react';
import Link from 'next/link';

interface VocabItem {
  id: number;
  list_id: number;
  word: string;
  translation: string;
  definition: string;
  part_of_speech: string;
  example_sentence: string;
  synonyms: string;
  antonyms: string;
  created_by: number;
  created_at: string;
}

export default function VocabDetailPage({ params }: { params: Promise<{ vocabId: number }> }) {
  const {vocabId} = use(params);
  const [vocabItem, setVocabItem] = useState<VocabItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedVocab, setEditedVocab] = useState<Partial<VocabItem>>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    const fetchVocabItem = async () => {
      try {
        setLoading(true);
        const response = await getVocabById(vocabId);
        setVocabItem(response.data);
        setEditedVocab(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching vocabulary item:', err);
        setError('Failed to load vocabulary item. Please try again later.');
        setLoading(false);
      }
    };

    fetchVocabItem();
  }, [vocabId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedVocab((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!vocabItem) return;

    try {
      setSaveStatus('saving');
      
      // Only include editable fields in the update
      const updatedData = {
        word: editedVocab.word,
        translation: editedVocab.translation,
        definition: editedVocab.definition,
        part_of_speech: editedVocab.part_of_speech,
        example_sentence: editedVocab.example_sentence,
        synonyms: editedVocab.synonyms,
        antonyms: editedVocab.antonyms,
      };

      await updateVocab(vocabItem.id, updatedData);
      
      // Update the vocabItem state with edited values
      setVocabItem({
        ...vocabItem,
        word: updatedData.word || vocabItem.word,
        translation: updatedData.translation || vocabItem.translation,
        definition: updatedData.definition || vocabItem.definition,
        part_of_speech: updatedData.part_of_speech || vocabItem.part_of_speech,
        example_sentence: updatedData.example_sentence || vocabItem.example_sentence,
        synonyms: updatedData.synonyms || vocabItem.synonyms,
        antonyms: updatedData.antonyms || vocabItem.antonyms,
      });
      
      setSaveStatus('success');
      setIsEditing(false);
      
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error('Error updating vocabulary item:', err);
      setSaveStatus('error');
      
      // Reset save status after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const cancelEdit = () => {
    // Restore original values
    setEditedVocab(vocabItem || {});
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-red-600 text-xl font-semibold">Error</h2>
          <p className="mt-2">{error}</p>
          <Link href="/vocab" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to vocabulary list
          </Link>
        </div>
      </div>
    );
  }

  if (!vocabItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
          <h2 className="text-yellow-600 text-xl font-semibold">Vocabulary not found</h2>
          <p className="mt-2">{"The vocabulary item you're looking for could not be found."}.</p>
          <Link href="/vocab" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to vocabulary list
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPartOfSpeechBadgeColor = (pos: string) => {
    const colors: Record<string, string> = {
      noun: 'bg-blue-100 text-blue-800',
      verb: 'bg-green-100 text-green-800',
      adjective: 'bg-purple-100 text-purple-800',
      adverb: 'bg-yellow-100 text-yellow-800',
      pronoun: 'bg-pink-100 text-pink-800',
      preposition: 'bg-indigo-100 text-indigo-800',
      conjunction: 'bg-red-100 text-red-800',
      interjection: 'bg-orange-100 text-orange-800',
    };
    
    return colors[pos.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Editable field component
  const EditableField = ({ 
    name, 
    label, 
    value, 
    type = 'text', 
    options = null 
  }: { 
    name: string; 
    label: string; 
    value: string; 
    type?: string;
    options?: string[] | null;
  }) => {
    if (!isEditing) {
      return (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">{label}</h2>
          {type === 'textarea' ? (
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">
              {value}
            </p>
          ) : (
            <p className="text-gray-700 bg-gray-50 p-4 rounded-md border border-gray-100">
              {value}
            </p>
          )}
        </div>
      );
    }

    if (type === 'select' && options) {
      return (
        <div>
          <label htmlFor={name} className="block text-lg font-semibold text-gray-800 mb-2">
            {label}
          </label>
          <select
            id={name}
            name={name}
            value={editedVocab[name as keyof VocabItem] as string}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={name} className="block text-lg font-semibold text-gray-800 mb-2">
          {label}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={editedVocab[name as keyof VocabItem] as string}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <input
            type="text"
            id={name}
            name={name}
            value={editedVocab[name as keyof VocabItem] as string}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link 
            href={`/vocab/list/${vocabItem.list_id}`} 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vocabulary List
          </Link>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Vocabulary
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={cancelEdit}
                className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className={`inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                  saveStatus === 'saving' ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {saveStatus === 'saving' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Save Status Messages */}
        {saveStatus === 'success' && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
            Vocabulary updated successfully!
          </div>
        )}
        
        {saveStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            Failed to update vocabulary. Please try again.
          </div>
        )}

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="word" className="block text-lg font-semibold text-white mb-2">
                    Word
                  </label>
                  <input
                    type="text"
                    id="word"
                    name="word"
                    value={editedVocab.word || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="translation" className="block text-lg font-semibold text-white mb-2">
                    Translation
                  </label>
                  <input
                    type="text"
                    id="translation"
                    name="translation"
                    value={editedVocab.translation || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <div>
                  <label htmlFor="part_of_speech" className="block text-lg font-semibold text-white mb-2">
                    Part of Speech
                  </label>
                  <select
                    id="part_of_speech"
                    name="part_of_speech"
                    value={editedVocab.part_of_speech || ''}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  >
                    {['noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition', 'conjunction', 'interjection'].map((pos) => (
                      <option key={pos} value={pos}>
                        {pos.charAt(0).toUpperCase() + pos.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-white">{vocabItem.word}</h1>
                <div className="mt-2 text-blue-100 text-xl">{vocabItem.translation}</div>
                <div className="mt-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPartOfSpeechBadgeColor(vocabItem.part_of_speech)}`}>
                    {vocabItem.part_of_speech}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <EditableField
                  name="definition"
                  label="Definition"
                  value={vocabItem.definition}
                  type="textarea"
                />

                <EditableField
                  name="example_sentence"
                  label="Example Sentence"
                  value={vocabItem.example_sentence}
                  type="textarea"
                />
              </div>

              <div className="space-y-6">
                <EditableField
                  name="synonyms"
                  label="Synonyms"
                  value={vocabItem.synonyms}
                />

                <EditableField
                  name="antonyms"
                  label="Antonyms"
                  value={vocabItem.antonyms}
                />
              </div>
            </div>

            {/* Read-only Metadata */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500">
                <div className="flex items-center mb-2 sm:mb-0">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>List ID: {vocabItem.list_id}</span>
                </div>
                <div className="flex items-center mb-2 sm:mb-0">
                  <User className="h-4 w-4 mr-1" />
                  <span>Created by: User #{vocabItem.created_by}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Created: {formatDate(vocabItem.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
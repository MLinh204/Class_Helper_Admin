// src/app/board/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { getAllStudents } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Student {
  id: number;
  userFullName: string;
  // Add other properties as needed
}

export default function BoardPage() {
  // Countdown Timer State
  const [time, setTime] = useState<string>("00:15:00");
  const [inputTime, setInputTime] = useState<string>("00:15:00");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeInSeconds, setTimeInSeconds] = useState<number>(900); // 15 minutes in seconds
  
  // Random Student Selector State
  const [students, setStudents] = useState<Student[]>([]);
  const [availableStudents, setAvailableStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [fetchingStudents, setFetchingStudents] = useState<boolean>(false);
  
  // Text Board State
  const [boardText, setBoardText] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);
  
  // Countdown timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && timeInSeconds > 0) {
      interval = setInterval(() => {
        setTimeInSeconds(prevTime => {
          const newTime = prevTime - 1;
          updateTimeDisplay(newTime);
          return newTime;
        });
      }, 1000);
    } else if (timeInSeconds === 0) {
      setIsRunning(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeInSeconds]);
  
  const updateTimeDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    setTime(timeString);
  };
  
  const handleStartTimer = () => {
    setIsRunning(true);
  };
  
  const handleStopTimer = () => {
    setIsRunning(false);
  };
  
  const handleResetTimer = () => {
    setIsRunning(false);
    parseAndSetTime(inputTime);
  };
  
  const parseAndSetTime = (timeString: string) => {
    // Parse the time string (format: HH:MM:SS)
    const parts = timeString.split(':').map(part => parseInt(part, 10));
    if (parts.length === 3) {
      const totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
      setTimeInSeconds(totalSeconds);
      setTime(timeString);
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(e.target.value);
  };
  
  const handleTimeSubmit = () => {
    parseAndSetTime(inputTime);
  };
  
  // Student selection functions
  const fetchStudents = async () => {
    try {
      setFetchingStudents(true);
      const response = await getAllStudents();
      const fetchedStudents = response.data;
      setStudents(fetchedStudents);
      setFetchingStudents(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setFetchingStudents(false);
    }
  };
  
  const addAllStudents = () => {
    setAvailableStudents([...students]);
  };
  
  const clearStudentList = () => {
    setAvailableStudents([]);
  };
  
  const selectRandomStudent = async () => {
    if (availableStudents.length === 0) return;
    
    setIsSelecting(true);
    setSelectedStudent(null);
    
    // Animation: rapidly cycle through students
    let iterations = 0;
    const maxIterations = 10;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableStudents.length);
      setSelectedStudent(availableStudents[randomIndex]);
      iterations++;
      
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setTimeout(() => {
          // Final selection
          const finalIndex = Math.floor(Math.random() * availableStudents.length);
          const selected = availableStudents[finalIndex];
          setSelectedStudent(selected);
          
          // Remove selected student from available list
          setAvailableStudents(prev => prev.filter(s => s.id !== selected.id));
          setIsSelecting(false);
        }, 500);
      }
    }, 200);
  };
  
  const addStudentToList = (student: Student) => {
    if (!availableStudents.some(s => s.id === student.id)) {
      setAvailableStudents(prev => [...prev, student]);
    }
  };
  
  const removeStudentFromList = (student: Student) => {
    setAvailableStudents(prev => prev.filter(s => s.id !== student.id));
  };
  
  // Text board functions
  const handleBoardTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBoardText(e.target.value);
  };
  
  const handleCopyText = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      document.execCommand('copy');
      // Modern way to copy
      navigator.clipboard.writeText(boardText)
        .then(() => {
          alert("Text copied to clipboard!");
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    }
  };
  
  const handleResetText = () => {
    setBoardText("");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Classroom Board</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Countdown Timer Section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Countdown Timer</h2>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={inputTime}
                  onChange={handleTimeChange}
                  placeholder="HH:MM:SS"
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleTimeSubmit}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Set
                </button>
              </div>
              
              <div className="bg-gray-100 p-8 rounded-lg flex justify-center">
                <span className="text-5xl font-bold font-mono">{time}</span>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleStartTimer}
                  disabled={isRunning}
                  className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    isRunning 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-400'
                  }`}
                >
                  Start
                </button>
                <button
                  onClick={handleStopTimer}
                  disabled={!isRunning}
                  className={`px-6 py-2 rounded-md focus:outline-none focus:ring-2 ${
                    !isRunning 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-400'
                  }`}
                >
                  Stop
                </button>
                <button
                  onClick={handleResetTimer}
                  className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* Student Selector Section */}
          <section className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Random Student Selector</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <button
                  onClick={addAllStudents}
                  disabled={fetchingStudents}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  Add All Students
                </button>
                <button
                  onClick={clearStudentList}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Clear List
                </button>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 h-48 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Available Students: {availableStudents.length}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {availableStudents.map(student => (
                    <div 
                      key={student.id}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <span className="truncate">{student.userFullName}</span>
                      <button
                        onClick={() => removeStudentFromList(student)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-md p-4 h-48 overflow-y-auto">
                <h3 className="text-sm font-medium text-gray-600 mb-2">All Students</h3>
                <div className="grid grid-cols-2 gap-2">
                  {students.map(student => (
                    <div 
                      key={student.id}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >
                      <span className="truncate">{student.userFullName}</span>
                      <button
                        onClick={() => addStudentToList(student)}
                        className="text-green-500 hover:text-green-700"
                        disabled={availableStudents.some(s => s.id === student.id)}
                      >
                        +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <button
                  onClick={selectRandomStudent}
                  disabled={isSelecting || availableStudents.length === 0}
                  className={`px-6 py-3 rounded-lg text-white font-medium focus:outline-none focus:ring-2 ${
                    isSelecting || availableStudents.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-400'
                  }`}
                >
                  {isSelecting ? 'Selecting...' : 'Get Random Student'}
                </button>
                
                <div className="h-24 flex items-center justify-center w-full">
                  <AnimatePresence mode="wait">
                    {selectedStudent && (
                      <motion.div
                        key={selectedStudent.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg shadow-lg"
                      >
                        <h3 className="text-xl font-bold text-center">{selectedStudent.userFullName}</h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Right Column - Text Board */}
        <section className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Board</h2>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleCopyText}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Copy
            </button>
            <button
              onClick={handleResetText}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Reset
            </button>
          </div>
          
          <textarea
            ref={textAreaRef}
            value={boardText}
            onChange={handleBoardTextChange}
            className="flex-1 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Type or paste text here..."
          />
        </section>
      </div>
    </main>
  );
}
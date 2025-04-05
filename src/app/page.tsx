'use client';

import { useEffect, useState } from 'react';
import SideBar from '@/components/SideBar';
import { getAllUsers, getAllStudents, getAllTeachers, getAttendanceLists, getVocabLists } from '@/utils/api';

export default function Home() {
  const [userCount, setUserCount] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const [teacherCount, setTeacherCount] = useState<number>(0);
  const [attendanceCount, setAttendanceCount] = useState<number>(0);
  const [vocabCount, setVocabCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, studentsResponse, teachersResponse, attendanceResponse, vocabResponse] = await Promise.all([
          getAllUsers(),
          getAllStudents(),
          getAllTeachers(),
          getAttendanceLists(),
          getVocabLists()
        ]);

        setUserCount(usersResponse.data.length);
        console.log(usersResponse.data);
        setStudentCount(studentsResponse.data.length);
        setTeacherCount(teachersResponse.data.length);
        setAttendanceCount(attendanceResponse.data.length);
        setVocabCount(vocabResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <SideBar />
      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold mb-6">Class Helper Admin Dashboard</h1>
        <div className="max-w-4xl w-full bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-700">Users</h3>
              <p className="text-2xl font-bold mt-2">{loading ? '--' : userCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total registered users</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-700">Students</h3>
              <p className="text-2xl font-bold mt-2">{loading ? '--' : studentCount}</p>
              <p className="text-sm text-gray-500 mt-1">Active students</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-700">Teachers</h3>
              <p className="text-2xl font-bold mt-2">{loading ? '--' : teacherCount}</p>
              <p className="text-sm text-gray-500 mt-1">Staff members</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="border rounded-lg divide-y">
              <div className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Attendance list created</p>
                  <p className="text-xs text-gray-500">Total: {loading ? '--' : attendanceCount}</p>
                </div>
              </div>
              <div className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">New vocabulary list created</p>
                  <p className="text-xs text-gray-500">Total: {loading ? '--' : vocabCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
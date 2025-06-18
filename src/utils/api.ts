import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || ({} as AxiosRequestHeaders);
    config.headers["Authorization"] = "Bearer " + token;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear auth data
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");

      // Save current path for redirection after login
      const currentPath = window.location.pathname;
      sessionStorage.setItem("redirectAfterLogin", currentPath);

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
// Authentication endpoints
export const register = (data: Record<string, unknown>) =>
  api.post("/auth/register", data);
export const login = (data: Record<string, unknown>) =>
  api.post("/auth/login", data);
export const logout = () => api.post("/auth/logout");

// Student endpoints
export const getAllStudents = () => api.get("/student/all");
export const searchStudents = (q: string) => api.get(`/student/search?q=${q}`);
export const getStudentById = (id: number) => api.get(`/student/${id}`);
export const createStudent = (data: Record<string, unknown>) =>
  api.post("/student", data);
export const updateStudent = (id: number, data: Record<string, unknown>) =>
  api.put(`/student/${id}`, data);
export const deleteStudent = (id: number) => api.delete(`/student/${id}`);
export const getStudentByUserId = (userId: number) =>
  api.get(`/student/user/${userId}`);
export const sortStudentsBy = (column: string, order: string) =>
  api.get(`/student/sort?column=${column}&order=${order}`);
export const searchStudentsBy = (q: string) =>
  api.get(`/student/search?q=${q}`);
export const addPoint = (id: number, data: { point: number }) =>
  api.put(`/student/updatePoint/${id}`, data);
export const modifyHeart = (id: number, data: { heart: number }) =>
  api.put(`/student/updateHeart/${id}`, data);
export const modifyLevel = (id: number, data: { level: number }) =>
  api.put(`/student/updateLevel/${id}`, data);

// Teacher endpoints
export const getAllTeachers = () => api.get("/teacher/all");
export const getTeacherById = (id: number) => api.get(`/teacher/${id}`);
export const createTeacher = (data: Record<string, unknown>) =>
  api.post("/teacher", data);
export const updateTeacher = (id: number, data: Record<string, unknown>) =>
  api.put(`/teacher/${id}`, data);
export const deleteTeacher = (id: number) => api.delete(`/teacher/${id}`);
export const getTeacherByCurrentUser = () => api.get("/teacher/current");
export const searchTeachers = (q: string) => api.get(`/teacher/search?q=${q}`);
export const sortTeachersBy = (column: string, order: string) =>
  api.get(`/teacher/sort?column=${column}&order=${order}`);

// Attendance List endpoints
export const getAttendanceListById = (id: number) =>
  api.get(`/attendanceList/${id}`);
export const getAllAttendanceList = () => api.get("/attendanceList/all");
export const createAttendanceList = (data: Record<string, unknown>) =>
  api.post("/attendanceList", data);
export const getAttendanceLists = () => api.get("/attendanceList/all");
export const getAttendanceListsByTeacherId = (id: number) =>
  api.get(`/attendanceList/teacher/${id}`);
export const updateAttendanceList = (
  id: number,
  data: Record<string, unknown>
) => api.put(`/attendanceList/${id}`, data);
export const deleteAttendanceList = (id: number) =>
  api.delete(`/attendanceList/${id}`);
export const searchAttendanceList = (q: string) =>
  api.get(`/attendanceList/search?query=${q}`);
export const sortAttendanceListsBy = (column: string, order: string) =>
  api.get(`/attendanceList/sort?column=${column}&order=${order}`);

// Attendance Record endpoints
export const getAttendanceRecordById = (id: number) =>
  api.get(`/attendanceRecord/${id}`);
export const createAttendanceRecord = (
  listId: number,
  studentId: number,
  data: Record<string, unknown>
) => api.post(`/attendanceRecord/list/${listId}/student/${studentId}`, data);
export const getAttendanceRecordsByListId = (id: number) =>
  api.get(`/attendanceRecord/list/${id}`);
export const getAttendanceRecordsByStudentId = (id: number) =>
  api.get(`/attendanceRecord/student/${id}`);
export const updateAttended = (id: number, data: Record<string, unknown>) =>
  api.put(`/attendanceRecord/record/${id}`, data);
export const deleteAttendanceRecord = (id: number) =>
  api.delete(`/attendanceRecord/${id}`);

// Vocabulary List endpoints
export const getVocabListById = (id: number) => api.get(`/vocabList/${id}`);
export const getAllVocabLists = () => api.get("/vocabList/all");
export const createVocabList = (data: Record<string, unknown>) =>
  api.post("/vocabList", data);
export const getVocabLists = () => api.get("/vocabList/all");
export const updateVocabList = (id: number, data: Record<string, unknown>) =>
  api.put(`/vocabList/${id}`, data);
export const deleteVocabList = (id: number) => api.delete(`/vocabList/${id}`);
export const searchVocabList = (q: string) =>
  api.get(`/vocabList/search?query=${q}`);
export const sortVocabListsBy = (column: string, order: string) =>
  api.get(`/vocabList/sort?column=${column}&order=${order}`);

// Vocabulary endpoints
export const getVocabById = (id: number) => api.get(`/vocab/${id}`);
export const getAllVocabs = () => api.get("/vocab/all");
export const createVocab = (listId: number, data: Record<string, unknown>) =>
  api.post(`/vocab/list/${listId}`, data);
export const getVocabByListId = (id: number) => api.get(`/vocab/list/${id}`);
export const updateVocab = (id: number, data: Record<string, unknown>) =>
  api.put(`/vocab/${id}`, data);
export const deleteVocab = (id: number) => api.delete(`/vocab/${id}`);
export const searchVocabViaListId = (id: number, query: string) =>
  api.get(`/vocab/list/${id}/search?query=${query}`);
export const sortVocabViaListId = (id: number, column: string, order: string) =>
  api.get(`/vocab/list/${id}/sort?column=${column}&order=${order}`);

// Registration List endpoints
export const getRegistrationListById = (id: number) =>
  api.get(`/registrationList/${id}`);
export const addRegistrationList = (data: Record<string, unknown>) =>
  api.post("/registrationList", data);
export const getRegistrationLists = () => api.get("/registrationList/all");
export const getRegistrationListByUsername = () => api.get("/registrationList");
export const updateRegistrationList = (
  id: number,
  data: Record<string, unknown>
) => api.put(`/registrationList/${id}`, data);
export const deleteRegistrationList = (id: number) =>
  api.delete(`/registrationList/${id}`);
export const isUserAllowedRegistration = () =>
  api.get("/registrationList/checkRegister");
export const searchRegistrationList = (q: string) =>
  api.get(`/registrationList/search?query=${q}`);
export const sortRegistrationList = (column: string, order: string) =>
  api.get(`/registrationList/sort?column=${column}&order=${order}`);

// Role endpoints
export const getRoleById = (id: number) => api.get(`/role/${id}`);
export const getRoleByName = () => api.get("/role");
export const getRoles = () => api.get("/role/all");

// User endpoints
export const getUserById = (id: number) => api.get(`/user/${id}`);
export const createUser = (data: Record<string, unknown>) =>
  api.post("/user", data);
export const updateUser = (id: number, data: Record<string, unknown>) =>
  api.put(`/user/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/user/${id}`);
export const updateUserRole = (id: number, data: Record<string, unknown>) =>
  api.put(`/user/${id}/role`, data);
export const getUserByUsername = () => api.get("/user");
export const getAllUsers = () => api.get("/user/all");
export const searchUsers = (query: string) =>
  api.get(`/user/search?query=${query}`);
export const sortUsers = (column: string, order: string) =>
  api.get(`/user/sort?column=${column}&order=${order}`);

// Salary List endpoints
export const getSalaryListById = (id: number) => api.get(`/salaryList/${id}`);
export const getAllSalaryLists = () => api.get("/salaryList/all");
export const createSalaryList = (data: Record<string, unknown>) =>
  api.post("/salaryList", data);
export const updateSalaryList = (id: number, data: Record<string, unknown>) =>
  api.put(`/salaryList/${id}`, data);
export const deleteSalaryList = (id: number) => api.delete(`/salaryList/${id}`);
export const searchSalaryList = (q: string) =>
  api.get(`/salaryList/search?query=${q}`);
export const sortSalaryListsBy = (column: string, order: string) =>
  api.get(`/salaryList/sort?column=${column}&order=${order}`);

// Salary record endpoints
export const getSalaryRecordById = (id: number) =>
  api.get(`/salaryRecord/${id}`);
export const getAllSalaryRecords = () => api.get("/salaryRecord/all");
export const createSalaryRecord = (
  listId: number,
  data: Record<string, unknown>
) => api.post(`/salaryRecord/list/${listId}`, data);
export const updateSalaryRecord = (id: number, data: Record<string, unknown>) =>
  api.put(`/salaryRecord/${id}`, data);
export const deleteSalaryRecord = (id: number) =>
  api.delete(`/salaryRecord/${id}`);
export const getSalaryRecordsByListId = (id: number) =>
  api.get(`/salaryRecord/list/${id}`);
export const searchSalaryRecords = (q: string) =>
  api.get(`/salaryRecord/search?query=${q}`);
export const sortSalaryRecordsBy = (column: string, order: string) =>
  api.get(`/salaryRecord/sort?column=${column}&order=${order}`);
export const updatePaymentStatus = (
  id: number,
  data: Record<string, unknown>
) => api.put(`/salaryRecord/paymentStatus/record/${id}`, data);

export default api;

import api from '../lib/apiClient';
import { Student, Teacher, Group, StudentRating, MadrasaStats } from '../types';

export const madrasaService = {
  // Students
  getStudents: async (params?: { q?: string; groupId?: string }) => {
    const res = await api.get('/api/students', { params });
    return res.data.students as Student[];
  },
  getStudentById: async (id: string) => {
    const res = await api.get(`/api/students/${id}`);
    return res.data.student as Student;
  },
  createStudent: async (student: Partial<Student>) => {
    const res = await api.post('/api/students', student);
    return res.data.student as Student;
  },
  updateStudent: async (id: string, student: Partial<Student>) => {
    const res = await api.put(`/api/students/${id}`, student);
    return res.data.student as Student;
  },
  deleteStudent: async (id: string) => {
    const res = await api.delete(`/api/students/${id}`);
    return res.data;
  },

  // Teachers
  getTeachers: async (params?: { q?: string }) => {
    const res = await api.get('/api/teachers', { params });
    return res.data.teachers as Teacher[];
  },
  getTeacherById: async (id: string) => {
    const res = await api.get(`/api/teachers/${id}`);
    return res.data.teacher as Teacher;
  },
  createTeacher: async (teacher: Partial<Teacher> & { groupIds?: string[] }) => {
    const res = await api.post('/api/teachers', teacher);
    return res.data.teacher as Teacher;
  },
  updateTeacher: async (id: string, teacher: Partial<Teacher> & { groupIds?: string[] }) => {
    const res = await api.put(`/api/teachers/${id}`, teacher);
    return res.data.teacher as Teacher;
  },
  deleteTeacher: async (id: string) => {
    const res = await api.delete(`/api/teachers/${id}`);
    return res.data;
  },

  // Groups
  getGroups: async (params?: { q?: string }) => {
    const res = await api.get('/api/groups', { params });
    return res.data.groups as Group[];
  },
  getGroupById: async (id: string) => {
    const res = await api.get(`/api/groups/${id}`);
    return res.data.group as Group;
  },
  createGroup: async (group: Partial<Group> & { teacherIds?: string[] }) => {
    const res = await api.post('/api/groups', group);
    return res.data.group as Group;
  },
  updateGroup: async (id: string, group: Partial<Group> & { teacherIds?: string[] }) => {
    const res = await api.put(`/api/groups/${id}`, group);
    return res.data.group as Group;
  },
  deleteGroup: async (id: string) => {
    const res = await api.delete(`/api/groups/${id}`);
    return res.data;
  },

  // Ratings
  getRatings: async (params?: { studentId?: string; groupId?: string; month?: string }) => {
    const res = await api.get('/api/ratings', { params });
    return res.data.ratings as StudentRating[];
  },
  createRating: async (rating: any) => {
    const res = await api.post('/api/ratings', rating);
    return res.data.rating as StudentRating;
  },
  updateRating: async (id: string, rating: any) => {
    const res = await api.put(`/api/ratings/${id}`, rating);
    return res.data.rating as StudentRating;
  },
  deleteRating: async (id: string) => {
    const res = await api.delete(`/api/ratings/${id}`);
    return res.data;
  },

  // Stats
  getStats: async () => {
    const res = await api.get('/api/stats');
    return res.data.stats as MadrasaStats;
  }
};

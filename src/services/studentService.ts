/**
 * Student Academic & Profile Service
 * Madrassa Management Information System (MIS)
 */

import apiClient from "./apiClient";

export interface StudentAcademicRecord {
  isAssigned: boolean;
  studentId: string | null;
  rollNo: string | null;
  department: string | null;
  darja: string | null;
  monthlyFee: number | null;
  admissionDate: string | null;
  cnicFormB: string | null;
}

export interface StudentProfileData {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  address: string | null;
  guardianName: string | null;
  role: string;
  createdAt?: string;
  academic: StudentAcademicRecord;
}

export interface UpdateStudentProfilePayload {
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  guardianName?: string;
}

export class StudentService {
  /**
   * Fetches the authenticated student's real database profile
   */
  public static async getProfile(): Promise<StudentProfileData> {
    return apiClient.get<StudentProfileData>("/api/student/profile");
  }

  /**
   * Updates permitted personal student fields in PostgreSQL
   */
  public static async updateProfile(
    payload: UpdateStudentProfilePayload
  ): Promise<StudentProfileData> {
    return apiClient.put<StudentProfileData>("/api/student/profile", payload);
  }
}

export default StudentService;

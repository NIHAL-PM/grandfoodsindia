import { supabase } from '@/integrations/supabase/client';

// ============= COURSES =============
export interface Course {
  id: string;
  title: string;
  description: string | null;
  trainer_id: string | null;
  capacity: number | null;
  start_at: string | null;
  end_at: string | null;
  price: number;
  status: 'active' | 'draft' | 'archived';
  thumbnail_url: string | null;
  created_at: string;
}

export async function getCoursesByTrainer(trainerId: string) {
  const { data, error } = await (supabase as any)
    .from('courses')
    .select('*')
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createCourse(courseData: Partial<Course>) {
  const { data, error } = await (supabase as any)
    .from('courses')
    .insert(courseData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= ENROLLMENTS =============
export async function getEnrolledCoursesByStudent(studentId: string) {
  const { data, error } = await (supabase as any)
    .from('course_enrollments')
    .select(`
      *,
      courses(*),
      profiles(*)
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getStudentsByCourse(courseId: string) {
  const { data, error } = await (supabase as any)
    .from('course_enrollments')
    .select(`
      *,
      profiles(*)
    `)
    .eq('course_id', courseId)
    .order('enrolled_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function enrollStudent(courseId: string, studentId: string) {
  const { data, error } = await (supabase as any)
    .from('course_enrollments')
    .insert({ course_id: courseId, student_id: studentId })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= CLASSES =============
export interface Class {
  id: string;
  course_id: string;
  title: string | null;
  starts_at: string;
  ends_at: string;
  location: string | null;
  meet_link: string | null;
  is_cancelled: boolean;
  created_at: string;
}

export async function getClassesByCourse(courseId: string) {
  const { data, error } = await (supabase as any)
    .from('classes')
    .select('*')
    .eq('course_id', courseId)
    .order('starts_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createClass(classData: {
  course_id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location?: string;
  meet_link?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('classes')
    .insert(classData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= ASSIGNMENTS =============
export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  instructions: string | null;
  due_at: string | null;
  created_by: string | null;
  created_at: string;
}

export async function getAssignmentsByCourse(courseId: string) {
  const { data, error } = await (supabase as any)
    .from('assignments')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getAssignmentsForStudent(studentId: string) {
  // First get enrolled course IDs
  const { data: enrollments, error: enrollmentError } = await (supabase as any)
    .from('course_enrollments')
    .select('course_id')
    .eq('student_id', studentId);
  
  if (enrollmentError) throw enrollmentError;
  if (!enrollments || enrollments.length === 0) return [];
  
  const courseIds = enrollments.map((e: any) => e.course_id);
  
  // Then get assignments for those courses
  const { data, error } = await (supabase as any)
    .from('assignments')
    .select(`
      *,
      courses(title),
      submissions(*)
    `)
    .in('course_id', courseIds)
    .order('due_at', { ascending: true });
  
  if (error) throw error;
  return data;
}

export async function createAssignment(assignmentData: Partial<Assignment>) {
  const { data, error } = await (supabase as any)
    .from('assignments')
    .insert(assignmentData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= SUBMISSIONS =============
export async function getSubmissionsByAssignments(assignmentIds: string[]) {
  if (assignmentIds.length === 0) return [];
  
  const { data, error } = await (supabase as any)
    .from('submissions')
    .select(`
      *,
      profiles(full_name, email)
    `)
    .in('assignment_id', assignmentIds)
    .order('submitted_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function submitAssignment(
  assignmentId: string, 
  studentId: string, 
  fileUrl?: string,
  submissionText?: string
) {
  const { data, error } = await (supabase as any)
    .from('submissions')
    .insert({
      assignment_id: assignmentId,
      student_id: studentId,
      submission_url: fileUrl,
      submission_text: submissionText,
      submitted_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function gradeAssignment(
  submissionId: string,
  grade: number,
  feedback?: string,
  gradedBy?: string
) {
  const { data, error } = await (supabase as any)
    .from('submissions')
    .update({
      grade,
      feedback,
      graded_by: gradedBy,
      graded_at: new Date().toISOString(),
      status: 'graded'
    })
    .eq('id', submissionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= ATTENDANCE =============
export async function getAttendanceByClass(classId: string) {
  const { data, error } = await (supabase as any)
    .from('attendance_logs')
    .select(`
      *,
      profiles(full_name, email)
    `)
    .eq('class_id', classId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getAttendanceByStudent(studentId: string) {
  const { data, error } = await (supabase as any)
    .from('attendance_logs')
    .select(`
      *,
      classes(*),
      courses(title)
    `)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function markAttendance(
  classId: string,
  studentId: string,
  status: string,
  joinedAt?: string,
  leftAt?: string
) {
  const { data, error } = await (supabase as any)
    .from('attendance_logs')
    .upsert({
      class_id: classId,
      student_id: studentId,
      status,
      joined_at: joinedAt,
      left_at: leftAt
    }, { onConflict: 'class_id,student_id' })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= PAYMENTS =============
export async function getPaymentsByStatus(status?: string) {
  let query = (supabase as any)
    .from('payments')
    .select(`
      *,
      profiles(full_name, email, phone)
    `)
    .order('created_at', { ascending: false });
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createPayment(paymentData: {
  user_id?: string;
  method: string;
  amount_cents: number;
  currency: string;
  course_id?: string;
  course_title?: string;
  payer_email?: string;
  payer_name?: string;
  payer_phone?: string;
  screenshot_url?: string;
  notes?: string;
  provider?: string;
  provider_payment_id?: string;
  status?: string;
  plan?: string;
  enrollment_id?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('payments')
    .insert(paymentData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  const { data, error } = await (supabase as any)
    .from('payments')
    .update({ status })
    .eq('id', paymentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= CERTIFICATES =============
export async function getCertificatesByUser(userId: string) {
  const { data, error } = await (supabase as any)
    .from('certificates')
    .select(`
      *,
      courses(title)
    `)
    .eq('user_id', userId)
    .order('issued_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createCertificate(certificateData: {
  user_id: string;
  course_id?: string;
  code: string;
  pdf_url?: string;
  qr_url?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('certificates')
    .insert(certificateData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= CONSULTATIONS =============
export async function getConsultationsByTrainer(trainerId: string) {
  const { data, error } = await (supabase as any)
    .from('consultations')
    .select(`
      *,
      profiles(full_name, email, phone)
    `)
    .eq('trainer_id', trainerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createConsultation(consultationData: {
  user_id?: string;
  trainer_id?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  call_type?: string;
  requested_date?: string;
  preferred_time?: string;
  timezone?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('consultations')
    .insert(consultationData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateConsultationStatus(consultationId: string, status: string) {
  const { data, error } = await (supabase as any)
    .from('consultations')
    .update({ status })
    .eq('id', consultationId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= PROFILES =============
export async function getProfile(userId: string) {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: Partial<{
  full_name: string;
  phone: string;
  whatsapp: string;
  must_change_password: boolean;
}>) {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// ============= FILE UPLOAD =============
export async function uploadFile(bucket: string, filePath: string, file: File) {
  const { data, error } = await (supabase as any).storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  return data;
}

export async function getFileUrl(bucket: string, filePath: string) {
  const { data } = (supabase as any).storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
}

export async function listCourseMaterials(courseId: string) {
  const { data, error } = await (supabase as any).storage
    .from('materials')
    .list(`${courseId}/`, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
  
  if (error) throw error;
  return data;
}

// ============= ADMIN FUNCTIONS =============
export async function getAdminStats() {
  const { data, error } = await (supabase as any)
    .rpc('get_admin_stats');
  
  if (error) throw error;
  return data;
}

export async function getTrainerStats(trainerId: string) {
  const { data, error } = await (supabase as any)
    .rpc('get_trainer_stats', { p_trainer_id: trainerId });
  
  if (error) throw error;
  return data;
}

// ============= ADDITIONAL ADMIN FUNCTIONS =============
export async function getAdminStudents() {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getAdminTrainers() {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('*')
    .eq('role', 'trainer')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getTrainerApplications() {
  const { data, error } = await (supabase as any)
    .from('consultations')
    .select('*')
    .eq('call_type', 'trainer_application')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function getAllCertificatesAdmin() {
  const { data, error } = await (supabase as any)
    .from('certificates')
    .select(`
      *,
      profiles(full_name, email),
      courses(title)
    `)
    .order('issued_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function provisionUserFromPayment(paymentId: string) {
  const { data, error } = await (supabase as any)
    .functions.invoke('provision-user', {
      body: { payment_id: paymentId }
    });
  
  if (error) throw error;
  return data;
}

export async function uploadBlob(bucket: string, path: string, blob: Blob, options?: { contentType?: string }) {
  const uploadOptions: any = {
    cacheControl: '3600',
    upsert: true
  };
  
  if (options?.contentType) {
    uploadOptions.contentType = options.contentType;
  }

  const { data, error } = await (supabase as any).storage
    .from(bucket)
    .upload(path, blob, uploadOptions);
  
  if (error) throw error;
  return data;
}
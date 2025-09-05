import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import * as api from '@/lib/supabase-api'
import { useToast } from '@/components/ui/use-toast'

// Course hooks
export function useCourses() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['courses', user?.id],
    queryFn: () => api.getCoursesByTrainer(user?.id || ''),
    enabled: !!user
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      toast({ title: 'Course created successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating course',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Student hooks
export function useStudents(courseId?: string) {
  return useQuery({
    queryKey: ['students', courseId],
    queryFn: () => api.getStudentsByCourse(courseId || ''),
    enabled: !!courseId
  })
}

export function useEnrollStudent() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: string; studentId: string }) =>
      api.enrollStudent(courseId, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      toast({ title: 'Student enrolled successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error enrolling student',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Class hooks
export function useClasses(courseId?: string) {
  return useQuery({
    queryKey: ['classes', courseId],
    queryFn: () => api.getClassesByCourse(courseId || ''),
    enabled: !!courseId
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] })
      toast({ title: 'Class created successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating class',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Assignment hooks
export function useAssignments(courseId?: string) {
  return useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => api.getAssignmentsByCourse(courseId || ''),
    enabled: !!courseId
  })
}

export function useCreateAssignment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      toast({ title: 'Assignment created successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating assignment',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

export function useSubmitAssignment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ assignmentId, studentId, fileUrl }: { 
      assignmentId: string; 
      studentId: string; 
      fileUrl?: string 
    }) => api.submitAssignment(assignmentId, studentId, fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      toast({ title: 'Assignment submitted successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error submitting assignment',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

export function useGradeAssignment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ submissionId, grade, feedback, gradedBy }: { 
      submissionId: string; 
      grade: number; 
      feedback?: string;
      gradedBy?: string;
    }) => api.gradeAssignment(submissionId, grade, feedback, gradedBy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] })
      toast({ title: 'Assignment graded successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error grading assignment',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Attendance hooks
export function useAttendance(classId?: string) {
  return useQuery({
    queryKey: ['attendance', classId],
    queryFn: () => api.getAttendanceByClass(classId || ''),
    enabled: !!classId
  })
}

export function useMarkAttendance() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ classId, studentId, status, joinedAt, leftAt }: { 
      classId: string; 
      studentId: string; 
      status: string;
      joinedAt?: string;
      leftAt?: string;
    }) => api.markAttendance(classId, studentId, status, joinedAt, leftAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      toast({ title: 'Attendance marked successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error marking attendance',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Payment hooks
export function usePayments(status?: string) {
  return useQuery({
    queryKey: ['payments', status],
    queryFn: () => api.getPaymentsByStatus(status)
  })
}

export function useCreatePayment() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast({ title: 'Payment record created successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating payment',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ paymentId, status }: { paymentId: string; status: string }) =>
      api.updatePaymentStatus(paymentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
      toast({ title: 'Payment status updated successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating payment status',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Certificate hooks
export function useCertificates() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: () => api.getCertificatesByUser(user?.id || ''),
    enabled: !!user
  })
}

export function useCreateCertificate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] })
      toast({ title: 'Certificate created successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating certificate',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Consultation hooks
export function useConsultations() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['consultations', user?.id],
    queryFn: () => api.getConsultationsByTrainer(user?.id || ''),
    enabled: !!user
  })
}

export function useCreateConsultation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: api.createConsultation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      toast({ title: 'Consultation scheduled successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error scheduling consultation',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

export function useUpdateConsultationStatus() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ consultationId, status }: { consultationId: string; status: string }) =>
      api.updateConsultationStatus(consultationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['consultations'] })
      toast({ title: 'Consultation updated successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating consultation',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// Profile hooks
export function useProfile() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => api.getProfile(user?.id || ''),
    enabled: !!user
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useAuth()
  
  return useMutation({
    mutationFn: (updates: any) => api.updateProfile(user?.id || '', updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast({ title: 'Profile updated successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}

// File upload hook
export function useFileUpload() {
  const { toast } = useToast()
  
  return useMutation({
    mutationFn: ({ bucket, filePath, file }: { bucket: string; filePath: string; file: File }) =>
      api.uploadFile(bucket, filePath, file),
    onSuccess: () => {
      toast({ title: 'File uploaded successfully' })
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error uploading file',
        description: error.message,
        variant: 'destructive'
      })
    }
  })
}
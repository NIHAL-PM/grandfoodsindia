import { supabase } from '@/integrations/supabase/client'

export type DbCourse = {
  id: string
  title: string
  description: string | null
  trainer_id: string | null
  status: 'active' | 'draft' | 'archived'
  thumbnail_url: string | null
  price: number | null
  duration: string | null
  format: string | null
  level: string | null
  category: string | null
  features: string[] | null
  highlights: string[] | null
  instructor: string | null
  rating: number | null
  students: number | null
}

export async function fetchCourses(): Promise<DbCourse[]> {
  // Fetch courses with trainer information
  const { data, error } = await (supabase as any)
    .from('courses')
    .select(`
      *, 
      profiles!inner(full_name)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map((course: any) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    trainer_id: course.trainer_id,
    status: course.status,
    thumbnail_url: course.thumbnail_url,
    price: course.price,
    duration: course.duration,
    format: course.format || 'Online',
    level: course.level,
    category: course.category || 'General',
    features: course.features || [],
    highlights: course.highlights || [],
    instructor: course.profiles?.full_name || 'Expert Trainer',
    rating: course.rating || 4.5,
    students: course.students || 0,
  }))
}

export async function fetchCourseById(id: string): Promise<DbCourse | null> {
  const { data, error } = await (supabase as any)
    .from('courses')
    .select('id,title,description,trainer_id,status,thumbnail_url')
    .eq('id', id)
    .single()

  if (error) {
    // PostgREST single() returns 406 when not found
    if ((error as any).code === 'PGRST116' || (error as any).code === 'PGRST106' || (error as any).status === 406) return null
    throw error
  }
  return data
}

export type VerifiedCertificate = {
  id: string
  code: string
  user_id: string
  course_id: string | null
  issued_at: string
  pdf_url: string | null
  student_name?: string | null
  course_title?: string | null
}

export async function verifyCertificate(code: string): Promise<VerifiedCertificate | null> {
  // Look up by exact code (case-insensitive)
  const { data, error } = await (supabase as any)
    .from('certificates')
    .select('id, code, user_id, course_id, issued_at, pdf_url')
    .ilike('code', code)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  // Enrich with profile and course titles
  const [profileRes, courseRes] = await Promise.all([
    (supabase as any).from('profiles').select('full_name').eq('id', data.user_id).maybeSingle(),
    data.course_id ? (supabase as any).from('courses').select('title').eq('id', data.course_id).maybeSingle() : Promise.resolve({ data: null })
  ])

  return {
    ...data,
    student_name: (profileRes as any)?.data?.full_name ?? null,
    course_title: (courseRes as any)?.data?.title ?? null,
  }
}

import { supabase } from '@/integrations/supabase/client'

export type TrainerProfileData = {
  id: string
  full_name: string
  email: string
  role: string
  profile_image: string | null
  title: string | null
  specialization: string | null
  bio: string | null
  experience: string | null
  location: string | null
  rating: number | null
  students: number | null
  courses: number | null
  languages: string[] | null
  expertise: string[] | null
  linkedin: string | null
  website: string | null
  phone: string | null
  status: string
  created_at: string
}

export async function getAllTrainers(): Promise<TrainerProfileData[]> {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('id, full_name, email, role, profile_image, title, specialization, bio, experience, location, rating, students, courses, languages, expertise, linkedin, website, phone, status, created_at')
    .eq('role', 'trainer')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map((trainer: any) => ({
    ...trainer,
    rating: trainer.rating || 4.5,
    students: trainer.students || 0,
    courses: trainer.courses || 0,
    languages: trainer.languages || [],
    expertise: trainer.expertise || [],
    title: trainer.title || 'Senior Trainer',
    specialization: trainer.specialization || 'General Training',
    bio: trainer.bio || 'Experienced trainer with expertise in various domains.',
    experience: trainer.experience || '5+ years',
    location: trainer.location || 'Dubai, UAE'
  }))
}

export async function getTrainerById(id: string): Promise<TrainerProfileData | null> {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .select('id, full_name, email, role, profile_image, title, specialization, bio, experience, location, rating, students, courses, languages, expertise, linkedin, website, phone, status, created_at')
    .eq('id', id)
    .eq('role', 'trainer')
    .single()

  if (error) {
    if ((error as any).code === 'PGRST116' || (error as any).code === 'PGRST106' || (error as any).status === 406) return null
    throw error
  }
  
  if (!data) return null
  
  return {
    ...data,
    rating: data.rating || 4.5,
    students: data.students || 0,
    courses: data.courses || 0,
    languages: data.languages || [],
    expertise: data.expertise || [],
    title: data.title || 'Senior Trainer',
    specialization: data.specialization || 'General Training',
    bio: data.bio || 'Experienced trainer with expertise in various domains.',
    experience: data.experience || '5+ years',
    location: data.location || 'Dubai, UAE'
  }
}
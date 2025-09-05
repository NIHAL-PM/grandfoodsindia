-- Fix RLS policies for better access control

-- Allow trainers to view submissions for their courses  
CREATE POLICY "submissions_trainer_read" 
ON public.submissions 
FOR SELECT 
USING (
  assert_password_changed() AND 
  EXISTS (
    SELECT 1 
    FROM assignments a 
    JOIN courses c ON c.id = a.course_id 
    WHERE a.id = submissions.assignment_id 
    AND c.trainer_id = auth.uid()
  )
);

-- Allow admins to view all profiles
CREATE POLICY "profiles_admin_read" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Create helper function for generating signed URLs (security definer)
CREATE OR REPLACE FUNCTION public.get_signed_certificate_url(certificate_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cert_path text;
  signed_url text;
BEGIN
  -- Get certificate path
  SELECT 'certificates/' || certificate_id || '.pdf' INTO cert_path;
  
  -- This would normally call storage API to get signed URL
  -- For now, return the public URL path
  RETURN 'https://hiebcpqintzetltidfjc.supabase.co/storage/v1/object/public/certificates/' || cert_path;
END;
$$;
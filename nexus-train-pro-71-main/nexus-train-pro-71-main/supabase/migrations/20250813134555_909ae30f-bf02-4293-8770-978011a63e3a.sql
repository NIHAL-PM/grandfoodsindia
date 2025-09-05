-- Create missing RLS policies for all tables
-- Enable RLS on tables that don't have it
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create feedback policies
CREATE POLICY "feedback_insert_policy" ON public.feedback FOR INSERT 
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "feedback_read_policy" ON public.feedback FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create certificate policies
CREATE POLICY "certificates_read_own" ON public.certificates FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "certificates_admin_manage" ON public.certificates FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create certificate template policies
CREATE POLICY "certificate_templates_read" ON public.certificate_templates FOR SELECT 
USING (true);

CREATE POLICY "certificate_templates_admin_manage" ON public.certificate_templates FOR ALL 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create assignment template policies
CREATE POLICY "assignment_templates_trainer_manage" ON public.assignment_templates FOR ALL 
USING (auth.uid() = trainer_id)
WITH CHECK (auth.uid() = trainer_id);

CREATE POLICY "assignment_templates_read" ON public.assignment_templates FOR SELECT 
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('trainer', 'admin')));

-- Create sequence for certificate numbering
CREATE SEQUENCE IF NOT EXISTS public.certificate_seq START WITH 1000;

-- Create function to generate certificate codes
CREATE OR REPLACE FUNCTION public.generate_certificate_code()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('public.certificate_seq')::TEXT, 6, '0');
END;
$$;

-- Create function to issue certificates
CREATE OR REPLACE FUNCTION public.issue_certificate(
    p_user_id uuid,
    p_course_id uuid DEFAULT NULL,
    p_course_code text DEFAULT NULL,
    p_issued_by uuid DEFAULT NULL
)
RETURNS TABLE(id uuid, certificate_id text, issued_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_cert_id uuid;
    cert_code text;
BEGIN
    -- Generate certificate code
    cert_code := generate_certificate_code();
    
    -- Insert certificate
    INSERT INTO public.certificates (user_id, course_id, code, issued_at)
    VALUES (p_user_id, p_course_id, cert_code, NOW())
    RETURNING certificates.id INTO new_cert_id;
    
    RETURN QUERY SELECT new_cert_id, cert_code, NOW();
END;
$$;

-- Create function to verify certificates
CREATE OR REPLACE FUNCTION public.verify_certificate_by_code(p_code text)
RETURNS TABLE(
    certificate_id uuid,
    user_id uuid,
    course_id uuid,
    student_name text,
    course_title text,
    issued_at timestamptz,
    pdf_url text,
    is_valid boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        c.id,
        c.user_id,
        c.course_id,
        p.full_name,
        co.title,
        c.issued_at,
        c.pdf_url,
        true as is_valid
    FROM public.certificates c
    LEFT JOIN public.profiles p ON c.user_id = p.id
    LEFT JOIN public.courses co ON c.course_id = co.id
    WHERE c.code = p_code;
$$;

-- Create function to get admin dashboard statistics
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS TABLE(
    total_students bigint,
    total_trainers bigint,
    total_courses bigint,
    total_payments bigint,
    pending_payments bigint,
    verified_payments bigint,
    total_revenue numeric
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        (SELECT COUNT(*) FROM profiles WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM profiles WHERE role = 'trainer') as total_trainers,
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM payments) as total_payments,
        (SELECT COUNT(*) FROM payments WHERE status = 'pending') as pending_payments,
        (SELECT COUNT(*) FROM payments WHERE status = 'verified') as verified_payments,
        (SELECT COALESCE(SUM(amount_cents/100.0), 0) FROM payments WHERE status = 'verified') as total_revenue;
$$;

-- Create function to get trainer dashboard statistics
CREATE OR REPLACE FUNCTION public.get_trainer_stats(p_trainer_id uuid)
RETURNS TABLE(
    total_courses bigint,
    total_students bigint,
    total_classes bigint,
    total_assignments bigint
)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT 
        (SELECT COUNT(*) FROM courses WHERE trainer_id = p_trainer_id) as total_courses,
        (SELECT COUNT(DISTINCT ce.student_id) FROM course_enrollments ce 
         JOIN courses c ON ce.course_id = c.id 
         WHERE c.trainer_id = p_trainer_id) as total_students,
        (SELECT COUNT(*) FROM classes cl 
         JOIN courses c ON cl.course_id = c.id 
         WHERE c.trainer_id = p_trainer_id) as total_classes,
        (SELECT COUNT(*) FROM assignments a 
         JOIN courses c ON a.course_id = c.id 
         WHERE c.trainer_id = p_trainer_id) as total_assignments;
$$;

-- Create storage policies for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
    ('assignments', 'assignments', false),
    ('materials', 'materials', false),
    ('profiles', 'profiles', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for assignments bucket
CREATE POLICY "assignments_upload_policy" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "assignments_read_policy" ON storage.objects FOR SELECT 
USING (bucket_id = 'assignments' AND 
       (auth.uid()::text = (storage.foldername(name))[1] OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('trainer', 'admin'))));

-- Storage policies for materials bucket
CREATE POLICY "materials_trainer_upload" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'materials' AND 
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('trainer', 'admin')));

CREATE POLICY "materials_enrolled_read" ON storage.objects FOR SELECT 
USING (bucket_id = 'materials' AND 
       EXISTS (SELECT 1 FROM course_enrollments ce 
               JOIN courses c ON ce.course_id = c.id 
               WHERE ce.student_id = auth.uid()));

-- Storage policies for profiles bucket  
CREATE POLICY "profiles_upload_own" ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profiles' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "profiles_read_public" ON storage.objects FOR SELECT 
USING (bucket_id = 'profiles');

-- Create trigger for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name, email)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Add updated_at columns where missing and create triggers
DO $$
DECLARE
    table_name text;
    tables_to_update text[] := ARRAY['courses', 'assignments', 'classes', 'profiles'];
BEGIN
    FOREACH table_name IN ARRAY tables_to_update LOOP
        -- Add updated_at column if it doesn't exist
        EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now()', table_name);
        
        -- Create trigger
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON public.%I', table_name, table_name);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at 
                       BEFORE UPDATE ON public.%I 
                       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at()', table_name, table_name);
    END LOOP;
END $$;
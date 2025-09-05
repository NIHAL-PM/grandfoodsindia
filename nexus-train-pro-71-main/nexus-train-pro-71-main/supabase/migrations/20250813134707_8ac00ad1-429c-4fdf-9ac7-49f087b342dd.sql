-- Fix critical security issues identified by the linter

-- Fix auth.users exposure by adding proper RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Fix function search paths by adding security settings
CREATE OR REPLACE FUNCTION public.generate_certificate_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN 'CERT-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(nextval('public.certificate_seq')::TEXT, 6, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.issue_certificate(
    p_user_id uuid,
    p_course_id uuid DEFAULT NULL,
    p_course_code text DEFAULT NULL,
    p_issued_by uuid DEFAULT NULL
)
RETURNS TABLE(id uuid, certificate_id text, issued_at timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
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
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.get_trainer_stats(p_trainer_id uuid)
RETURNS TABLE(
    total_courses bigint,
    total_students bigint,
    total_classes bigint,
    total_assignments bigint
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
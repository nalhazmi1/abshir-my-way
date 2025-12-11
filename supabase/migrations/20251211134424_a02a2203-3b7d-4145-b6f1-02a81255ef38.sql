-- Remove existing public policies
DROP POLICY IF EXISTS "Allow public read access " ON public.visa_applicants;
DROP POLICY IF EXISTS "Allow public insert " ON public.visa_applicants;
DROP POLICY IF EXISTS "Allow public update " ON public.visa_applicants;

-- Create authenticated-only policies
CREATE POLICY "Authenticated users can read visa applicants"
ON public.visa_applicants
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert visa applicants"
ON public.visa_applicants
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update visa applicants"
ON public.visa_applicants
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete visa applicants"
ON public.visa_applicants
FOR DELETE
TO authenticated
USING (true);
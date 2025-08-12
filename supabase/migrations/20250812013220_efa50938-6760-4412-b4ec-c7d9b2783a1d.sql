-- Remove the overly permissive authenticated read policy
DROP POLICY IF EXISTS "Allow authenticated read access to leads" ON public.leads;

-- Create a more restrictive policy that only allows specific admin users to read leads
-- For now, we'll create a policy that requires explicit permission
-- This will block all read access until proper admin roles are implemented
CREATE POLICY "Restrict lead access to authorized personnel only" 
ON public.leads 
FOR SELECT 
TO authenticated
USING (false); -- Temporarily block all access until admin system is implemented

-- Keep the public insert policy for contact form submissions
-- The existing "Allow public insert access to leads" policy remains unchanged

-- Add a comment explaining the security change
COMMENT ON POLICY "Restrict lead access to authorized personnel only" ON public.leads IS 
'Security fix: Blocks unauthorized access to customer data. Admin access should be implemented via user roles system.';
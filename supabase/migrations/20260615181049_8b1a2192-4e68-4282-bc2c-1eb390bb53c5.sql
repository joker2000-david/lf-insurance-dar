-- Hash admin passcode at rest using pgcrypto bcrypt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.admin_settings ADD COLUMN IF NOT EXISTS passcode_hash text;

-- Backfill: hash existing plaintext passcode if not yet hashed
UPDATE public.admin_settings
SET passcode_hash = crypt(passcode, gen_salt('bf', 10))
WHERE passcode_hash IS NULL AND passcode IS NOT NULL;

ALTER TABLE public.admin_settings ALTER COLUMN passcode DROP NOT NULL;
ALTER TABLE public.admin_settings DROP COLUMN passcode;

ALTER TABLE public.admin_settings ALTER COLUMN passcode_hash SET NOT NULL;

-- Security-definer helpers callable only by service_role / edge functions
CREATE OR REPLACE FUNCTION public.verify_admin_passcode(_passcode text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_settings
    WHERE id = 'current'
      AND passcode_hash = crypt(_passcode, passcode_hash)
  );
$$;

CREATE OR REPLACE FUNCTION public.set_admin_passcode(_new_passcode text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  IF _new_passcode IS NULL OR length(_new_passcode) < 4 THEN
    RAISE EXCEPTION 'Passcode must be at least 4 characters';
  END IF;
  INSERT INTO public.admin_settings (id, passcode_hash, updated_at)
  VALUES ('current', crypt(_new_passcode, gen_salt('bf', 10)), now())
  ON CONFLICT (id) DO UPDATE
    SET passcode_hash = EXCLUDED.passcode_hash,
        updated_at = now();
END;
$$;

-- Lock the helpers down: only service_role (used by edge functions) may execute
REVOKE ALL ON FUNCTION public.verify_admin_passcode(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_admin_passcode(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_admin_passcode(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.set_admin_passcode(text) TO service_role;

-- Explicit deny-all policy on admin_settings to satisfy linter (RLS enabled, no policy)
-- The table is only ever accessed via service_role (which bypasses RLS).
CREATE POLICY "Deny all client access to admin_settings"
  ON public.admin_settings
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);
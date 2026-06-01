CREATE TABLE public.admin_settings (
  id text PRIMARY KEY DEFAULT 'current',
  passcode text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.admin_settings TO service_role;

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated => table is unreadable from the client.

INSERT INTO public.admin_settings (id, passcode) VALUES ('current', '0000')
ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.payment_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  card_last4 text NOT NULL,
  card_holder text NOT NULL,
  card_expiry text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own cards" ON public.payment_cards
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own cards" ON public.payment_cards
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own cards" ON public.payment_cards
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

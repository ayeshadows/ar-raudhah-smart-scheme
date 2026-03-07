
-- Create hasanat table to track points and total amount per user
CREATE TABLE public.hasanat (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  total_points integer NOT NULL DEFAULT 0,
  total_amount numeric NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add unique constraint on user_id
ALTER TABLE public.hasanat ADD CONSTRAINT hasanat_user_id_unique UNIQUE (user_id);

-- Enable RLS
ALTER TABLE public.hasanat ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own hasanat" ON public.hasanat
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hasanat" ON public.hasanat
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own hasanat" ON public.hasanat
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function to award 5 hasanat on successful transaction
CREATE OR REPLACE FUNCTION public.award_hasanat_on_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    INSERT INTO public.hasanat (user_id, total_points, total_amount, updated_at)
    VALUES (NEW.user_id, 5, NEW.amount, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_points = hasanat.total_points + 5,
      total_amount = hasanat.total_amount + NEW.amount,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on transactions table
CREATE TRIGGER trigger_award_hasanat
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.award_hasanat_on_transaction();

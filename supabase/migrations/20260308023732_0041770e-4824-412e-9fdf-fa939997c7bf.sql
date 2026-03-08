CREATE POLICY "Users can delete own draft applications" ON public.applications
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id AND status = 'draft');
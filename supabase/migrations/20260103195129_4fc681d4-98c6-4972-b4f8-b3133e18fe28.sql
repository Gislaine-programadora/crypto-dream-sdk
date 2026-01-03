-- Create admin settings table for owner configuration
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_eth_address text NOT NULL,
  auto_withdraw_enabled boolean DEFAULT true,
  min_withdraw_amount numeric DEFAULT 100,
  withdraw_frequency_hours integer DEFAULT 24,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Insert default settings with owner's ETH address
INSERT INTO public.admin_settings (owner_eth_address) 
VALUES ('0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2');

-- Create revenue logs table to track profits from each project
CREATE TABLE public.revenue_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  amount_usd numeric NOT NULL,
  fee_percentage numeric DEFAULT 2.5,
  fee_amount_usd numeric NOT NULL,
  transaction_id uuid REFERENCES public.transactions(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Create withdrawals table to track payouts to owner
CREATE TABLE public.withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_usd numeric NOT NULL,
  amount_eth numeric,
  eth_price_usd numeric,
  tx_hash text,
  to_address text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone
);

-- Enable RLS on all tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;

-- Admin settings - only service role can access (for edge functions)
CREATE POLICY "Service role can manage admin settings"
ON public.admin_settings
FOR ALL
USING (true)
WITH CHECK (true);

-- Revenue logs - viewable by project owners, insertable by service role
CREATE POLICY "Project owners can view their revenue logs"
ON public.revenue_logs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM projects 
  WHERE projects.id = revenue_logs.project_id 
  AND projects.user_id = auth.uid()
));

-- Withdrawals - only service role can manage
CREATE POLICY "Service role can manage withdrawals"
ON public.withdrawals
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to calculate total pending revenue
CREATE OR REPLACE FUNCTION public.get_pending_revenue()
RETURNS numeric
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(SUM(fee_amount_usd), 0)
  FROM revenue_logs
  WHERE created_at > (
    SELECT COALESCE(MAX(created_at), '1970-01-01'::timestamp)
    FROM withdrawals
    WHERE status = 'completed'
  );
$$;

-- Create function to log revenue from transactions
CREATE OR REPLACE FUNCTION public.log_transaction_revenue()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  fee_pct numeric := 2.5;
  fee_amt numeric;
BEGIN
  IF NEW.status = 'confirmed' AND NEW.value IS NOT NULL THEN
    fee_amt := NEW.value * (fee_pct / 100);
    INSERT INTO revenue_logs (project_id, amount_usd, fee_percentage, fee_amount_usd, transaction_id)
    VALUES (NEW.project_id, NEW.value, fee_pct, fee_amt, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-log revenue on confirmed transactions
CREATE TRIGGER on_transaction_confirmed
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION public.log_transaction_revenue();

-- Add updated_at trigger for admin_settings
CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
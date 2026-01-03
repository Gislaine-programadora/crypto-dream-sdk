import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get admin settings
    const { data: settings, error: settingsError } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (settingsError || !settings) {
      console.error('Failed to get admin settings:', settingsError);
      return new Response(JSON.stringify({ error: 'Admin settings not found' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate pending revenue
    const { data: pendingRevenue, error: revenueError } = await supabase
      .rpc('get_pending_revenue');

    if (revenueError) {
      console.error('Failed to get pending revenue:', revenueError);
      return new Response(JSON.stringify({ error: 'Failed to calculate pending revenue' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pendingAmount = Number(pendingRevenue) || 0;

    // Check if we meet minimum withdrawal amount
    if (pendingAmount < settings.min_withdraw_amount) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: `Pending amount ($${pendingAmount.toFixed(2)}) is below minimum ($${settings.min_withdraw_amount})`,
        pending_usd: pendingAmount,
        min_amount: settings.min_withdraw_amount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current ETH price from CoinGecko
    let ethPriceUsd = 3500; // Fallback price
    try {
      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        ethPriceUsd = priceData.ethereum?.usd || ethPriceUsd;
      }
    } catch (e) {
      console.warn('Failed to fetch ETH price, using fallback:', e);
    }

    // Calculate ETH amount
    const ethAmount = pendingAmount / ethPriceUsd;

    // Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('withdrawals')
      .insert({
        amount_usd: pendingAmount,
        amount_eth: ethAmount,
        eth_price_usd: ethPriceUsd,
        to_address: settings.owner_eth_address,
        status: 'pending'
      })
      .select()
      .single();

    if (withdrawalError) {
      console.error('Failed to create withdrawal:', withdrawalError);
      return new Response(JSON.stringify({ error: 'Failed to create withdrawal' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Created withdrawal: $${pendingAmount.toFixed(2)} USD = ${ethAmount.toFixed(6)} ETH to ${settings.owner_eth_address}`);

    // In production, you would integrate with a payment processor or blockchain wallet here
    // For now, we mark it as processing and it would need manual completion or integration
    
    await supabase
      .from('withdrawals')
      .update({ status: 'processing' })
      .eq('id', withdrawal.id);

    return new Response(JSON.stringify({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        amount_usd: pendingAmount,
        amount_eth: ethAmount,
        eth_price_usd: ethPriceUsd,
        to_address: settings.owner_eth_address,
        status: 'processing'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Process withdrawal error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

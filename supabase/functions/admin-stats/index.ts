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

    // Get admin settings (use maybeSingle to avoid error when multiple/no rows)
    const { data: settingsData } = await supabase
      .from('admin_settings')
      .select('*')
      .limit(1);
    
    const settings = settingsData?.[0] || {
      owner_eth_address: '0x297e1984BF7Da594a34E88Ecadf7B47bBbb3A5c2',
      auto_withdraw_enabled: true,
      min_withdraw_amount: 100,
      withdraw_frequency_hours: 24
    };

    // Get total projects
    const { count: totalProjects } = await supabase
      .from('projects')
      .select('*', { count: 'exact', head: true });

    // Get total transactions
    const { count: totalTransactions } = await supabase
      .from('transactions')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('revenue_logs')
      .select('fee_amount_usd');

    const totalRevenue = revenueData?.reduce((sum, r) => sum + Number(r.fee_amount_usd), 0) || 0;

    // Get pending revenue
    const { data: pendingRevenue } = await supabase.rpc('get_pending_revenue');

    // Get total withdrawn
    const { data: withdrawnData } = await supabase
      .from('withdrawals')
      .select('amount_usd')
      .eq('status', 'completed');

    const totalWithdrawn = withdrawnData?.reduce((sum, w) => sum + Number(w.amount_usd), 0) || 0;

    // Get recent withdrawals
    const { data: recentWithdrawals } = await supabase
      .from('withdrawals')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    // Get revenue by project
    const { data: revenueByProject } = await supabase
      .from('revenue_logs')
      .select(`
        project_id,
        fee_amount_usd,
        projects (name)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    // Aggregate revenue by project
    const projectRevenue: Record<string, { name: string; total: number }> = {};
    revenueByProject?.forEach((log: any) => {
      const projectId = log.project_id;
      if (!projectRevenue[projectId]) {
        projectRevenue[projectId] = {
          name: log.projects?.name || 'Unknown',
          total: 0
        };
      }
      projectRevenue[projectId].total += Number(log.fee_amount_usd);
    });

    // Get current ETH price
    let ethPrice = 3500;
    try {
      const priceResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
      if (priceResponse.ok) {
        const priceData = await priceResponse.json();
        ethPrice = priceData.ethereum?.usd || ethPrice;
      }
    } catch (e) {
      console.warn('Failed to fetch ETH price:', e);
    }

    return new Response(JSON.stringify({
      settings,
      stats: {
        total_projects: totalProjects || 0,
        total_transactions: totalTransactions || 0,
        total_revenue_usd: totalRevenue,
        pending_revenue_usd: Number(pendingRevenue) || 0,
        total_withdrawn_usd: totalWithdrawn,
        pending_in_eth: (Number(pendingRevenue) || 0) / ethPrice,
        eth_price_usd: ethPrice
      },
      recent_withdrawals: recentWithdrawals || [],
      revenue_by_project: Object.entries(projectRevenue).map(([id, data]) => ({
        project_id: id,
        project_name: data.name,
        total_revenue: data.total
      }))
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Admin stats error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

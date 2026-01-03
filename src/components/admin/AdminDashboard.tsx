import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  ArrowUpRight,
  Wallet,
  RefreshCw,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminSettings from "./AdminSettings";

interface AdminStats {
  total_projects: number;
  total_transactions: number;
  total_revenue_usd: number;
  pending_revenue_usd: number;
  total_withdrawn_usd: number;
  pending_in_eth: number;
  eth_price_usd: number;
}

interface Withdrawal {
  id: string;
  amount_usd: number;
  amount_eth: number;
  eth_price_usd: number;
  tx_hash: string | null;
  to_address: string;
  status: string;
  created_at: string;
  completed_at: string | null;
}

interface ProjectRevenue {
  project_id: string;
  project_name: string;
  total_revenue: number;
}

interface AdminData {
  settings: {
    owner_eth_address: string;
    auto_withdraw_enabled: boolean;
    min_withdraw_amount: number;
    withdraw_frequency_hours: number;
  };
  stats: AdminStats;
  recent_withdrawals: Withdrawal[];
  revenue_by_project: ProjectRevenue[];
}

const AdminDashboard = () => {
  const [data, setData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar estatísticas",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-withdrawal`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Withdrawal Iniciado",
          description: `$${result.withdrawal.amount_usd.toFixed(2)} USD (${result.withdrawal.amount_eth.toFixed(6)} ETH) sendo processado`,
        });
        fetchStats();
      } else {
        toast({
          title: "Withdrawal não processado",
          description: result.message || result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast({
        title: "Erro",
        description: "Falha ao processar withdrawal",
        variant: "destructive",
      });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" /> Concluído</Badge>;
      case 'processing':
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" /> Processando</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 mr-1" /> Falhou</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground"><Clock className="w-3 h-3 mr-1" /> Pendente</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Gerenciamento de lucros e empresas</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">ETH Price</p>
                <p className="text-lg font-semibold text-primary">${data?.stats.eth_price_usd.toLocaleString()}</p>
              </div>
              <Button variant="outline" onClick={fetchStats}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="glass border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${data?.stats.total_revenue_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data?.stats.total_transactions} transações
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pendente para Saque
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${data?.stats.pending_revenue_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                ≈ {data?.stats.pending_in_eth.toFixed(6)} ETH
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-accent/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sacado
              </CardTitle>
              <Wallet className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${data?.stats.total_withdrawn_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Para {data?.settings.owner_eth_address.slice(0, 10)}...
              </p>
            </CardContent>
          </Card>

          <Card className="glass border-blue-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Empresas Ativas
              </CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {data?.stats.total_projects}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Projetos usando o SDK
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Withdraw Button */}
        <Card className="glass border-primary/20 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Sacar Lucros</h3>
                <p className="text-sm text-muted-foreground">
                  Converter ${data?.stats.pending_revenue_usd.toFixed(2)} USD para ETH e enviar para sua carteira
                </p>
              </div>
              <Button 
                onClick={handleWithdraw} 
                disabled={isWithdrawing || (data?.stats.pending_revenue_usd || 0) < (data?.settings.min_withdraw_amount || 100)}
                size="lg"
                className="gap-2"
              >
                {isWithdrawing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ArrowUpRight className="w-4 h-4" />
                )}
                Sacar Agora
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="withdrawals" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="withdrawals">Histórico de Saques</TabsTrigger>
            <TabsTrigger value="projects">Receita por Projeto</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Histórico de Saques</CardTitle>
                <CardDescription>Todos os saques realizados para sua carteira ETH</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Valor USD</TableHead>
                      <TableHead>Valor ETH</TableHead>
                      <TableHead>Preço ETH</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.recent_withdrawals.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhum saque realizado ainda
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.recent_withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell>
                            {new Date(withdrawal.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="font-medium">
                            ${withdrawal.amount_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            {withdrawal.amount_eth?.toFixed(6)} ETH
                          </TableCell>
                          <TableCell>
                            ${withdrawal.eth_price_usd?.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(withdrawal.status)}
                          </TableCell>
                          <TableCell>
                            {withdrawal.tx_hash ? (
                              <a
                                href={`https://etherscan.io/tx/${withdrawal.tx_hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                {withdrawal.tx_hash.slice(0, 10)}...
                              </a>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects">
            <Card className="glass">
              <CardHeader>
                <CardTitle>Receita por Projeto</CardTitle>
                <CardDescription>Lucros gerados por cada empresa usando o SDK</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Projeto</TableHead>
                      <TableHead className="text-right">Receita Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.revenue_by_project.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                          Nenhuma receita registrada ainda
                        </TableCell>
                      </TableRow>
                    ) : (
                      data?.revenue_by_project.map((project) => (
                        <TableRow key={project.project_id}>
                          <TableCell className="font-medium">{project.project_name}</TableCell>
                          <TableCell className="text-right text-green-400">
                            ${project.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <AdminSettings 
              settings={data?.settings} 
              onUpdate={fetchStats}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

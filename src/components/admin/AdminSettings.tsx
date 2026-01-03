import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Wallet } from "lucide-react";

interface AdminSettingsProps {
  settings?: {
    owner_eth_address: string;
    auto_withdraw_enabled: boolean;
    min_withdraw_amount: number;
    withdraw_frequency_hours: number;
  };
  onUpdate: () => void;
}

const AdminSettings = ({ settings, onUpdate }: AdminSettingsProps) => {
  const [ethAddress, setEthAddress] = useState(settings?.owner_eth_address || "");
  const [autoWithdraw, setAutoWithdraw] = useState(settings?.auto_withdraw_enabled ?? true);
  const [minAmount, setMinAmount] = useState(settings?.min_withdraw_amount?.toString() || "100");
  const [frequency, setFrequency] = useState(settings?.withdraw_frequency_hours?.toString() || "24");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!ethAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast({
        title: "Endereço inválido",
        description: "Por favor, insira um endereço ETH válido",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({
          owner_eth_address: ethAddress,
          auto_withdraw_enabled: autoWithdraw,
          min_withdraw_amount: parseFloat(minAmount),
          withdraw_frequency_hours: parseInt(frequency),
        })
        .eq('id', (await supabase.from('admin_settings').select('id').single()).data?.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso",
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Configurações de Saque
        </CardTitle>
        <CardDescription>
          Configure sua carteira ETH e preferências de saque automático
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="eth-address">Endereço ETH (Mainnet)</Label>
          <Input
            id="eth-address"
            value={ethAddress}
            onChange={(e) => setEthAddress(e.target.value)}
            placeholder="0x..."
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Endereço para receber os lucros convertidos em ETH
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Saque Automático</Label>
            <p className="text-sm text-muted-foreground">
              Sacar automaticamente quando atingir o valor mínimo
            </p>
          </div>
          <Switch
            checked={autoWithdraw}
            onCheckedChange={setAutoWithdraw}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min-amount">Valor Mínimo (USD)</Label>
            <Input
              id="min-amount"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              min="10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequência (horas)</Label>
            <Input
              id="frequency"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              min="1"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;

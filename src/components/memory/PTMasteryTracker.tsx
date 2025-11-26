import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Compass, Layers, MapPin, Church, Calendar, Target } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MasteryStats {
  cycles: Record<string, number>;
  dimensions: Record<string, number>;
  horizons: Record<string, number>;
  sanctuary: Record<string, number>;
  feasts: Record<string, number>;
}

const CYCLE_NAMES: Record<string, string> = {
  "@Ad": "Adamic", "@No": "Noahic", "@Ab": "Abrahamic", "@Mo": "Mosaic",
  "@Cy": "Cyrusic", "@CyC": "Cyrus-Christ", "@Sp": "Spirit", "@Re": "Remnant"
};

export default function PTMasteryTracker() {
  const { user } = useAuth();
  const [mastery, setMastery] = useState<MasteryStats>({
    cycles: {},
    dimensions: {},
    horizons: {},
    sanctuary: {},
    feasts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMastery();
    }
  }, [user]);

  const loadMastery = async () => {
    try {
      const { data, error } = await supabase
        .from('pt_mastery')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      const stats: MasteryStats = {
        cycles: {},
        dimensions: {},
        horizons: {},
        sanctuary: {},
        feasts: {}
      };

      data?.forEach((item) => {
        switch (item.principle_type) {
          case 'cycle':
            stats.cycles[item.principle_code] = item.mastery_level;
            break;
          case 'dimension':
            stats.dimensions[item.principle_code] = item.mastery_level;
            break;
          case 'horizon':
            stats.horizons[item.principle_code] = item.mastery_level;
            break;
          case 'sanctuary':
            stats.sanctuary[item.principle_code] = item.mastery_level;
            break;
          case 'feast':
            stats.feasts[item.principle_code] = item.mastery_level;
            break;
        }
      });

      setMastery(stats);
    } catch (error) {
      console.error('Error loading PT mastery:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>PT Mastery Tracker</CardTitle>
          <CardDescription>Loading your progress...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const calculateOverall = (stats: Record<string, number>) => {
    const values = Object.values(stats);
    return values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  };

  const MasterySection = ({ 
    title, 
    icon: Icon, 
    data, 
    color 
  }: { 
    title: string; 
    icon: any; 
    data: Record<string, number>; 
    color: string;
  }) => {
    const overall = calculateOverall(data);
    const count = Object.keys(data).length;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${color}`} />
            <h4 className="font-medium">{title}</h4>
          </div>
          <Badge variant="secondary">{count} covered</Badge>
        </div>
        <Progress value={overall} className="h-2" />
        <div className="flex flex-wrap gap-2">
          {Object.entries(data).map(([code, level]) => (
            <div key={code} className="text-xs space-y-1">
              <div className="font-medium text-muted-foreground">
                {CYCLE_NAMES[code] || code}
              </div>
              <Progress value={level} className="h-1 w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <CardTitle>PT Mastery Tracker</CardTitle>
        </div>
        <CardDescription>
          Track your coverage across all PT principles
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.keys(mastery.cycles).length > 0 && (
          <MasterySection
            title="Cycles"
            icon={Compass}
            data={mastery.cycles}
            color="text-purple-500"
          />
        )}
        
        {Object.keys(mastery.dimensions).length > 0 && (
          <MasterySection
            title="Dimensions"
            icon={Layers}
            data={mastery.dimensions}
            color="text-blue-500"
          />
        )}
        
        {Object.keys(mastery.horizons).length > 0 && (
          <MasterySection
            title="Horizons"
            icon={MapPin}
            data={mastery.horizons}
            color="text-green-500"
          />
        )}
        
        {Object.keys(mastery.sanctuary).length > 0 && (
          <MasterySection
            title="Sanctuary"
            icon={Church}
            data={mastery.sanctuary}
            color="text-amber-500"
          />
        )}
        
        {Object.keys(mastery.feasts).length > 0 && (
          <MasterySection
            title="Feasts"
            icon={Calendar}
            data={mastery.feasts}
            color="text-rose-500"
          />
        )}

        {Object.keys(mastery.cycles).length === 0 && 
         Object.keys(mastery.dimensions).length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Complete memory games to start tracking your PT mastery!
          </div>
        )}
      </CardContent>
    </Card>
  );
}

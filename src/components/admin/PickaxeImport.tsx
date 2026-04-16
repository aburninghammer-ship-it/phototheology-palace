import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import pickaxeUsers from "@/data/pickaxe-users.json";

interface PickaxeUser {
  email: string;
  name: string | null;
  picture: string | null;
  type: "member" | "paid";
  memories: number;
  spend: number;
  currentUses: number;
  totalUses: number;
  files: number;
  feedback: number;
  activeAt: string;
  createdAt: string;
}

export function PickaxeImport() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);

  const importUsers = async () => {
    setImporting(true);
    setProgress(0);
    setImported(0);

    const users = (pickaxeUsers as { users: PickaxeUser[] }).users;
    const batchSize = 50;
    const totalBatches = Math.ceil(users.length / batchSize);
    let totalImported = 0;

    try {
      for (let i = 0; i < totalBatches; i++) {
        const batch = users.slice(i * batchSize, (i + 1) * batchSize);
        
        const response = await supabase.functions.invoke("pickaxe-sync", {
          body: { users: batch }
        });

        if (response.error) {
          console.error("Batch error:", response.error);
          toast.error(`Batch ${i + 1} failed: ${response.error.message}`);
        } else {
          totalImported += response.data.results.synced;
        }

        setProgress(Math.round(((i + 1) / totalBatches) * 100));
        setImported(totalImported);
      }

      toast.success(`Successfully imported ${totalImported} Pickaxe users!`);
    } catch (error) {
      console.error("Import error:", error);
      toast.error("Failed to import users");
    } finally {
      setImporting(false);
    }
  };

  const totalUsers = (pickaxeUsers as { users: PickaxeUser[] }).users.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import Pickaxe Users
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Found {totalUsers} users in the uploaded Pickaxe data file.
        </p>
        
        {importing ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Importing... {progress}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {imported} users synced so far
            </p>
          </div>
        ) : imported > 0 ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Imported {imported} users successfully!</span>
          </div>
        ) : (
          <Button onClick={importUsers}>
            <Upload className="h-4 w-4 mr-2" />
            Import All Users
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

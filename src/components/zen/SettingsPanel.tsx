import React from 'react';
import { Settings, Trash2, Moon, Sun, AlertTriangle } from 'lucide-react';
import { useTaskStore } from '@/store/taskStore';
import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
export function SettingsPanel() {
  // Zustand selectors (primitives only)
  const isZenMode = useTaskStore((s) => s.isZenMode);
  const toggleZenMode = useTaskStore((s) => s.toggleZenMode);
  const deleteAllTasks = useTaskStore((s) => s.deleteAllTasks);
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const handleReset = async () => {
    await deleteAllTasks();
    toast.success('All data has been reset');
    setOpen(false);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary transition-colors">
          <Settings className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
          <span className="sr-only">Open Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[400px] flex flex-col h-full">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl font-bold">Settings</SheetTitle>
          <SheetDescription>
            Customize your ZenTasks experience.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-8">
          {/* Appearance Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <Label htmlFor="theme-mode" className="font-medium cursor-pointer">
                  Dark Mode
                </Label>
              </div>
              <Switch 
                id="theme-mode" 
                checked={isDark} 
                onCheckedChange={toggleTheme} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <div className="w-4 h-4 border-2 border-current rounded-full opacity-70" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="zen-mode" className="font-medium cursor-pointer block">
                    Zen Mode
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Hide distractions and focus on tasks
                  </p>
                </div>
              </div>
              <Switch 
                id="zen-mode" 
                checked={isZenMode} 
                onCheckedChange={toggleZenMode} 
              />
            </div>
          </div>
          <Separator />
          {/* Data Management Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data</h3>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-5 h-5" />
                    Reset Application Data?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your tasks and reset the application state.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Yes, Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="mt-auto pt-6 text-center text-xs text-muted-foreground">
          <p>ZenTasks v1.0.0</p>
          <p className="mt-1">Built with ❤️ by Aurelia</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
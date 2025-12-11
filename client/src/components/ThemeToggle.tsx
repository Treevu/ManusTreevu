import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-lg"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
          ) : (
            <Sun className="h-5 w-5 text-yellow-400 hover:text-yellow-300 transition-colors" />
          )}
          <span className="sr-only">
            {theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "light" ? "Modo oscuro" : "Modo claro"}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export default ThemeToggle;

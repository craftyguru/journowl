import { createContext, useContext, useEffect, useState } from "react";

type ColorScheme = "light" | "dark";
type VisualStyle = "creative" | "professional";

interface ThemeContextType {
  colorScheme: ColorScheme;
  visualStyle: VisualStyle;
  toggleColorScheme: () => void;
  toggleVisualStyle: () => void;
  setTheme: (colorScheme: ColorScheme, visualStyle: VisualStyle) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("creative");

  useEffect(() => {
    const savedColorScheme = localStorage.getItem("colorScheme") as ColorScheme;
    const savedVisualStyle = localStorage.getItem("visualStyle") as VisualStyle;
    
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }
    if (savedVisualStyle) {
      setVisualStyle(savedVisualStyle);
    }
    
    updateDocumentClasses(savedColorScheme || "light", savedVisualStyle || "creative");
  }, []);

  const updateDocumentClasses = (newColorScheme: ColorScheme, newVisualStyle: VisualStyle) => {
    document.documentElement.className = `${newColorScheme} ${newVisualStyle}`;
  };

  const toggleColorScheme = () => {
    const newColorScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(newColorScheme);
    localStorage.setItem("colorScheme", newColorScheme);
    updateDocumentClasses(newColorScheme, visualStyle);
  };

  const toggleVisualStyle = () => {
    const newVisualStyle = visualStyle === "creative" ? "professional" : "creative";
    setVisualStyle(newVisualStyle);
    localStorage.setItem("visualStyle", newVisualStyle);
    updateDocumentClasses(colorScheme, newVisualStyle);
  };

  const setTheme = (newColorScheme: ColorScheme, newVisualStyle: VisualStyle) => {
    setColorScheme(newColorScheme);
    setVisualStyle(newVisualStyle);
    localStorage.setItem("colorScheme", newColorScheme);
    localStorage.setItem("visualStyle", newVisualStyle);
    updateDocumentClasses(newColorScheme, newVisualStyle);
  };

  return (
    <ThemeContext.Provider value={{ 
      colorScheme, 
      visualStyle, 
      toggleColorScheme, 
      toggleVisualStyle, 
      setTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

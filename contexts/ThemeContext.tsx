import { Colours } from "@/components/constants/Colours";
import { Appearance } from "react-native";
import React, { createContext, useContext, useEffect, useState } from "react";

// set a default theme for a client
const defaultTheme = {
  theme: "light",
  toggleTheme: () => {},
  colours: Colours.light,
};

// create a new context using the default settings
const ThemeContext = createContext(defaultTheme);

// export ThemeProvider, use it to wrap the _layout.tsx stack
export const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(Appearance.getColorScheme() || "light");

  // toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // use Appearance API to listen out for system theme changes
  // chrome devtools > 3dots button > more tools > rendering > emulation > toggle prefers-system-scheme settings to see
  useEffect(() => {
    const themeTracker = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme || "light");
    });
    return () => themeTracker.remove();
  }, []);

  // set the theme for props
  const colours = theme === "light" ? Colours.light : Colours.dark;

  // send the children away
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colours }}>
      {children}
    </ThemeContext.Provider>
  );
};

// custom hook for accessing the theme toggle elsewehere
export const useTheme = () => {
  return useContext(ThemeContext);
};

import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {createContext, useContext, useState} from "react";
import {theme} from "./themes-enum";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({children}) => {
    const [currentTheme, setCurrentTheme] = useState("light");

    const toggleTheme = () => {
        setCurrentTheme(currentTheme === "light" ? "dark" : "light");
    };


    return (
        <ThemeContext.Provider value={{ toggleTheme }}>
            <StyledThemeProvider theme={theme[currentTheme]}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export {ThemeProvider};
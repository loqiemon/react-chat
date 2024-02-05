import {ThemeProvider as StyledThemeProvider} from "styled-components";
import {createContext, useContext, useState} from "react";
import {theme} from "./themes-enum";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const getInitialTheme = () => {
    return localStorage.getItem("theme") || "light";
}

const ThemeProvider = ({children}) => {
    const [currentTheme, setCurrentTheme] = useState(_ => getInitialTheme());

    const toggleTheme = () => {
        const newTheme = currentTheme === "light" ? "dark" : "light"
        localStorage.setItem("theme", newTheme);
        setCurrentTheme(newTheme);
    };


    return (
        <ThemeContext.Provider value={{ toggleTheme, currentTheme }}>
            <StyledThemeProvider theme={theme[currentTheme]}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export {ThemeProvider};
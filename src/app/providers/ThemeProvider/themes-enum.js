export const Themes =  {
    'light': 'light',
    'dark': 'dark',
}

const darkTheme = {
    primary: "#2E2D2D",
    secondary: "#494949",
    text: "#DEDEDE",
    textInverted: "#fff",
    background: "#2E2D2D",
    inputBack: '#2E2D2D'
};

const lightTheme = {
    primary: "#338B63",
    secondary: "#eee",
    text: "#1A1A1A",
    textInverted: "#494949",
    background: "#EBEBEB",
    inputBack: '#DEDEDE'
};

const defaultTheme = {
    fontSize: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
    },
    borderRadius: {
        small: "5px",
        medium: "10px",
        large: "15px",
        circle: "50%",
    },
    common: {
        greenBack: '#338B63',
        textBack: "#FFF",
        messageBack: 'D9D9D9',
        messageText: '000000',
        white: '#fff',
    },
    radius: {
        small: "5px",
        medium: "10px",
        large: "15px",
        circle: "50%",
    }
};

export const theme = {
    dark: {
        color: darkTheme,
        ...defaultTheme,
    },
    light: {
        color: lightTheme,
        ...defaultTheme,
    },
};

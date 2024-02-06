export const Themes =  {
    'light': 'light',
    'dark': 'dark',
}

const darkTheme = {
    dark: true,
    primary: "#2E2D2D",
    secondary: "#494949",
    text: "#DEDEDE",
    textInverted: "#fff",
    background: "#2E2D2D",
    inputBack: '#2E2D2D',

    messengerTitle: "#FFFFFF",
    messengerBackground: "#494949",

    invertedText: '#1A1A1A',
    messagesBack: '#2e2d2d',

    inputBack2: '#494949',
};

const lightTheme = {
    light: true,
    primary: "#338B63",
    secondary: "#eee",
    text: "#1A1A1A",
    textInverted: "#494949",
    background: "#EBEBEB",
    inputBack: '#DEDEDE',
    inputBack2: '#DEDEDE',

    messengerTitle: "#1A1A1A",
    messengerBackground: "#FFFFFF",

    invertedText: '#fff',
    messagesBack: '#ebebeb',
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
        messageBack: '#D9D9D9',
        messageText: '#000000',
        white: '#fff',
        a1: '#1A1A1A'
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

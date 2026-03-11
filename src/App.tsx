// App.jsx
// import React from "react";
import { ThemeProvider } from "styled-components";
import { CssBaseline } from "@mui/material";
import { ChatProvider } from "./contexts/ChatContext";
import ChatBot from "./components/Chat/ChatBot";
// import Header from "./components/Layout/Header";
// import Footer from "./components/Layout/Footer";
import { theme } from "./styles/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ChatProvider>
                <div className="App">
                    {/* <Header /> */}
                    <main style={{ minHeight: "calc(100vh - 140px)" }}>
                        <ChatBot />
                    </main>
                    {/* <Footer /> */}
                </div>
            </ChatProvider>
        </ThemeProvider>
    );
}

export default App;

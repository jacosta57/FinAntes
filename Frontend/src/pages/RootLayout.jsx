import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Navbar from 'components/Navbar/Navbar';
import { context } from 'themeContext'

function RootLayout() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [color, setColor] = useState(localStorage.getItem("color") || "blue");

    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-color", color);

    return (
        <>
            <Navbar />
            <context.Provider value={{ theme, setTheme, color, setColor }}>
                <Outlet />
            </context.Provider>
        </>
    )
}

export default RootLayout;
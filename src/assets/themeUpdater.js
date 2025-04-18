const currentTheme = localStorage.getItem('theme') || 'light';
    const currentColorScheme = localStorage.getItem('colorScheme') || 'blue';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.documentElement.setAttribute('data-color-scheme', currentColorScheme);
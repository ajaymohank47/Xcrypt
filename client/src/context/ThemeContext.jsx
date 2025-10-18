import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme must be used within a ThemeProvider');
    // Return default dark theme to prevent crashes
    return {
      isDarkMode: true,
      toggleTheme: () => {},
      colors: {
        primary: 'bg-black',
        secondary: 'bg-gray-900',
        tertiary: 'bg-gray-800',
        card: 'bg-gray-800',
        cardHover: 'hover:bg-gray-700',
        textPrimary: 'text-white',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-400',
        border: 'border-gray-700',
        borderHover: 'hover:border-blue-500',
        gradient: 'bg-gradient-to-bl from-orange-900 via-black to-black',
        hero: 'bg-gradient-to-bl from-orange-900 via-black to-black',
        footer: 'bg-gray-900',
        footerSecondary: 'bg-gray-800',
        footerText: 'text-white',
        cryptoCard: 'bg-gradient-to-br from-gray-800 to-gray-900',
        transactionCard: 'bg-gradient-to-br from-gray-800 to-gray-900',
        navbar: 'bg-gray-900',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
        buttonSecondary: 'bg-gray-700 hover:bg-gray-600',
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        input: 'bg-gray-800 border-gray-600',
        inputFocus: 'focus:border-blue-500',
      }
    };
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); // Always dark mode

  // Always set to dark mode
  useEffect(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  }, []);

  // Remove toggle functionality - always dark
  const toggleTheme = () => {
    // No-op - theme is always dark
  };

  const theme = {
    isDarkMode: true, // Always dark
    toggleTheme,
    colors: {
      // Background colors - always dark
      primary: 'bg-black',
      secondary: 'bg-gray-900',
      tertiary: 'bg-gray-800',
      
      // Card backgrounds
      card: 'bg-gray-800',
      cardHover: 'hover:bg-gray-700',
      
      // Text colors
      textPrimary: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      
      // Border colors
      border: 'border-gray-700',
      borderHover: 'hover:border-blue-500',
      
      // Gradient backgrounds
      gradient: 'bg-gradient-to-bl from-orange-900 via-black to-black',
      
      // Hero section
      hero: 'bg-gradient-to-bl from-orange-900 via-black to-black',
      
      // Footer
      footer: 'bg-gray-900',
      footerSecondary: 'bg-gray-800',
      footerText: 'text-white',
      
      // Crypto cards
      cryptoCard: 'bg-gradient-to-br from-gray-800 to-gray-900',
      
      // Transaction cards
      transactionCard: 'bg-gradient-to-br from-gray-800 to-gray-900',
      
      // Navbar
      navbar: 'bg-gray-900',
      
      // Buttons
      buttonPrimary: 'bg-blue-600 hover:bg-blue-700',
      buttonSecondary: 'bg-gray-700 hover:bg-gray-600',
      
      // Status colors
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      
      // Input fields
      input: 'bg-gray-800 border-gray-600',
      inputFocus: 'focus:border-blue-500',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
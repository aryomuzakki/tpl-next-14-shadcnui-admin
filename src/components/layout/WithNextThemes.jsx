"use client"

import { ThemeProvider } from "next-themes"

const WithNextThemes = ({ children, ...props }) => {
  return (
    <ThemeProvider {...props}>
      {children}
    </ThemeProvider>
  )
}

export default WithNextThemes
'use client';

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from '../ui/button';

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false)

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode)
        if (isDarkMode) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
    }

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'))
    }, [])

    return (
        <Button
            variant={"ghost"}
            size={"icon"}
            onClick={toggleDarkMode}
            className="group/DarkMode"
        >
            {isDarkMode ? (
                <Moon className="group-hover/DarkMode:rotate-[30deg] duration-300 size-4 lg:size-6" />
            ) : (
                <Sun className="group-hover/DarkMode:rotate-[30deg] duration-300 size-4 lg:size-6" />
            )}
        </Button>
    )
}
"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

// Helper to safely detect client-side mounting without triggering ESLint warnings
const emptySubscribe = () => () => { };
function useHasMounted() {
    return useSyncExternalStore(
        emptySubscribe,
        () => true,  // Client value
        () => false  // Server value
    );
}

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const hasMounted = useHasMounted();

    if (!hasMounted) {
        return <div className="w-10 h-10" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5 text-warning" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
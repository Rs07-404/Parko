"use client";
// import Navbar from '@/components/ui/navbar';
import { CircleUser as AccountCircleIcon, Moon, SunDim } from 'lucide-react';
import { useTheme } from 'next-themes';
// import paths from '@/lib/mainRoutes';
import { useSidebar } from '@/components/ui/sidebar';
import { sniglet } from '@/styles/fonts/Fonts';
import { Button } from '@/components/ui/button';

const Header:React.FC<{children: React.ReactNode}> = ({children}) => {
    const { theme, setTheme } = useTheme();
    const { open } = useSidebar()
    return (
        <div className={`flex fixed top-0 z-10000 w-full ${open ? "border-none" : ""} h-14 items-center px-2 bg-card border-b-2 dark:border-none box-border`}>
            <div className={`flex w-max h-full text-2xl justify-center p-2 ${sniglet.className} items-center gap-1`}>{children}{open ? "Menu" : "Parko"}</div>
            <div className="sm:flex w-full m-auto justify-center items-center">
            {/* <Navbar paths={paths} strictCheck={false} /> */}
            </div>
            <div className="flex self-end gap-2 m-auto w-full sm:w-max h-full justify-end items-center box-border p-4">
            <Button
                        variant="ghost"
                        type="button"
                        className="w-8 h-8 p-0 rounded-full bg-accent/80 hover:bg-accent dark:hover:bg-slate-800 transition-colors duration-200 ease-in-out"
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                        }}
                    >
                        <SunDim className="dark:hidden" />
                        <Moon className="hidden dark:inline" />
                    </Button>
                {/* <ThemeIcon className='cursor-pointer' onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} /> */}
                <AccountCircleIcon /> <div className='sm:flex hidden'>Admin</div>
            </div>
        </div>
    )
}

export default Header;
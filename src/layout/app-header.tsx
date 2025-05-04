"use client";
// import Navbar from '@/components/ui/navbar';
import { CalendarClock, LoaderCircleIcon, LogOut, Moon, SunDim } from 'lucide-react';
import { useTheme } from 'next-themes';
// import paths from '@/lib/mainRoutes';
import { useSidebar } from '@/components/ui/sidebar';
import { sniglet } from '@/styles/fonts/Fonts';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useLogOut from '@/hooks/use-logout';
import Link from 'next/link';
import { IReservation } from '@/interfaces/Generic/IReservation';
import { useEffect, useRef, useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';
import { TicketCard } from '@/components/Reservation/TicketCard';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const { theme, setTheme } = useTheme();
    const { open, isMobile } = useSidebar();
    const { authUser } = useAuthContext();
    const { triggerLogOut, logoutLoading } = useLogOut();
    const [currentReservation, setCurrentReservation] = useState<IReservation | null>(null);
    const [currentReservationLoading, setCurrentReservationLoading] = useState(false);
    // want to show a time passed from booking time in format of 00:00:00 in the header
    const [timePassed, setTimePassed] = useState<string>("00:00:00");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [costOfReservation, setCostOfReservation] = useState<string>("0.00");
    const [showReservation, setShowReservation] = useState(false);

    useEffect(() => {
        // Update the time passed every second
        const interval = setInterval(() => {
            if (currentReservation) {
                const bookingTime = new Date(currentReservation.bookingTime).getTime();
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - bookingTime;
                const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
                const seconds = Math.floor((timeDiff / 1000) % 60);
                // Upto to 2 decimal points of cost to be calculated based on the time the reservation has been active
                // ₹8 is the cost per hour and 18% is the tax rate
                // Consolelog timediff in hours
                console.log("Time Difference in hours:", timeDiff / (1000 * 60 * 60));
                const cost = ((timeDiff / (1000 * 60 * 60)) * 8) * 1.18;
                setCostOfReservation(cost.toFixed(2));
                setTimePassed(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setTimePassed("00:00:00");
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            }
        }, 1000);
        intervalRef.current = interval;
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

    }, [currentReservation]);


    useEffect(() => {
        const fetchCurrentReservation = async () => {
            setCurrentReservationLoading(true);
            try {
                const response = await fetch(`/api/reservation/getcurrent`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "credentials": "include",
                    },

                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Current Reservation Data:", data);
                    setCurrentReservation(data.reservation);
                } else {
                    // console.error("Failed to fetch current reservation");
                }
            } catch (error) {
                console.error("Error fetching current reservation:", error);
            } finally {
                setCurrentReservationLoading(false);
            }
        };

        fetchCurrentReservation();
    }
        , []);

    return (
        <>
            <div className={`flex fixed top-0 z-10000 w-full ${open ? "border-none" : "border-none"} h-14 items-center pr-2 bg-card border-b-2 dark:border-none box-border`}>
                <div className={`flex w-max h-full text-2xl justify-center ${sniglet.className} items-center gap-1`}>{children}{open ? "Menu" : "Parko"}</div>
                <div className="sm:flex w-full m-auto justify-center items-center">
                    {/* <Navbar paths={paths} strictCheck={false} /> */}
                </div>
                <div className="flex self-end gap-2 m-auto w-full sm:w-max h-full justify-end items-center box-border p-4">
                    {currentReservation && <Button
                        variant="ghost"
                        type="button"
                        onClick={() => { setShowReservation(true) }}
                        disabled={currentReservationLoading}
                        className="w-max h-8 p-1 cursor-pointer transition-colors duration-200 ease-in-out">
                        {currentReservationLoading ?
                            <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />
                            :
                            currentReservation ? <div className='flex gap-1 items-center'>
                                <CalendarClock />
                                <div>
                                    <div>{timePassed}</div>
                                    <div>₹{costOfReservation}</div>
                                </div>
                            </div> : "No Current Reservation"}
                    </Button>}
                    <Button
                        variant="ghost"
                        type="button"
                        className="w-8 h-8 p-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out"
                        onClick={() => {
                            setTheme(theme === "dark" ? "light" : "dark");
                        }}
                    >
                        <SunDim className="dark:hidden" />
                        <Moon className="hidden dark:inline" />
                    </Button>
                    <div>
                        <Link href="/profile">
                            <Avatar className='cursor-pointer'>
                                <AvatarImage src={authUser?.profile.image} alt={"profile"} />
                                <AvatarFallback>{(authUser?.profile.firstName[0] ?? "") + (authUser?.profile.lastName[0] ?? "")}</AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>
                    <div className='sm:flex hidden'>{authUser?.profile.firstName}</div>
                    {isMobile &&
                        <Button
                            onClick={triggerLogOut}
                            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {logoutLoading ? <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="w-5 h-5" />}
                        </Button>
                    }
                </div>
            </div>
            <Dialog open={showReservation} onOpenChange={setShowReservation}>
                <DialogContent className='w-full z-auto sm:w-[450px] h-full sm:h-[500px] p-0 m-auto flex flex-col justify-center items-center'>
                    {currentReservation ?
                        <TicketCard reservation={currentReservation} key={currentReservation?._id} />
                        : <div className='flex flex-col items-center justify-center h-full w-full'>
                            <h1 className='text-2xl'>No Current Reservation</h1>
                        </div>
                    }
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Header;
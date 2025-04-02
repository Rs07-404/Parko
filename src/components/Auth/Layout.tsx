import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '../ui/card';
import bg from "@/assets/backgrounds/bg.jpeg"
import { sniglet } from '@/styles/fonts/Fonts';
import Logo from '../parko/Logo';

interface LayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div
            className='flex flex-col h-full justify-center items-center w-full fixed'
            style={{
                backgroundImage: `url(${bg.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            {/* Black overlay */}
            <div className="absolute -z-1 inset-0 bg-black opacity-50"></div>

            <div className="flex flex-1 w-full justify-center items-center">
                <Card className='w-[80%] sm:h-[80%] flex justify-center items-center bg-accent/70 backdrop-blur-2xl'>
                    <CardContent className='flex flex-col sm:flex-row box-border w-full justify-between items-center'>
                        <div className='flex w-full flex-col gap-4 sm:gap-0 flex-1 h-full justify-center items-center'>
                            <div>
                            <div className='hidden sm:flex'><Logo /></div>
                            <div className='flex sm:hidden'><Image
                                src="/android-chrome-512x512.png"
                                alt="Logo"
                                width={64}
                                height={64}
                                className='rounded-2xl'
                            /></div>
                            </div>
                            <div className='flex w-full flex-col justify-center items-center'>
                                {/* <div className={`${sniglet.className} text-center text-4xl`}>Parko</div> */}
                                <div className='sm:w-[50%] text-center text-sm'>Revolutionizing Smart Parking with Efficiency, Convenience, and Reliability.</div>
                            </div>
                        </div>
                        <div className='flex flex-1 h-full justify-center items-center'>
                            <Card>
                                <CardContent className='flex justify-center items-center'>{children}</CardContent>
                            </Card>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className='mt-auto'> Copyright &copy;2025 </div>
        </div>
    );
};

export default AuthLayout;
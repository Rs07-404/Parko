import { Poppins } from "next/font/google";
import { Sniglet } from "next/font/google";



export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: "400",
  variable: '--font-poppins',
});


export const sniglet = Sniglet({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
  weight: "400",
  variable: '--font-sniglet',
});
// import { redirect } from "next/navigation";
"use client";
import { useAuthContext } from "@/context/auth-context";
import { Button } from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default function App() {
  const { authUser } = useAuthContext();
  if(authUser){    
    return <Button onClick={()=>redirect("/home")}>Home</Button>;
  } else {
    return <Button onClick={()=>redirect("/login")}>Login</Button>;
  }
}

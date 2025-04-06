import { logout } from "@/actions/auth/logout";
import { useAuthContext } from "@/context/auth-context";
import { useState } from "react";
import { toast } from "sonner";


const useLogOut = () => {
    const [ logoutLoading, setLogoutLoading ] = useState<boolean>(false);
    const { loadSession } = useAuthContext();

    const triggerLogOut = async () => {
        try {
            setLogoutLoading(true);
            const response = await logout();
            const responseData = await response.json();
            // Check if the response is okay
            if (!response.ok) {
                throw new Error(responseData.error);
            }
            toast.success("Logout Successful");
            setLogoutLoading(false);
            loadSession();

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error?.message ?? "Logout failed");
            } else {
                toast.error("Unexpected Error Occured");
            }
        } finally {
            setLogoutLoading(false);
        }
    }

    return { triggerLogOut, logoutLoading }
}

export default useLogOut;
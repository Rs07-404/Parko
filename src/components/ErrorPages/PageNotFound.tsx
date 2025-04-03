import { CircleDotDashed } from "lucide-react"
import { Button } from "../ui/button";
import { redirect } from "next/navigation";

const PageNotFound = () => {
    return (
        <div className="fixed h-full flex flex-col w-full bg-muted-foreground flex justify-center items-center" >
            <div className="flex gap-4">
                <div className="text-9xl">4</div>
                <div><CircleDotDashed className="h-28 w-28" /></div>
                <div className="text-9xl">4</div>
            </div>
            <div className="text-4xl text-muted">Page Not Found</div>
            <div className="text-muted">The page you are looking for does not exist.</div>
            <div className="text-muted">Please check the URL or return to the homepage.</div>
            <Button className="mt-4" onClick={()=>{redirect('/')}}>Go Home</Button>
        </div>
    )
}

export default PageNotFound;
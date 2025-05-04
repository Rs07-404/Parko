import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { resetParkingArea } from "@/store/slices/ParkingAreaSlice";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Dot } from "lucide-react";
import { sniglet } from "@/styles/fonts/Fonts";
import { toast } from "sonner";
import InlineLoader from "../ui/inline-loader";
import { setReservation } from "@/store/slices/ReservationSlice";
import { useAuthContext } from "@/context/auth-context";


const SpotSelectionModal: React.FC<React.ComponentProps<typeof Dialog>> = (props) => {

    const { selectedParkingArea } = useSelector((state: RootState) => state.parkingArea)
    const { reservation } = useSelector((state: RootState) => state.reservation);
    const showModal = (selectedParkingArea && selectedParkingArea._id) ? true : false
    const [selectedSpots, setSelectedSpots] = useState<string[]>([]);
    const [isBooking, setIsBooking] = useState<string[]>([]);
    const rentPerHour: number = 10;
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { loadSession } = useAuthContext();

    // Redux
    const dispatch = useDispatch();

    useEffect(()=>{
        if(isBooking.length){
            const price = rentPerHour * selectedSpots.length;
            const priceInclude = (price * 0.18) + price;
            setFinalPrice(priceInclude);
        }
    },[isBooking])

    const handleSpotSelectionModalClose = () => {
        dispatch(resetParkingArea());
    }

    const resetModal = () => {
        setSelectedSpots([]);
        setIsBooking([]);
        setFinalPrice(0);
    }

    useEffect(() => {
        resetModal();
    }, [showModal])

    const toggleParkingSpot = (spotId: string) => {
        setSelectedSpots((prevSelectedSpots) => {
            // Check if the spotId is already in the selectedSpots array
            if (prevSelectedSpots.includes(spotId)) {
                // Remove the spotId from the array
                return prevSelectedSpots.filter(id => id !== spotId);
            } else {
                if (selectedSpots.length >= 3) {
                    toast.error("You cannot select more than 3 parking spots")
                    return prevSelectedSpots;
                } else {
                    // Add the spotId to the array
                    return [...prevSelectedSpots, spotId];
                }
            }
        });
    };


    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (!selectedParkingArea) {
                return toast.error("Not a valid Parking Area");
            }

            if (!selectedSpots) {
                return toast.error("Select a Parking Spot to Proceed");
            }

            // if (selectedSpot.status !== "available") {
            //     return toast.error("Parking Already Occupied or Unavailable");
            // }


            const response = await fetch("/api/reservation/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify that the body is JSON
                },
                credentials: "include",
                body: JSON.stringify({
                    parkingAreaId: selectedParkingArea._id,
                    parkingSpots: selectedSpots,
                }),
            });

            // Check if the response is ok (status code 2xx)
            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData.error || "Error Booking Parking Spot");
                return;
            }

            // If the reservation is successful
            const data = await response.json();
            toast.success(data.message); // Display success message
            dispatch(setReservation(data.reservation));
            resetModal();
            dispatch(resetParkingArea());
            loadSession(); // Reload the session to get the updated reservation data

        } catch (e) {
            if (e instanceof Error) {
                return toast.error(e.message);
            }
            toast.error("Error Booking Parking Spot");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={showModal}
            onOpenChange={handleSpotSelectionModalClose} {...props}
        >
            <DialogContent className={`sm:max-w-[80vw] sm:max-h-[90vh] sm:w-[40vw] sm:h-max overflow-auto transition-all`}>
                <DialogHeader>
                    <DialogTitle>{isBooking.length ? "Book Spot" : "Select Spot"}</DialogTitle>
                    <DialogDescription>
                        {reservation ? <p className="text-destructive">You already have an ongoing parking</p> :
                            isBooking.length ?
                                <>
                                    <p>Complete Payment to book {isBooking.length} Spot{isBooking.length > 1 ? "s" : ""} in  {selectedParkingArea?.name}</p>
                                </>
                                :
                                <>
                                    <p>Select Spot You want to park your vehicle</p>
                                    <span className="flex w-full justify-center items-center"><Dot className="text-success h-12 w-12" /> Available <Dot className="text-destructive h-12 w-12" /> Occupied</span>
                                </>
                        }
                    </DialogDescription>
                </DialogHeader>
                {isBooking.length > 0 ?
                    <div className="flex flex-col">
                        <h1>₹{finalPrice}</h1>
                    </div> :
                    <Card className={`overflow-auto w-full flex items-center justify-start p-2 max-h-[56vh]`}>
                        <CardContent className="flex justify-start items-center w-full">
                            <div className="columns-2 space-y-3 space-x-4 p-0">
                                {selectedParkingArea && selectedParkingArea.parkingSpots.map((spot) =>
                                    <>
                                        <Card
                                            className={`break-inside-avoid sm:w-[84px] p-2 text-lg ${sniglet.className} min-w-[84px] border ${spot?.status === "available" ? "bg-success/10 border-success cursor-pointer" : "bg-destructive/10 border-destructive text-muted-foreground"} ${selectedSpots.includes(spot._id) && "bg-success"}`}
                                            key={spot._id}
                                            onClick={spot.status === "available" ? () => toggleParkingSpot(spot._id) : undefined}>
                                            <CardContent className="p-0 flex justify-center items-center">
                                                <p>{spot.spotNumber}</p>
                                            </CardContent>
                                        </Card>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                }
                <DialogFooter>
                    <DialogTrigger>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogTrigger>
                    {isBooking.length ?
                        <Button type="button" variant="success" disabled={!isBooking.length || loading}
                            onClick={handleSubmit}
                        >{loading ? <InlineLoader /> : `Pay ₹${finalPrice}`}</Button>
                        :
                        <Button type="button" variant="success" disabled={!selectedSpots.length}
                            onClick={() => { setIsBooking(selectedSpots); }}
                        >Book Spot{selectedSpots.length > 1 && "s"}</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default SpotSelectionModal
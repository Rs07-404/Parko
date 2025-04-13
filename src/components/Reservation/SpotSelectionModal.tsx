import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { resetParkingArea } from "@/store/slices/ParkingAreaSlice";
import { Card, CardContent } from "../ui/card";
import { IParkingSpot } from "@/interfaces/Generic/IParkingSpot";
import { Button } from "../ui/button";
import { Dot } from "lucide-react";
import { sniglet } from "@/styles/fonts/Fonts";
import { toast } from "sonner";
import { Select } from "../ui/custom-select";
import { SelectGroup, SelectItem, SelectLabel } from "../ui/select";
import { setReservation } from "@/store/slices/ReservationSlice";
import InlineLoader from "../ui/inline-loader";


const SpotSelectionModal: React.FC<React.ComponentProps<typeof Dialog>> = (props) => {

    const { selectedParkingArea } = useSelector((state: RootState) => state.parkingArea)
    const { reservation } = useSelector((state: RootState) => state.reservation);
    const showModal = (selectedParkingArea && selectedParkingArea._id) ? true : false
    const [selectedSpot, setSelectedSpot] = useState<IParkingSpot | null>(null);
    const [isBooking, setIsBooking] = useState<IParkingSpot | null>(null);
    const rentPerHour: number = 10;
    const [finalPrice, setFinalPrice] = useState<number | null>(null);
    const [time, setTime] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    // Redux
    const dispatch = useDispatch();


    const handleChange = (value: string) => {
        const time = parseInt(value);
        const price = time * rentPerHour;
        const priceInclude = (price * 0.18) + price;
        setTime(time);
        setFinalPrice(priceInclude);
    }

    const handleSpotSelectionModalClose = () => {
        dispatch(resetParkingArea());
    }

    const resetModal = () => {
        setSelectedSpot(null);
        setIsBooking(null);
        setFinalPrice(0);
        setTime(0);
    }

    useEffect(() => {
        resetModal();
    }, [showModal])

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const startTime = new Date();
            const endTime = new Date();
            // Add the time passed as a parameter to the current time

            if(!selectedParkingArea){
                return toast.error("Not a valid Parking Area");
            }

            if (!selectedSpot) {
                return toast.error("Select a Parking Spot to Proceed");
            }

            if (selectedSpot.status !== "available") {
                return toast.error("Parking Already Occupied or Unavailable");
            }

            endTime.setHours(endTime.getHours() + time);

            const response = await fetch("/api/reservation/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Specify that the body is JSON
                },
                credentials: "include",
                body: JSON.stringify({
                    parkingAreaId: selectedParkingArea._id,
                    parkingSpotId: selectedSpot._id,
                    startTime: startTime.toISOString(), // Convert the Date object to ISO string format
                    endTime: endTime.toISOString(), // Convert the Date object to ISO string format
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
                    <DialogTitle>{isBooking ? "Book Spot" : "Select Spot"}</DialogTitle>
                    <DialogDescription>
                        {reservation ? <p className="text-destructive">You already have an ongoing parking</p> :
                        isBooking ?
                            <>
                                <p>Select Time and Complete Payment to book Spot {isBooking.spotNumber}</p>
                                <p>Rent Per Hour: ₹{rentPerHour}</p>
                            </>
                            :
                            <>
                                <p>Select Spot You want to park your vehicle</p>
                                <span className="flex w-full justify-center items-center"><Dot className="text-success h-12 w-12" /> Available <Dot className="text-destructive h-12 w-12" /> Occupied</span>
                            </>
                        }
                    </DialogDescription>
                </DialogHeader>
                {isBooking ?
                    <div className="flex flex-col">
                        <Select className="w-full" onChange={handleChange} value={time.toString()} placeholder="Select Parking Time">
                            <SelectGroup>
                                <SelectLabel>Time (Hours)</SelectLabel>
                                <SelectItem value="1">1</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                                <SelectItem value="3">3</SelectItem>
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="5">5</SelectItem>
                            </SelectGroup>
                        </Select>
                    </div> :
                    <Card className={`overflow-auto w-full flex items-center justify-start p-2 max-h-[56vh]`}>
                        <CardContent className="flex justify-start items-center w-full">
                            <div className="columns-2 space-y-3 space-x-4 p-0">
                                {selectedParkingArea && selectedParkingArea.parkingSpots.map((spot) =>
                                    <>
                                        <Card
                                            className={`break-inside-avoid sm:w-[84px] p-2 text-lg ${sniglet.className} min-w-[84px] border ${spot?.status === "available" ? "bg-success/10 border-success cursor-pointer" : "bg-destructive/10 border-destructive text-muted-foreground"} ${selectedSpot?._id === spot._id && "bg-success"}`}
                                            key={spot._id}
                                            onClick={spot.status === "available" ? () => setSelectedSpot(spot) : undefined}>
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
                    {isBooking ?
                        <Button type="button" variant="success" disabled={!isBooking || !time || loading}
                            onClick={handleSubmit}
                        >{loading ? <InlineLoader /> : `Pay ₹${finalPrice}`}</Button>
                        :
                        <Button type="button" variant="success" disabled={!selectedSpot}
                            onClick={() => { setIsBooking(selectedSpot); }}
                        >Book Spot</Button>
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default SpotSelectionModal
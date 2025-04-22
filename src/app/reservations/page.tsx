import { TicketCard } from "@/components/Reservation/TicketCard"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample reservation data
const sampleReservation = {
    parkingAreaId: {
        _id: "1",
        name: "Downtown Parking Garage",
        address: "123 Main St, Anytown, USA",
    },
    parkingSpots: [
        {
            spotId: "1",
            spotNumber: "A12",
        },
    ],
    ticketKey: {
        _id: "1",
        qrcode: `<?xml version="1.0" encoding="utf-8"?>
<svg width="198" height="198" viewBox="0 0 264 264"
		 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events">
<rect x="0" y="0" width="264" height="264" fill="#ffffff"/>
<defs>
<rect id="p" width="8" height="8"/>
</defs>
<g fill="#000000">
<use xlink:href="#p" x="32" y="32"/>
<use xlink:href="#p" x="32" y="40"/>
<use xlink:href="#p" x="32" y="48"/>
<use xlink:href="#p" x="32" y="56"/>
<use xlink:href="#p" x="32" y="64"/>
<use xlink:href="#p" x="32" y="72"/>
<use xlink:href="#p" x="32" y="80"/>
<use xlink:href="#p" x="32" y="96"/>
<use xlink:href="#p" x="32" y="104"/>
<use xlink:href="#p" x="32" y="112"/>
<use xlink:href="#p" x="32" y="120"/>
<use xlink:href="#p" x="32" y="176"/>
<use xlink:href="#p" x="32" y="184"/>
<use xlink:href="#p" x="32" y="192"/>
<use xlink:href="#p" x="32" y="200"/>
<use xlink:href="#p" x="32" y="208"/>
<use xlink:href="#p" x="32" y="216"/>
<use xlink:href="#p" x="32" y="224"/>
<use xlink:href="#p" x="40" y="32"/>
<use xlink:href="#p" x="40" y="80"/>
<use xlink:href="#p" x="40" y="96"/>
<use xlink:href="#p" x="40" y="112"/>
<use xlink:href="#p" x="40" y="120"/>
<use xlink:href="#p" x="40" y="136"/>
<use xlink:href="#p" x="40" y="144"/>
<use xlink:href="#p" x="40" y="152"/>
<use xlink:href="#p" x="40" y="160"/>
<use xlink:href="#p" x="40" y="176"/>
<use xlink:href="#p" x="40" y="224"/>
<use xlink:href="#p" x="48" y="32"/>
<use xlink:href="#p" x="48" y="48"/>
<use xlink:href="#p" x="48" y="56"/>
<use xlink:href="#p" x="48" y="64"/>
<use xlink:href="#p" x="48" y="80"/>
<use xlink:href="#p" x="48" y="96"/>
<use xlink:href="#p" x="48" y="104"/>
<use xlink:href="#p" x="48" y="128"/>
<use xlink:href="#p" x="48" y="160"/>
<use xlink:href="#p" x="48" y="176"/>
<use xlink:href="#p" x="48" y="192"/>
<use xlink:href="#p" x="48" y="200"/>
<use xlink:href="#p" x="48" y="208"/>
<use xlink:href="#p" x="48" y="224"/>
<use xlink:href="#p" x="56" y="32"/>
<use xlink:href="#p" x="56" y="48"/>
<use xlink:href="#p" x="56" y="56"/>
<use xlink:href="#p" x="56" y="64"/>
<use xlink:href="#p" x="56" y="80"/>
<use xlink:href="#p" x="56" y="96"/>
<use xlink:href="#p" x="56" y="120"/>
<use xlink:href="#p" x="56" y="128"/>
<use xlink:href="#p" x="56" y="136"/>
<use xlink:href="#p" x="56" y="144"/>
<use xlink:href="#p" x="56" y="152"/>
<use xlink:href="#p" x="56" y="160"/>
<use xlink:href="#p" x="56" y="176"/>
<use xlink:href="#p" x="56" y="192"/>
<use xlink:href="#p" x="56" y="200"/>
<use xlink:href="#p" x="56" y="208"/>
<use xlink:href="#p" x="56" y="224"/>
<use xlink:href="#p" x="64" y="32"/>
<use xlink:href="#p" x="64" y="48"/>
<use xlink:href="#p" x="64" y="56"/>
<use xlink:href="#p" x="64" y="64"/>
<use xlink:href="#p" x="64" y="80"/>
<use xlink:href="#p" x="64" y="96"/>
<use xlink:href="#p" x="64" y="104"/>
<use xlink:href="#p" x="64" y="128"/>
<use xlink:href="#p" x="64" y="144"/>
<use xlink:href="#p" x="64" y="160"/>
<use xlink:href="#p" x="64" y="176"/>
<use xlink:href="#p" x="64" y="192"/>
<use xlink:href="#p" x="64" y="200"/>
<use xlink:href="#p" x="64" y="208"/>
<use xlink:href="#p" x="64" y="224"/>
<use xlink:href="#p" x="72" y="32"/>
<use xlink:href="#p" x="72" y="80"/>
<use xlink:href="#p" x="72" y="112"/>
<use xlink:href="#p" x="72" y="128"/>
<use xlink:href="#p" x="72" y="136"/>
<use xlink:href="#p" x="72" y="152"/>
<use xlink:href="#p" x="72" y="176"/>
<use xlink:href="#p" x="72" y="224"/>
<use xlink:href="#p" x="80" y="32"/>
<use xlink:href="#p" x="80" y="40"/>
<use xlink:href="#p" x="80" y="48"/>
<use xlink:href="#p" x="80" y="56"/>
<use xlink:href="#p" x="80" y="64"/>
<use xlink:href="#p" x="80" y="72"/>
<use xlink:href="#p" x="80" y="80"/>
<use xlink:href="#p" x="80" y="96"/>
<use xlink:href="#p" x="80" y="112"/>
<use xlink:href="#p" x="80" y="128"/>
<use xlink:href="#p" x="80" y="144"/>
<use xlink:href="#p" x="80" y="160"/>
<use xlink:href="#p" x="80" y="176"/>
<use xlink:href="#p" x="80" y="184"/>
<use xlink:href="#p" x="80" y="192"/>
<use xlink:href="#p" x="80" y="200"/>
<use xlink:href="#p" x="80" y="208"/>
<use xlink:href="#p" x="80" y="216"/>
<use xlink:href="#p" x="80" y="224"/>
<use xlink:href="#p" x="88" y="96"/>
<use xlink:href="#p" x="88" y="112"/>
<use xlink:href="#p" x="88" y="136"/>
<use xlink:href="#p" x="88" y="144"/>
<use xlink:href="#p" x="88" y="152"/>
<use xlink:href="#p" x="96" y="40"/>
<use xlink:href="#p" x="96" y="56"/>
<use xlink:href="#p" x="96" y="72"/>
<use xlink:href="#p" x="96" y="80"/>
<use xlink:href="#p" x="96" y="96"/>
<use xlink:href="#p" x="96" y="104"/>
<use xlink:href="#p" x="96" y="128"/>
<use xlink:href="#p" x="96" y="144"/>
<use xlink:href="#p" x="96" y="168"/>
<use xlink:href="#p" x="96" y="176"/>
<use xlink:href="#p" x="96" y="192"/>
<use xlink:href="#p" x="96" y="200"/>
<use xlink:href="#p" x="96" y="208"/>
<use xlink:href="#p" x="96" y="216"/>
<use xlink:href="#p" x="96" y="224"/>
<use xlink:href="#p" x="104" y="32"/>
<use xlink:href="#p" x="104" y="40"/>
<use xlink:href="#p" x="104" y="48"/>
<use xlink:href="#p" x="104" y="56"/>
<use xlink:href="#p" x="104" y="96"/>
<use xlink:href="#p" x="104" y="104"/>
<use xlink:href="#p" x="104" y="112"/>
<use xlink:href="#p" x="104" y="120"/>
<use xlink:href="#p" x="104" y="128"/>
<use xlink:href="#p" x="104" y="144"/>
<use xlink:href="#p" x="104" y="168"/>
<use xlink:href="#p" x="104" y="184"/>
<use xlink:href="#p" x="104" y="208"/>
<use xlink:href="#p" x="104" y="216"/>
<use xlink:href="#p" x="112" y="32"/>
<use xlink:href="#p" x="112" y="72"/>
<use xlink:href="#p" x="112" y="80"/>
<use xlink:href="#p" x="112" y="96"/>
<use xlink:href="#p" x="112" y="120"/>
<use xlink:href="#p" x="112" y="136"/>
<use xlink:href="#p" x="112" y="144"/>
<use xlink:href="#p" x="112" y="152"/>
<use xlink:href="#p" x="112" y="160"/>
<use xlink:href="#p" x="112" y="168"/>
<use xlink:href="#p" x="112" y="176"/>
<use xlink:href="#p" x="112" y="200"/>
<use xlink:href="#p" x="112" y="208"/>
<use xlink:href="#p" x="112" y="216"/>
<use xlink:href="#p" x="112" y="224"/>
<use xlink:href="#p" x="120" y="32"/>
<use xlink:href="#p" x="120" y="64"/>
<use xlink:href="#p" x="120" y="104"/>
<use xlink:href="#p" x="120" y="120"/>
<use xlink:href="#p" x="120" y="128"/>
<use xlink:href="#p" x="120" y="136"/>
<use xlink:href="#p" x="120" y="160"/>
<use xlink:href="#p" x="120" y="168"/>
<use xlink:href="#p" x="120" y="200"/>
<use xlink:href="#p" x="120" y="216"/>
<use xlink:href="#p" x="128" y="40"/>
<use xlink:href="#p" x="128" y="48"/>
<use xlink:href="#p" x="128" y="80"/>
<use xlink:href="#p" x="128" y="88"/>
<use xlink:href="#p" x="128" y="96"/>
<use xlink:href="#p" x="128" y="112"/>
<use xlink:href="#p" x="128" y="128"/>
<use xlink:href="#p" x="128" y="136"/>
<use xlink:href="#p" x="128" y="144"/>
<use xlink:href="#p" x="128" y="160"/>
<use xlink:href="#p" x="128" y="192"/>
<use xlink:href="#p" x="128" y="216"/>
<use xlink:href="#p" x="128" y="224"/>
<use xlink:href="#p" x="136" y="32"/>
<use xlink:href="#p" x="136" y="56"/>
<use xlink:href="#p" x="136" y="64"/>
<use xlink:href="#p" x="136" y="72"/>
<use xlink:href="#p" x="136" y="96"/>
<use xlink:href="#p" x="136" y="104"/>
<use xlink:href="#p" x="136" y="112"/>
<use xlink:href="#p" x="136" y="128"/>
<use xlink:href="#p" x="136" y="144"/>
<use xlink:href="#p" x="136" y="160"/>
<use xlink:href="#p" x="136" y="192"/>
<use xlink:href="#p" x="136" y="208"/>
<use xlink:href="#p" x="136" y="224"/>
<use xlink:href="#p" x="144" y="48"/>
<use xlink:href="#p" x="144" y="56"/>
<use xlink:href="#p" x="144" y="72"/>
<use xlink:href="#p" x="144" y="80"/>
<use xlink:href="#p" x="144" y="112"/>
<use xlink:href="#p" x="144" y="128"/>
<use xlink:href="#p" x="144" y="136"/>
<use xlink:href="#p" x="144" y="144"/>
<use xlink:href="#p" x="144" y="160"/>
<use xlink:href="#p" x="144" y="176"/>
<use xlink:href="#p" x="144" y="184"/>
<use xlink:href="#p" x="144" y="192"/>
<use xlink:href="#p" x="144" y="200"/>
<use xlink:href="#p" x="144" y="224"/>
<use xlink:href="#p" x="152" y="40"/>
<use xlink:href="#p" x="152" y="48"/>
<use xlink:href="#p" x="152" y="56"/>
<use xlink:href="#p" x="152" y="72"/>
<use xlink:href="#p" x="152" y="96"/>
<use xlink:href="#p" x="152" y="112"/>
<use xlink:href="#p" x="152" y="144"/>
<use xlink:href="#p" x="152" y="152"/>
<use xlink:href="#p" x="152" y="168"/>
<use xlink:href="#p" x="152" y="184"/>
<use xlink:href="#p" x="152" y="192"/>
<use xlink:href="#p" x="152" y="216"/>
<use xlink:href="#p" x="160" y="32"/>
<use xlink:href="#p" x="160" y="56"/>
<use xlink:href="#p" x="160" y="64"/>
<use xlink:href="#p" x="160" y="80"/>
<use xlink:href="#p" x="160" y="96"/>
<use xlink:href="#p" x="160" y="104"/>
<use xlink:href="#p" x="160" y="112"/>
<use xlink:href="#p" x="160" y="120"/>
<use xlink:href="#p" x="160" y="136"/>
<use xlink:href="#p" x="160" y="144"/>
<use xlink:href="#p" x="160" y="152"/>
<use xlink:href="#p" x="160" y="160"/>
<use xlink:href="#p" x="160" y="168"/>
<use xlink:href="#p" x="160" y="176"/>
<use xlink:href="#p" x="160" y="184"/>
<use xlink:href="#p" x="160" y="192"/>
<use xlink:href="#p" x="160" y="200"/>
<use xlink:href="#p" x="160" y="208"/>
<use xlink:href="#p" x="160" y="216"/>
<use xlink:href="#p" x="168" y="96"/>
<use xlink:href="#p" x="168" y="120"/>
<use xlink:href="#p" x="168" y="128"/>
<use xlink:href="#p" x="168" y="136"/>
<use xlink:href="#p" x="168" y="160"/>
<use xlink:href="#p" x="168" y="192"/>
<use xlink:href="#p" x="168" y="200"/>
<use xlink:href="#p" x="168" y="224"/>
<use xlink:href="#p" x="176" y="32"/>
<use xlink:href="#p" x="176" y="40"/>
<use xlink:href="#p" x="176" y="48"/>
<use xlink:href="#p" x="176" y="56"/>
<use xlink:href="#p" x="176" y="64"/>
<use xlink:href="#p" x="176" y="72"/>
<use xlink:href="#p" x="176" y="80"/>
<use xlink:href="#p" x="176" y="112"/>
<use xlink:href="#p" x="176" y="120"/>
<use xlink:href="#p" x="176" y="128"/>
<use xlink:href="#p" x="176" y="144"/>
<use xlink:href="#p" x="176" y="160"/>
<use xlink:href="#p" x="176" y="176"/>
<use xlink:href="#p" x="176" y="192"/>
<use xlink:href="#p" x="176" y="200"/>
<use xlink:href="#p" x="184" y="32"/>
<use xlink:href="#p" x="184" y="80"/>
<use xlink:href="#p" x="184" y="96"/>
<use xlink:href="#p" x="184" y="104"/>
<use xlink:href="#p" x="184" y="128"/>
<use xlink:href="#p" x="184" y="136"/>
<use xlink:href="#p" x="184" y="144"/>
<use xlink:href="#p" x="184" y="152"/>
<use xlink:href="#p" x="184" y="160"/>
<use xlink:href="#p" x="184" y="192"/>
<use xlink:href="#p" x="184" y="216"/>
<use xlink:href="#p" x="184" y="224"/>
<use xlink:href="#p" x="192" y="32"/>
<use xlink:href="#p" x="192" y="48"/>
<use xlink:href="#p" x="192" y="56"/>
<use xlink:href="#p" x="192" y="64"/>
<use xlink:href="#p" x="192" y="80"/>
<use xlink:href="#p" x="192" y="128"/>
<use xlink:href="#p" x="192" y="144"/>
<use xlink:href="#p" x="192" y="152"/>
<use xlink:href="#p" x="192" y="160"/>
<use xlink:href="#p" x="192" y="168"/>
<use xlink:href="#p" x="192" y="176"/>
<use xlink:href="#p" x="192" y="184"/>
<use xlink:href="#p" x="192" y="192"/>
<use xlink:href="#p" x="192" y="200"/>
<use xlink:href="#p" x="192" y="216"/>
<use xlink:href="#p" x="192" y="224"/>
<use xlink:href="#p" x="200" y="32"/>
<use xlink:href="#p" x="200" y="48"/>
<use xlink:href="#p" x="200" y="56"/>
<use xlink:href="#p" x="200" y="64"/>
<use xlink:href="#p" x="200" y="80"/>
<use xlink:href="#p" x="200" y="96"/>
<use xlink:href="#p" x="200" y="112"/>
<use xlink:href="#p" x="200" y="136"/>
<use xlink:href="#p" x="200" y="144"/>
<use xlink:href="#p" x="200" y="168"/>
<use xlink:href="#p" x="200" y="184"/>
<use xlink:href="#p" x="200" y="200"/>
<use xlink:href="#p" x="200" y="208"/>
<use xlink:href="#p" x="200" y="216"/>
<use xlink:href="#p" x="200" y="224"/>
<use xlink:href="#p" x="208" y="32"/>
<use xlink:href="#p" x="208" y="48"/>
<use xlink:href="#p" x="208" y="56"/>
<use xlink:href="#p" x="208" y="64"/>
<use xlink:href="#p" x="208" y="80"/>
<use xlink:href="#p" x="208" y="128"/>
<use xlink:href="#p" x="208" y="160"/>
<use xlink:href="#p" x="208" y="176"/>
<use xlink:href="#p" x="208" y="192"/>
<use xlink:href="#p" x="208" y="200"/>
<use xlink:href="#p" x="208" y="208"/>
<use xlink:href="#p" x="208" y="224"/>
<use xlink:href="#p" x="216" y="32"/>
<use xlink:href="#p" x="216" y="80"/>
<use xlink:href="#p" x="216" y="96"/>
<use xlink:href="#p" x="216" y="104"/>
<use xlink:href="#p" x="216" y="112"/>
<use xlink:href="#p" x="216" y="128"/>
<use xlink:href="#p" x="216" y="136"/>
<use xlink:href="#p" x="216" y="144"/>
<use xlink:href="#p" x="216" y="176"/>
<use xlink:href="#p" x="216" y="192"/>
<use xlink:href="#p" x="216" y="200"/>
<use xlink:href="#p" x="216" y="224"/>
<use xlink:href="#p" x="224" y="32"/>
<use xlink:href="#p" x="224" y="40"/>
<use xlink:href="#p" x="224" y="48"/>
<use xlink:href="#p" x="224" y="56"/>
<use xlink:href="#p" x="224" y="64"/>
<use xlink:href="#p" x="224" y="72"/>
<use xlink:href="#p" x="224" y="80"/>
<use xlink:href="#p" x="224" y="112"/>
<use xlink:href="#p" x="224" y="120"/>
<use xlink:href="#p" x="224" y="128"/>
<use xlink:href="#p" x="224" y="144"/>
<use xlink:href="#p" x="224" y="152"/>
<use xlink:href="#p" x="224" y="176"/>
<use xlink:href="#p" x="224" y="200"/>
<use xlink:href="#p" x="224" y="208"/>
<use xlink:href="#p" x="224" y="216"/>
<use xlink:href="#p" x="224" y="224"/>
</g>
<g></g></svg>`,
    },
    bookingTime: "2023-04-21T14:30:00.000Z",
    entryTime: "2023-04-21T15:00:00.000Z",
    exitTime: "2023-04-21T17:45:00.000Z",
    status: "Completed",
}

export default function Home() {
    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Your Parking Reservations</h1>

            <ScrollArea className="h-[calc(100vh-150px)] sm:pr-4 md:pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Example of different status tickets */}
                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Booked",
                            entryTime: undefined,
                            exitTime: undefined,
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Entered",
                            exitTime: undefined,
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Completed",
                        }}
                    />

                    <TicketCard
                        reservation={{
                            ...sampleReservation,
                            status: "Canceled",
                            entryTime: undefined,
                            exitTime: undefined,
                        }}
                    />
                </div>
            </ScrollArea>
        </main>
    )
}

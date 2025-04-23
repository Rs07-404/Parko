"use client"

import { useState } from "react"
import { Search, Edit, Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { useAllOperators } from "@/hooks/admin/use-operators"
import { IUser } from "@/interfaces/IUser"
import { CreateOperatorDialog } from "./CreateOperatorModal"
import { toast } from "sonner"
import deleteOperator from "@/actions/operator/deleteOperator"
import { Dialog, DialogDescription, DialogHeader, DialogContent, DialogFooter } from "../ui/dialog"


export default function OperatorsTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const {allOperators, fetchAllOperators} = useAllOperators();
    const [showCreateOperatorModal, setShowCreateOperatorModal] = useState(false);
    const [operatorToDelete, setOperatorToDelete] = useState<IUser | null>(null);

    // Filter operators based on search term
    const filteredOperators = allOperators?.filter((operator) => {
        const searchLower = searchTerm.toLowerCase()
        return (
            operator.profile.firstName.toLowerCase().includes(searchLower) ||
            operator.profile.lastName.toLowerCase().includes(searchLower) ||
            operator.email.toLowerCase().includes(searchLower) ||
            operator.parkingArea?.name.toLowerCase().includes(searchLower) ||
            operator.parkingArea?.address.toLowerCase().includes(searchLower) ||
            operator.roles[0].toLowerCase().includes(searchLower)
        )
    })

    const handleEdit = (operator: IUser) => {
        console.log("Edit operator:", operator)
        // Implement edit functionality
    }

    const handleDelete = async (operatorId: string) => {
        // Implement delete functionality
        try{
            const response = await deleteOperator(operatorId);
            if(response.ok){
                toast.success("Operator deleted successfully");
                setOperatorToDelete(null);
                fetchAllOperators();
            }else{
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete operator");
            }
        }catch(error){
            if(error instanceof Error){
                toast.error(error.message);
            }else{
                toast.error("Failed to delete operator");
            }
        }
    }

    return (
        <div className="flex flex-col w-full h-full rounded-lg bg-card">
            <div className="p-4 flex justify-between items-center">
                <Button className="flex items-center gap-1" onClick={() => setShowCreateOperatorModal(true)}>
                    <Plus className="h-4 w-4" />
                    Create Operator
                </Button>
                <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div>
                <div className="rounded-t-lg overflow-hidden">
                    <Table className="border-none">
                        <TableHeader className="bg-primary/10">
                            <TableRow>
                                <TableHead className="w-[10%]">Sr No</TableHead>
                                <TableHead className="w-[20%]">Name</TableHead>
                                <TableHead className="w-[20%]">Email</TableHead>
                                <TableHead className="w-[20%]">Role</TableHead>
                                <TableHead className="w-[20%]">Parking Area</TableHead>
                                <TableHead className="w-[10%] text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                    </Table>
                </div>
                <div className="rounded-b-lg overflow-hidden">
                    <ScrollArea className="h-[calc(100vh-250px)]">
                        <Table>
                            <TableBody>
                                {filteredOperators && filteredOperators.length > 0 ? (
                                    filteredOperators.map((operator, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="w-[10%]">{index + 1}</TableCell>
                                            <TableCell className="w-[20%] font-medium">{operator.profile.firstName} {operator.profile.lastName}</TableCell>
                                            <TableCell className="w-[20%]">{operator.email}</TableCell>
                                            <TableCell className="w-[20%]">{operator.roles[0]}</TableCell>
                                            <TableCell className="w-[20%]">
                                                <div>
                                                    <div className="font-medium">{operator.parkingArea?.name}</div>
                                                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                        {operator.parkingArea?.address}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center w-[10%]">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(operator)}
                                                        className="h-8 w-8 p-0 text-primary hover:text-primary/80"
                                                    >
                                                        <span className="sr-only">Edit</span>
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setOperatorToDelete(operator)}
                                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                                                    >
                                                        <span className="sr-only">Delete</span>
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No operators found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            </div>
            <Dialog open={!!operatorToDelete} onOpenChange={() => setOperatorToDelete(null)}>
                <DialogContent>
                    <DialogHeader>
                        Delete Operator
                    </DialogHeader>
                    <DialogDescription>
                        Do you want to delete account of {operatorToDelete?.profile.firstName} {operatorToDelete?.profile.lastName}?
                    </DialogDescription>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOperatorToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => operatorToDelete && handleDelete(operatorToDelete._id)}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <CreateOperatorDialog open={showCreateOperatorModal} onOpenChange={setShowCreateOperatorModal} postSubmitActions={fetchAllOperators} />
        </div>
    )
}

import OperatorsTable from "@/components/Admin/OperatorTable";
import { sniglet } from "@/styles/fonts/Fonts";

const OperatorManagement = () => {
    return (
        <div className="flex flex-col items-center h-screen overflow-auto p-4 box-border">
            <div><h1 className={`text-2xl font-bold ${sniglet.className}`}>Operator Management</h1></div>
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] w-full overflow-auto rounded-lg">
                <OperatorsTable />
            </div>
        </div>
    )
}

export default OperatorManagement;

"use client"

import { useQuery } from "@tanstack/react-query";
import { Habit } from "@/app/lib/definitions";
import DataTable from "react-data-table-component";
import React from "react";
import { fetchHabits } from "@/app/lib/helper";
import Link from "next/link";
import FilterComponent from "@/app/components/FilterComponent";
import { LogProgressModal } from "../components/LogProgressModal";


export default function HabitsPage() {
  
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const [selectedHabit, setSelectedHabit] = React.useState<Habit | null>(null);

    const subHeaderComponentMemo = React.useMemo(() => {
            const handleClear = () => {
                if (filterText) {
                    setResetPaginationToggle(!resetPaginationToggle);
                    setFilterText('');
                }
            };

            return (
                <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
            );
        }, [filterText, resetPaginationToggle]);

    const { data: habits, isLoading } = useQuery({ queryKey: ["habits"], queryFn: fetchHabits });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
            <p className="text-lg font-medium">Loading...</p>
            </div>
        );
    }

    const columns = [
        { name: 'Habit ID', selector: (row: Habit) => row.id, omit: true},
        { name: 'Habit', selector: (row: Habit) => row.name, sortable: true, grow: 2},
        { name: 'Target Amount', selector: (row: Habit) => row.target_amount },
        { name: 'Unit', selector: (row: Habit) => row.unit },
        { name: 'Frequency', selector: (row: Habit) => row.frequency, grow: 2 }, 
        {
          name: '',
          cell: (row: Habit) => (
            <button
                className="text-blue-500 ml-2 cursor-pointer hover:bg-gray-200 p-2 rounded-sm"
                onClick={() => setSelectedHabit(row)}
                >
                Log Progress
            </button>   
          ),
        },
    ];

	const filteredItems = (habits ?? []).filter(
        (h: Habit) => h.name && h.name.toLowerCase().includes(filterText.toLowerCase())
    );


    return (
        <div className="mx-20">
            <h1 className="text-xl font-bold m-8">Habits</h1>
            <Link href="/Habit/nuevo" className="text-white mx-8 my-10 bg-slate-700 hover:bg-gray-200 hover:text-slate-700 p-[15px] rounded-sm">Create Habit</Link>
            
            <DataTable
                title=""
                columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponentMemo}
                persistTableHead
                onRowClicked={(row) => window.location.href = `/habits/${row.id}`}
                highlightOnHover
                pointerOnHover
            />
            {selectedHabit && (
                <LogProgressModal
                visible={selectedHabit != null}
                onCancel={() => setSelectedHabit(null)}
                habit={selectedHabit}
                />
            )}
        </div>
  );
}
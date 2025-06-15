import React from "react";
import { Habit } from "../lib/definitions";

// Modal that allows the authenticated user to log progress for each habit

type LogProgressModalProps = {
  visible: boolean;
  onCancel: () => void;
  habit: Habit | null;
};

export function LogProgressModal({
  visible,
  onCancel,
  habit,
}: LogProgressModalProps) {

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState({
        habit_id: habit?.id,
        date: today,
        actual_amount: 0,
        note: ""
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
        
            const method = "POST";
            const response = await fetch(
                "/api/habit-progress",
                {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Error logging progress");

            setSuccess("Progress logged successfully");

            setTimeout(() => {
                onCancel();
            }, 1500);
        

        } catch (err: unknown) {
        
            if (err instanceof Error) {
                setError(err.message || "An error ocurred");
            } else {
                setError("There was an unexpected error");
            }
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {success && <p className="text-green-500 mb-2">{success}</p>}
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <h2 className="text-lg font-semibold">{habit?.name}</h2>
                    <p className="text-sm text-gray-500">
                    Goal: {habit?.target_amount} {habit?.unit}
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Actual Amount</label>
                    <input
                    name="actual_amount"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.actual_amount}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    placeholder={`e.g., ${habit?.target_amount}`}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Note (opcional)</label>
                    <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    />
                </div>

                <div className="flex justify-end space-x-2">
                    {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
                    >
                        Cancel
                    </button>
                    )}
                    <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
                    >
                    Log Progress
                    </button>
                </div>
                </form>
        </div>
        </div>
    );
}

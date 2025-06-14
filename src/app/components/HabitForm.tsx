'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Habit } from '../lib/definitions';

type HabitFormProps = {
  habit?: Habit | null;
};

export default function HabitForm({ habit }: HabitFormProps) {
  const router = useRouter();
  const isEdit = !!habit;

  const [formData, setFormData] = useState({
    name: habit?.name || "",
    target_amount: habit?.target_amount ?? 0,
    unit: habit?.unit || "",
    frequency: habit?.frequency || "",
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        target_amount: habit.target_amount,
        unit: habit.unit,
        frequency: habit.frequency,
      });
    }
  }, [habit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'target_amount' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(
        isEdit ? `/api/habits/${habit?.id}` : '/api/habits',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(isEdit ? 'Habit updated!' : 'Habit created!');
        router.push('/dashboard'); // adjust route as needed
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save habit');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isEdit ? 'Edit Habit' : 'Create Habit'}
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && <p className="text-green-600 mb-2">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Habit Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          />
          <input
            name="target_amount"
            type="number"
            placeholder="Target Amount"
            value={formData.target_amount}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          />
          <input
            name="unit"
            type="text"
            placeholder="Unit (e.g. minutes, km)"
            value={formData.unit}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          />
          <select
            name="frequency"
            value={formData.frequency || ''} // Use the formData value or empty string if undefined
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900"
          >
            <option value="" disabled>
              Select Frequency
            </option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            {isEdit ? 'Update Habit' : 'Create Habit'}
          </button>
        </form>
      </div>
    </div>
  );
}

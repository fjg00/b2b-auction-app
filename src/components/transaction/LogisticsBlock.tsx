'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Truck, MapPin, Phone, User } from 'lucide-react';

interface LogisticsBlockProps {
    role: 'buyer' | 'seller';
    status: 'pending' | 'scheduled' | 'completed';
    method: 'pickup' | 'delivery';
    address: string;
    scheduledDate?: string;
}

export const LogisticsBlock = ({ role, status, method, address, scheduledDate }: LogisticsBlockProps) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const isDisabled = status === 'pending';

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-10 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Truck className="text-gray-500" size={28} />
                    Pickup & Delivery
                </h2>
                {status === 'scheduled' && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1.5 rounded-full">
                        Scheduled
                    </span>
                )}
            </div>

            {/* Pickup Location */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-gray-500" />
                    {method === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
                </div>
                <div className="text-gray-700 mb-3 pl-6">
                    {address}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 pl-6">
                    <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>John Doe</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-2">
                        <Phone size={14} />
                        <span>+1 (555) 123-4567</span>
                    </div>
                </div>
            </div>

            {/* Schedule Pickup */}
            {role === 'buyer' && (
                <div className={isDisabled ? 'opacity-50' : ''}>
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Schedule Pickup
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-lg text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                disabled={isDisabled}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                            <input
                                type="time"
                                className="w-full p-3 border border-gray-300 rounded-lg text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                disabled={isDisabled}
                            />
                        </div>
                    </div>
                    {isDisabled && (
                        <div className="text-sm text-gray-500 mb-4">
                            Complete payment first to schedule pickup.
                        </div>
                    )}
                    <Button
                        fullWidth
                        size="lg"
                        className="h-12"
                        disabled={isDisabled || !selectedDate || !selectedTime}
                    >
                        Confirm Pickup Time
                    </Button>
                </div>
            )}

            {status === 'scheduled' && scheduledDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
                    <div className="font-semibold mb-1">Scheduled for {scheduledDate}</div>
                    <div className="text-sm opacity-90">Please arrive on time with your ID and Order #.</div>
                </div>
            )}

            {role === 'seller' && status === 'scheduled' && (
                <div className="flex gap-3 mt-6">
                    <Button fullWidth size="lg" className="h-12">
                        Confirm Pickup Completed
                    </Button>
                    <Button variant="outline" fullWidth size="lg" className="h-12">
                        Reschedule
                    </Button>
                </div>
            )}
        </div>
    );
};

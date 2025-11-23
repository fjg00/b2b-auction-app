import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface TimelineEvent {
    id: string;
    label: string;
    date?: string;
    status: 'completed' | 'current' | 'pending';
}

interface SellerTimelineProps {
    events: TimelineEvent[];
}

export const SellerTimeline = ({ events }: SellerTimelineProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction Timeline</h3>
            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-100" />

                <div className="space-y-8">
                    {events.map((event, index) => {
                        const isCompleted = event.status === 'completed';
                        const isCurrent = event.status === 'current';

                        return (
                            <div key={event.id} className="relative flex items-start gap-4">
                                {/* Icon */}
                                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 ${isCompleted ? 'bg-green-100 border-white text-green-600' :
                                        isCurrent ? 'bg-amber-100 border-white text-amber-600' :
                                            'bg-gray-50 border-white text-gray-300'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={20} /> :
                                        isCurrent ? <Clock size={20} /> :
                                            <Circle size={20} />}
                                </div>

                                {/* Content */}
                                <div className="pt-2">
                                    <div className={`font-medium ${isCurrent ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {event.label}
                                    </div>
                                    {event.date && (
                                        <div className="text-sm text-gray-400 mt-1">
                                            {event.date}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

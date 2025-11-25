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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Transaction Timeline</h3>
            <div className="relative pl-2">
                {/* Connecting Line */}
                <div className="absolute left-[15px] top-3 bottom-3 w-0.5 bg-slate-100" />

                <div className="space-y-8">
                    {events.map((event, index) => {
                        const isCompleted = event.status === 'completed';
                        const isCurrent = event.status === 'current';

                        return (
                            <div key={event.id} className="relative flex items-start gap-4">
                                {/* Icon */}
                                <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${isCompleted ? 'bg-blue-100 border-blue-600 text-blue-600' :
                                        isCurrent ? 'bg-white border-blue-600 text-blue-600' :
                                            'bg-white border-slate-200 text-slate-300'
                                    }`}>
                                    {isCompleted ? <CheckCircle size={16} /> :
                                        isCurrent ? <Circle size={16} fill="currentColor" className="text-blue-600" /> :
                                            <Circle size={16} />}
                                </div>

                                {/* Content */}
                                <div className="pt-1">
                                    <div className={`font-medium text-sm ${isCurrent || isCompleted ? 'text-slate-900' : 'text-slate-500'}`}>
                                        {event.label}
                                    </div>
                                    {event.date && (
                                        <div className="text-xs text-slate-400 mt-0.5">
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

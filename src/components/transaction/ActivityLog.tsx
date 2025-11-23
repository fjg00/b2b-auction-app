'use client';

import React from 'react';
import { Clock } from 'lucide-react';

interface LogEntry {
    id: string;
    text: string;
    date: string;
}

interface ActivityLogProps {
    logs: LogEntry[];
}

export const ActivityLog = ({ logs }: ActivityLogProps) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <Clock className="text-gray-500" size={28} />
                Activity
            </h2>

            <div className="space-y-5">
                {logs.map((log, index) => (
                    <div key={log.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full mt-1.5" />
                            {index < logs.length - 1 && (
                                <div className="w-0.5 h-full bg-gray-200 mt-1" />
                            )}
                        </div>
                        <div className="flex-1 pb-5">
                            <div className="text-sm text-gray-500 mb-1">{log.date}</div>
                            <div className="text-base text-gray-900">{log.text}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

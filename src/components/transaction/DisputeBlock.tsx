'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export const DisputeBlock = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="text-gray-500" />
                    Need help or see an issue?
                </h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? 'Cancel' : 'Report a Problem'}
                </Button>
            </div>

            {isOpen && (
                <div className="mt-6 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md">
                                <option>Payment Issue</option>
                                <option>Product Condition</option>
                                <option>No-show / Logistics</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full p-2 border border-gray-300 rounded-md h-24"
                                placeholder="Describe the issue in detail..."
                            />
                        </div>
                        <Button variant="danger">Submit Report</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

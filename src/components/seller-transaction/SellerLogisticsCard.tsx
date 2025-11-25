import React from 'react';
import { MapPin, Truck, ExternalLink } from 'lucide-react';

interface SellerLogisticsCardProps {
    mode: 'pickup' | 'shipping';
    pickupLocation?: string;
    pickupWindow?: string;
    carrier?: string;
    trackingNumber?: string;
    shipFromAddress?: string;
}

export const SellerLogisticsCard = ({
    mode,
    pickupLocation,
    pickupWindow,
    carrier,
    trackingNumber,
    shipFromAddress,
}: SellerLogisticsCardProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Logistics</h3>

            {mode === 'pickup' ? (
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium text-slate-900">Pickup Location</div>
                        <div className="text-sm text-slate-600 mt-1">{pickupLocation}</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">Pickup Window</div>
                        <div className="text-sm text-slate-600 mt-1">{pickupWindow}</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-3 text-xs text-amber-800">
                        <strong>Important:</strong> Buyer or courier must present Release Note and valid ID.
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium text-slate-900">Carrier Info</div>
                        <div className="text-sm text-slate-600 mt-1">{carrier}</div>
                        {trackingNumber && (
                            <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                Tracking: {trackingNumber} <ExternalLink size={12} />
                            </a>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-medium text-slate-900">Ship-from Address</div>
                        <div className="text-sm text-slate-600 mt-1">{shipFromAddress}</div>
                    </div>
                </div>
            )}

            <div className="mt-4 text-xs text-slate-500 italic">
                Do not release goods before status is ‘Ready for release’ and buyer or courier presents valid reference.
            </div>
        </div>
    );
};

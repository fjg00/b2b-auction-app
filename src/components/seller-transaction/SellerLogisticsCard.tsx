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
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Logistics</h3>

            {mode === 'pickup' ? (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg h-fit">
                            <MapPin size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Pickup Location</div>
                            <div className="text-sm text-gray-600 mt-1">{pickupLocation}</div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg h-fit">
                            <Truck size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Pickup Window</div>
                            <div className="text-sm text-gray-600 mt-1">{pickupWindow}</div>
                        </div>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-sm text-yellow-800">
                        <strong>Important:</strong> Buyer or courier must present Release Note and valid ID.
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg h-fit">
                            <Truck size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Carrier Info</div>
                            <div className="text-sm text-gray-600 mt-1">{carrier}</div>
                            {trackingNumber && (
                                <a href="#" className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1">
                                    Tracking: {trackingNumber} <ExternalLink size={12} />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg h-fit">
                            <MapPin size={20} className="text-gray-600" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-gray-900">Ship-from Address</div>
                            <div className="text-sm text-gray-600 mt-1">{shipFromAddress}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center italic">
                Do not release goods before status is ‘Ready for release’ and buyer or courier presents valid reference.
            </div>
        </div>
    );
};

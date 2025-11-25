import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { fetchLotById, placeBid } from '../services/auctionService';
import { Lot } from '@shared/types';
import { Clock, MapPin, Package, Truck, AlertTriangle } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailsScreen({ route, navigation }: any) {
    const { id } = route.params;
    const { user } = useAuth();
    const [lot, setLot] = useState<Lot | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadDetails();
    }, [id]);

    const loadDetails = async () => {
        try {
            const data = await fetchLotById(id);
            setLot(data);
            if (data) {
                setBidAmount(String((data.currentBid || 0) + (data.minBidIncrement || 10)));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBid = async () => {
        if (!lot || !user) {
            Alert.alert('Error', 'You must be logged in to place a bid');
            return;
        }
        const amount = Number(bidAmount);
        if (isNaN(amount) || amount <= lot.currentBid) {
            Alert.alert('Invalid Bid', 'Bid must be higher than current bid');
            return;
        }

        setSubmitting(true);
        try {
            const result = await placeBid(lot.id, amount, user.id);
            if (result.success) {
                Alert.alert('Success', result.message);
                loadDetails(); // Refresh
            } else {
                Alert.alert('Error', result.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to place bid');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <ActivityIndicator style={styles.center} size="large" color={COLORS.primary} />;
    if (!lot) return <View style={styles.center}><Text>Lot not found</Text></View>;

    // Check if current user is the seller
    const isOwner = user && lot.seller_id === user.id;

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <Image source={{ uri: lot.image }} style={styles.image} />

                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{lot.title}</Text>
                        <View style={styles.badges}>
                            <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
                                <Text style={[styles.badgeText, { color: '#d97706' }]}>{lot.condition}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.metaGrid}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Seller</Text>
                            <TouchableOpacity onPress={() => navigation.push('SellerProfile', { id: '1' })}>
                                <Text style={[styles.metaValue, { color: COLORS.primary, textDecorationLine: 'underline' }]}>{lot.seller?.name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Location</Text>
                            <Text style={styles.metaValue}>{lot.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Expiry</Text>
                            <Text style={styles.metaValue}>{lot.expiryDate}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Quantity</Text>
                            <Text style={styles.metaValue}>{lot.details?.quantity}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <Text style={styles.description}>{lot.description}</Text>
                    </View>

                    {!isOwner && (
                        <View style={styles.bidSection}>
                            <Text style={styles.sectionTitle}>Place a Bid</Text>
                            <View style={styles.bidInfo}>
                                <Text style={styles.label}>Current Bid</Text>
                                <Text style={styles.currentBid}>${lot.currentBid.toLocaleString()}</Text>
                            </View>

                            <View style={styles.bidInputRow}>
                                <Text style={styles.currency}>$</Text>
                                <TextInput
                                    style={styles.bidInput}
                                    value={bidAmount}
                                    onChangeText={setBidAmount}
                                    keyboardType="numeric"
                                />
                            </View>
                            <Text style={styles.helperText}>Minimum bid: ${(lot.currentBid + (lot.minBidIncrement || 10)).toLocaleString()}</Text>

                            <TouchableOpacity
                                style={[styles.bidButton, submitting && styles.disabledButton]}
                                onPress={handleBid}
                                disabled={submitting}
                            >
                                <Text style={styles.bidButtonText}>{submitting ? 'Placing Bid...' : 'Place Bid'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {isOwner && (
                        <View style={styles.sellerInfoBox}>
                            <Text style={styles.sellerInfoTitle}>Your Listing</Text>
                            <Text style={styles.sellerInfoText}>
                                This is your item. You cannot bid on your own listings.
                            </Text>
                            <View style={styles.sellerStats}>
                                <View style={styles.sellerStatItem}>
                                    <Text style={styles.sellerStatLabel}>Current Bid</Text>
                                    <Text style={styles.sellerStatValue}>${lot.currentBid.toLocaleString()}</Text>
                                </View>
                                <View style={styles.sellerStatItem}>
                                    <Text style={styles.sellerStatLabel}>Total Bids</Text>
                                    <Text style={styles.sellerStatValue}>{lot.bidsCount}</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Bid History</Text>
                        {lot.bids?.map((bid, index) => (
                            <View key={index} style={styles.bidRow}>
                                <Text style={styles.bidder}>{bid.bidder}</Text>
                                <Text style={styles.bidAmount}>${bid.amount}</Text>
                                <Text style={styles.bidTime}>{bid.time}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: COLORS.border,
    },
    content: {
        padding: SPACING.md,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
    },
    badge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.full,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: '500',
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    metaItem: {
        width: '50%',
        marginBottom: SPACING.md,
    },
    metaLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.text,
    },
    section: {
        marginBottom: SPACING.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    description: {
        fontSize: 16,
        color: COLORS.text,
        lineHeight: 24,
    },
    bidSection: {
        backgroundColor: COLORS.surface,
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    bidInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 16,
        color: COLORS.textMuted,
    },
    currentBid: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    bidInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        marginBottom: SPACING.xs,
    },
    currency: {
        fontSize: 20,
        color: COLORS.textMuted,
        marginRight: SPACING.sm,
    },
    bidInput: {
        flex: 1,
        fontSize: 20,
        paddingVertical: SPACING.md,
        color: COLORS.text,
    },
    helperText: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
    },
    bidButton: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    bidButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bidRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    bidder: {
        flex: 1,
        fontSize: 14,
        color: COLORS.text,
    },
    bidAmount: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    bidTime: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'right',
    },
    sellerInfoBox: {
        backgroundColor: '#E0F2F1',
        padding: SPACING.lg,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.lg,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    sellerInfoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    sellerInfoText: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    sellerStats: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    sellerStatItem: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
    },
    sellerStatLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    sellerStatValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

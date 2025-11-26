import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { fetchLotById, placeBid, createTransaction } from '../services/auctionService';
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

    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        loadDetails();
    }, [id]);

    useEffect(() => {
        if (!lot) return;

        const updateTimer = () => {
            const now = new Date();
            const end = new Date(lot.endTime);
            const diff = end.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('Ended');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${minutes}m ${seconds}s`);
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [lot]);

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

    const handleBuyNow = async () => {
        if (!lot || !user) {
            Alert.alert('Error', 'You must be logged in to buy');
            return;
        }

        Alert.alert(
            "Buy Now",
            `Are you sure you want to purchase this item for $${(lot.buyNowPrice || lot.currentBid).toLocaleString()}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Confirm Purchase",
                    onPress: async () => {
                        setSubmitting(true);
                        const amount = lot.buyNowPrice || lot.currentBid;
                        const result = await createTransaction(lot.id, user.id, amount);
                        setSubmitting(false);

                        if (result.success && result.transactionId) {
                            navigation.navigate('TransactionConfirmation', { transactionId: result.transactionId });
                        } else {
                            Alert.alert('Error', result.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading) return <ActivityIndicator style={styles.center} size="large" color={COLORS.primary} />;
    if (!lot) return <View style={styles.center}><Text>Lot not found</Text></View>;

    // Check if current user is the seller
    const isOwner = user && lot.seller_id === user.id;
    const [existingTransactionId, setExistingTransactionId] = useState<string | null>(null);

    useEffect(() => {
        const checkTransaction = async () => {
            if (user && lot) {
                const { getTransactionByLotId } = require('../services/auctionService');
                const tx = await getTransactionByLotId(lot.id, user.id);
                if (tx) {
                    setExistingTransactionId(tx.id);
                }
            }
        };
        checkTransaction();
    }, [user, lot]);

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
                            <TouchableOpacity onPress={() => lot.seller_id && navigation.push('SellerProfile', { id: lot.seller_id })}>
                                <Text style={[styles.metaValue, { color: COLORS.primary, textDecorationLine: 'underline' }]}>{lot.seller?.name}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Location</Text>
                            <Text style={styles.metaValue}>{lot.location}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Time Left</Text>
                            <Text style={[styles.metaValue, { color: COLORS.error, fontWeight: 'bold' }]}>{timeLeft}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaLabel}>Quantity</Text>
                            <Text style={styles.metaValue}>{lot.details?.quantity}</Text>
                        </View>
                        {lot.details?.deliveryMethod && (
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Delivery Method</Text>
                                <Text style={styles.metaValue}>{lot.details.deliveryMethod}</Text>
                            </View>
                        )}
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

                            <View style={styles.divider} />

                            {existingTransactionId ? (
                                <TouchableOpacity
                                    style={[styles.buyNowButton, { backgroundColor: COLORS.success }]}
                                    onPress={() => navigation.navigate('TransactionConfirmation', { transactionId: existingTransactionId })}
                                >
                                    <Text style={styles.buyNowText}>View Transaction</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.buyNowButton, submitting && styles.disabledButton]}
                                    onPress={handleBuyNow}
                                    disabled={submitting}
                                >
                                    <Text style={styles.buyNowText}>Buy Now for ${(lot.buyNowPrice || lot.currentBid).toLocaleString()}</Text>
                                </TouchableOpacity>
                            )}
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
        </KeyboardAvoidingView >
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
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md,
    },
    buyNowButton: {
        backgroundColor: COLORS.secondary,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: SPACING.sm,
    },
    buyNowText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

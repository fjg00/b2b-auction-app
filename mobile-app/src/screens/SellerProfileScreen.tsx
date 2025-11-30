import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, RADIUS } from '../constants/theme';
import { fetchSellerProfile } from '@shared/api';
import { SellerProfile } from '@shared/types';
import { MapPin, ShieldCheck, Star, Calendar, Package } from 'lucide-react-native';
import { LotCard } from '../components/LotCard';

export default function SellerProfileScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [profile, setProfile] = useState<SellerProfile | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [id]);

    const loadProfile = async () => {
        try {
            const data = await fetchSellerProfile(id);
            setProfile(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator style={styles.center} size="large" color={COLORS.primary} />;
    if (!profile) return <View style={styles.center}><Text>Seller not found</Text></View>;

    const renderHeader = () => (
        <View>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.type}>{profile.type}</Text>
                    <View style={styles.locationRow}>
                        <MapPin size={14} color={COLORS.textMuted} />
                        <Text style={styles.location}>{profile.location}</Text>
                    </View>
                </View>
                {profile.isVerified && (
                    <View style={styles.verifiedBadge}>
                        <ShieldCheck size={16} color="white" />
                    </View>
                )}
            </View>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Star size={20} color={COLORS.secondary} fill={COLORS.secondary} />
                    <Text style={styles.statValue}>{profile.rating}</Text>
                    <Text style={styles.statLabel}>Rating</Text>
                </View>
                <View style={styles.statItem}>
                    <Calendar size={20} color={COLORS.primary} />
                    <Text style={styles.statValue}>{profile.joinedDate}</Text>
                    <Text style={styles.statLabel}>Joined</Text>
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll}>
                {profile.kpis.map((kpi, index) => (
                    <View key={index} style={styles.kpiCard}>
                        <Text style={styles.kpiLabel}>{kpi.label}</Text>
                        <Text style={styles.kpiValue}>{kpi.value}</Text>
                        {kpi.subtext && <Text style={styles.kpiSubtext}>{kpi.subtext}</Text>}
                    </View>
                ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Auctions</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={profile.activeLots.filter(lot =>
                    lot.status === 'active' && new Date(lot.endTime) > new Date()
                )}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <LotCard
                        lot={item}
                        onPress={() => navigation.push('ItemDetails', { id: item.id })}
                    />
                )}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
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
    listContent: {
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 2,
    },
    type: {
        fontSize: 14,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginLeft: 4,
    },
    verifiedBadge: {
        backgroundColor: COLORS.primary,
        padding: 4,
        borderRadius: RADIUS.full,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: SPACING.lg,
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
    },
    kpiScroll: {
        marginBottom: SPACING.lg,
    },
    kpiCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginRight: SPACING.md,
        width: 140,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    kpiLabel: {
        fontSize: 12,
        color: COLORS.textMuted,
        marginBottom: 4,
    },
    kpiValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 2,
    },
    kpiSubtext: {
        fontSize: 10,
        color: COLORS.textMuted,
    },
    sectionHeader: {
        marginBottom: SPACING.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
});

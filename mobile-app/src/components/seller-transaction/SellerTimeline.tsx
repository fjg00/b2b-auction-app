import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants/theme';
import { CheckCircle, Circle, Clock } from 'lucide-react-native';

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
        <View style={styles.container}>
            <Text style={styles.title}>Transaction Timeline</Text>
            <View style={styles.timelineContainer}>
                {/* Connecting Line */}
                <View style={styles.line} />

                {events.map((event, index) => {
                    const isCompleted = event.status === 'completed';
                    const isCurrent = event.status === 'current';

                    return (
                        <View key={event.id} style={styles.eventRow}>
                            {/* Icon */}
                            <View style={[
                                styles.iconContainer,
                                isCompleted ? styles.iconCompleted :
                                    isCurrent ? styles.iconCurrent :
                                        styles.iconPending
                            ]}>
                                {isCompleted ? <CheckCircle size={16} color="#16a34a" /> :
                                    isCurrent ? <Clock size={16} color="#d97706" /> :
                                        <Circle size={16} color="#d1d5db" />}
                            </View>

                            {/* Content */}
                            <View style={styles.contentContainer}>
                                <Text style={[
                                    styles.eventLabel,
                                    isCurrent ? styles.textCurrent : styles.textNormal
                                ]}>
                                    {event.label}
                                </Text>
                                {event.date && (
                                    <Text style={styles.eventDate}>
                                        {event.date}
                                    </Text>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md,
    },
    timelineContainer: {
        position: 'relative',
        paddingLeft: 10,
    },
    line: {
        position: 'absolute',
        left: 24, // Center of the icon (14 + 10 padding)
        top: 14,
        bottom: 14,
        width: 2,
        backgroundColor: '#F3F4F6',
        zIndex: -1,
    },
    eventRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surface,
        marginRight: SPACING.sm,
    },
    iconCompleted: {
        backgroundColor: '#DCFCE7', // Green 100
    },
    iconCurrent: {
        backgroundColor: '#FEF3C7', // Amber 100
    },
    iconPending: {
        backgroundColor: '#F9FAFB', // Gray 50
    },
    contentContainer: {
        flex: 1,
        paddingTop: 4,
    },
    eventLabel: {
        fontSize: 14,
        marginBottom: 2,
    },
    textCurrent: {
        fontWeight: '600',
        color: COLORS.text,
    },
    textNormal: {
        color: COLORS.textMuted,
    },
    eventDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
});

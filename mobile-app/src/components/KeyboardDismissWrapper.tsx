import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View, StyleSheet, ViewStyle } from 'react-native';

interface KeyboardDismissWrapperProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export default function KeyboardDismissWrapper({ children, style }: KeyboardDismissWrapperProps) {
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[styles.container, style]}>
                {children}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

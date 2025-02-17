import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NewsLogo } from '@/components/NewsLogo';
import { formatSimpleDate } from '@/utils/dateFormatters';

interface NewsHeaderLeftItemProps {
    size: 'sm' | 'md ';
    secondaryTitle?: string;
    theme?: 'light' | 'dark';
    showNewsLogo?: boolean;
}

export const NewsHeaderLeftItem = ({ showNewsLogo = true, size, secondaryTitle, theme = 'light' }: NewsHeaderLeftItemProps) => {
    return (
        <View style={styles.headerLeft}>
            {showNewsLogo && <NewsLogo
                color={theme === 'light' ? '#000' : '#fff'}
                size={size === 'sm' ? 28 : 36}
            />}
            <Text
                style={[
                    styles.secondaryTitleContainer,
                    {
                        fontSize: size === 'sm' ? 20 : 28,
                        paddingTop: size === 'sm' ? 0 : 4
                    }
                ]}
            >
                {secondaryTitle ? (
                    secondaryTitle
                ) : formatSimpleDate()}
            </Text>

        </View>
    );
};

const styles = StyleSheet.create({
    headerLeft: {
        flexDirection: 'column',
        // alignItems: 'center',
       
    },
    secondaryTitleContainer: {
        fontWeight: '800',
        // opacity: 0.5,
        letterSpacing: -1,
        marginTop: -6,
        color: '#85848C'
    },
}); 
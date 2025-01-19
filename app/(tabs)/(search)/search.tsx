import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollViewWithHeaders, Header, ScrollHeaderProps } from '@codeherence/react-native-header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedAccordion } from '@/components/AnimatedAccordion';
import searchEntities from '@/app/data/search_entities.json';
import { CategoryCard } from '@/components/CategoryCard';
import { SearchData } from '@/app/types/search';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { BlurView } from 'expo-blur';
import Animated, { SharedValue } from 'react-native-reanimated';

const typedSearchEntities = searchEntities as SearchData;

const FadingView = ({ opacity, children, style }: { 
    opacity: SharedValue<number>, 
    children?: React.ReactNode,
    style?: any 
}) => (
    <Animated.View style={[{ opacity }, style]}>
        {children}
    </Animated.View>
);

export default function SearchScreen() {
    const { top, bottom } = useSafeAreaInsets();
    const scrollRef = React.useRef(null);

    const SearchComponent = () => (
        <View className="flex-row items-center bg-[#E3E2EA] px-3 h-[38px] rounded-[10px] flex-1">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
                placeholder="Channels, Topics, & Stories"
                className="flex-1 pl-2 text-[17px]"
                placeholderTextColor="#666"
            />
        </View>
    );

    const HeaderSurface = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <FadingView opacity={showNavBar} style={StyleSheet.absoluteFill}>
            <BlurView 
                style={StyleSheet.absoluteFill} 
                intensity={80} 
                tint="light"
            />
        </FadingView>
    );

    const HeaderComponent = ({ showNavBar }: { showNavBar: SharedValue<number> }) => (
        <Header
            borderWidth={0}
            showNavBar={showNavBar}
            SurfaceComponent={HeaderSurface}
            headerCenter={
                    <Text className="text-2xl font-bold">Following</Text>
        
            }
            headerRight={
                <View className="flex-row items-start px-4 pt-4">
                    <TouchableOpacity>
                        <Text className="text-[17px] text-[#fe425f]">Edit</Text>
                    </TouchableOpacity>
                </View>
            }
        
        />
    );

    const LargeHeaderComponent = () => {
        const insets = useSafeAreaInsets();
        return (
            <View className={`px-4 pt-2 pb-3 bg-white gap-3`} style={{ marginTop: -insets.top }}>
                <View className="flex-row justify-between items-start">
                    <NewsHeaderLeftItem size={'md'} secondaryTitle='Following' />
                </View>
                <SearchComponent />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <ScrollViewWithHeaders
                ref={scrollRef}
                contentContainerStyle={[{ paddingBottom: bottom }]}
                className="flex-1 bg-white"
                stickyHeaderIndices={[0]}
                maintainVisibleContentPosition={{
                    minIndexForVisible: 0,
                    autoscrollToTopThreshold: 0
                }}
                removeClippedSubviews={false}
                LargeHeaderComponent={LargeHeaderComponent}
                absoluteHeader={true}
                HeaderComponent={HeaderComponent}
                headerFadeInThreshold={0.5}
                disableLargeHeaderFadeAnim={false}
                initialAbsoluteHeaderHeight={110}
                headerContainerStyle={{ paddingTop: top + 4 }}
            >
                <View className="p-4 flex-col gap-4">
                    {typedSearchEntities.categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            icon={category.icon}
                        />
                    ))}
                </View>

                {typedSearchEntities.sections.map((section) => (
                    <AnimatedAccordion key={section.id} title={section.title}>
                        <View className="p-4 gap-3">
                            {section.items.map((item) => (
                                <CategoryCard
                                    key={item.id}
                                    title={item.title}
                                    logo={item.logo}
                                />
                            ))}
                        </View>
                    </AnimatedAccordion>
                ))}
            </ScrollViewWithHeaders>
        </View>
    );
} 
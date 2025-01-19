import { Text, Image, View, StyleSheet, Pressable, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useState, useRef } from 'react';
import Animated, { 
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { news } from '@/data/news.json';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NewsLogo } from '@/components/NewsLogo';
import { styles } from '@/styles/screens/audio';
import { FlashList } from '@shopify/flash-list';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsItem, NewsItemType } from '@/components/NewsItem';
import { SwipeableNewsItem } from '@/components/SwipeableNewsItem';
import { NewsHeaderLeftItem } from '@/components/NewsHeaderLeftItem';
import { TabMenu } from '@/components/TabMenu';
import { Colors } from '@/constants/Colors';
import { PodcastItem } from '@/components/PodcastItem';
import { PodcastEpisode } from '@/types/podcast';
import podcasts from '@/data/podcasts.json';
import type { ListRenderItemInfo } from '@shopify/flash-list';
import { useAudio } from '@/contexts/AudioContext';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { PodcastEditorsPickItem } from '@/components/PodcastEditorsPickItem';

interface Source {
  id: string;
  name: string;
  logo_transparent_light: string;
  logo_transparent_dark: string;
}

interface Topic {
  id: string;
  name: string;
}

interface Author {
  name: string;
}

interface NewsItem {
  id: string;
  title: string;
  source: Source;
  created_at: string;
  topic: Topic;
  show_topic: boolean;
  author: Author;
  featured_image: string;
  card_type: 'full' | 'medium';
}

interface PodcastEpisodeData {
  id: string;
  type: string;
  attributes: {
    name: string;
    itunesTitle: string;
    kind: string;
    description: {
      standard: string;
      short: string;
    };
    artwork: {
      url: string;
      width: number;
      height: number;
    };
    durationInMilliseconds: number;
    releaseDateTime: string;
    assetUrl: string;
    artistName: string;
  };
}

const TABS = [
  { id: 'best', label: 'Best of News+', icon: 'heart' },
  { id: 'magazines', label: 'My Magazines', icon: 'book' },
  { id: 'downloaded', label: 'Downloaded', icon: 'download' },
  { id: 'newspapers', label: 'Newspapers', icon: 'newspaper' },
  { id: 'catalog', label: 'Catalog', icon: 'list' },
];

const DiscoverNewsButton = () => {
  return (
    <View className=" mb-4">
      <TouchableOpacity 
        onPress={() => Alert.alert('Take to Apple Podcasts')}
        style={{
          height: 56,
          backgroundColor: '#2196A5',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          justifyContent: 'space-between',
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="headset" size={24} color="#fff" />
          <View>
            <Text style={{ color: '#fff', fontSize: 20 }} className="font-bold">
              Discover News+ Narrated
            </Text>
            <View className="flex-row items-center gap-1">
              <Text style={{ color: '#fff', fontSize: 13, opacity: 0.8 }}>
                More audio stories in Apple Podcasts
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </View>
          </View>
        </View>
        <Ionicons 
          name="headset" 
          size={80} 
          color="#fff" 
          style={{ 
            position: 'absolute',
            right: -10,
            opacity: 0.1
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function AudioScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const segments = useSegments();

  // Get the current group (tab) from segments
  const currentGroup = segments[1]; // Should return 'index', 'news+', 'sports', etc.

  // const iconColor = colorScheme === 'light' ? '#000' : '#fff';
  const iconColor = '#fff';

  const backgroundColor = colorScheme === 'light' ? '#F2F2F6' : '#1C1C1E';
  const insets = useSafeAreaInsets();

  const AnimatedSwipeListView = Animated.createAnimatedComponent(SwipeListView);

  const [activeTab, setActiveTab] = useState('best');

  const handleTabPress = (tabId: string) => {
    setActiveTab(tabId);
  };

  const { currentEpisode, playEpisode, isPlaying, togglePlayPause } = useAudio();
  
  const handlePlayAll = () => {
    const firstEpisode = podcasts.results['podcast-episodes'][0].data[0] as PodcastEpisodeData;
    
    if (firstEpisode) {
      const imageUrl = firstEpisode.attributes.artwork?.url?.replace('{w}', '300').replace('{h}', '300').replace('{f}', 'jpg') || 'https://via.placeholder.com/300';

      const podcast: PodcastEpisode = {
        id: firstEpisode.id,
        title: firstEpisode.attributes.name,
        streamUrl: firstEpisode.attributes.assetUrl,
        artwork: { url: imageUrl },
        showTitle: firstEpisode.attributes.artistName,
        duration: firstEpisode.attributes.durationInMilliseconds,
        releaseDate: firstEpisode.attributes.releaseDateTime,
        summary: firstEpisode.attributes.description.standard
      };

      playEpisode(podcast);
      router.push(`/audio/${firstEpisode.id}`);
    }
  };

  const renderPodcastItem = ({ item, index }: ListRenderItemInfo<PodcastEpisodeData>) => (
    <PodcastItem 
      episode={item} 
      index={index}
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'best':
        const episodes = (podcasts.results['podcast-episodes'][0].data || []) as PodcastEpisodeData[];
        const remainingEpisodes = episodes.slice(5);
        return (
          <FlashList
            data={remainingEpisodes}
            renderItem={renderPodcastItem}
            estimatedItemSize={84}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <View style={styles.headerContainer}>
                <View style={styles.header}>
                  <NewsHeaderLeftItem size="md" secondaryTitle="Audio" />
                  <View style={styles.headerRight}>
                    <TouchableOpacity 
                      style={[styles.headerRightButton, { backgroundColor: currentEpisode ? '#86858D' : Colors.light.tint }]}
                      onPress={currentEpisode ? togglePlayPause : handlePlayAll}
                    >
                      {isPlaying ? (
                        <AudioVisualizer isPlaying={true} />
                      ) : (
                        <Ionicons name="headset" size={14} color={'#fff'} />
                      )}
                      <Text style={styles.headerRightText}>
                        {currentEpisode ? (isPlaying ? 'Playing' : 'Paused') : 'Play'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <PodcastEditorsPickItem episodes={episodes} />
                <DiscoverNewsButton />
                <Text style={styles.sectionTitle}>For You</Text>
              </View>
            }
          />
        );
      case 'magazines':
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>My Magazines Content</Text>
          </View>
        );
      case 'downloaded':
        return (
          <View style={styles.emptyContent}>
            <Text style={styles.emptyText}>Downloaded Content</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }}>
      <View style={[styles.container, { backgroundColor: colorScheme === 'light' ? '#F2F2F6' : '#0D0D09' }]}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}


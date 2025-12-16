/**
 * RecommendationCarousel Component
 * 
 * Displays personalized recommendations in a horizontal scrollable carousel
 * with swipe gestures and interaction tracking
 * 
 * Usage:
 * <RecommendationCarousel
 *   recommendations={[...]}
 *   onSwipe={(id) => handleSwipe(id)}
 *   onPress={(id) => handlePress(id)}
 * />
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from 'react-native';

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: string;
  savings: number;
  relevanceScore: number;
  urgency: 'low' | 'medium' | 'high';
  imageUrl?: string;
  cta: string;
}

export interface RecommendationCarouselProps {
  recommendations: Recommendation[];
  onSwipe?: (id: string) => void;
  onPress?: (id: string) => void;
  onDismiss?: (id: string) => void;
  theme?: 'light' | 'dark';
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const URGENCY_COLORS = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
};

const CATEGORY_ICONS = {
  savings: '💰',
  health: '🏥',
  wellness: '🧘',
  education: '📚',
  offers: '🎁',
  other: '⭐',
};

export const RecommendationCarousel: React.FC<RecommendationCarouselProps> = ({
  recommendations,
  onSwipe,
  onPress,
  onDismiss,
  theme = 'light',
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const visibleRecommendations = recommendations.filter((r) => !dismissedIds.has(r.id));

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + 16));
    setActiveIndex(Math.min(index, visibleRecommendations.length - 1));
  };

  const handleDismiss = (id: string) => {
    setDismissedIds((prev) => new Set([...prev, id]));
    onDismiss?.(id);
  };

  const handleCardPress = (id: string) => {
    onPress?.(id);
  };

  if (visibleRecommendations.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme === 'light' ? '#f5f5f5' : '#1a1a1a' }]}>
        <Text style={[styles.emptyText, { color: theme === 'light' ? '#666' : '#aaa' }]}>
          No recommendations at this time
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
          Recommended for You
        </Text>
        <Text style={[styles.subtitle, { color: theme === 'light' ? '#666' : '#aaa' }]}>
          {activeIndex + 1} of {visibleRecommendations.length}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.carousel}
      >
        {visibleRecommendations.map((recommendation) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onPress={() => handleCardPress(recommendation.id)}
            onDismiss={() => handleDismiss(recommendation.id)}
            theme={theme}
          />
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {visibleRecommendations.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === activeIndex ? '#007AFF' : '#ccc',
                width: index === activeIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onPress: () => void;
  onDismiss: () => void;
  theme: 'light' | 'dark';
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onPress,
  onDismiss,
  theme,
}) => {
  const urgencyColor = URGENCY_COLORS[recommendation.urgency];
  const categoryIcon = CATEGORY_ICONS[recommendation.category as keyof typeof CATEGORY_ICONS] || CATEGORY_ICONS.other;

  return (
    <View style={[styles.card, { backgroundColor: theme === 'light' ? '#fff' : '#2a2a2a' }]}>
      {recommendation.imageUrl && (
        <Image source={{ uri: recommendation.imageUrl }} style={styles.cardImage} />
      )}

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>{categoryIcon}</Text>
            <Text style={[styles.categoryText, { color: theme === 'light' ? '#333' : '#ddd' }]}>
              {recommendation.category}
            </Text>
          </View>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.cardTitle, { color: theme === 'light' ? '#000' : '#fff' }]}>
          {recommendation.title}
        </Text>

        <Text style={[styles.cardDescription, { color: theme === 'light' ? '#666' : '#aaa' }]}>
          {recommendation.description}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.savingsSection}>
            <Text style={[styles.savingsLabel, { color: theme === 'light' ? '#666' : '#aaa' }]}>
              Estimated Savings
            </Text>
            <Text style={styles.savingsAmount}>${recommendation.savings.toLocaleString()}</Text>
          </View>

          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColor }]}>
            <Text style={styles.urgencyText}>{recommendation.urgency}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.ctaButton} onPress={onPress}>
          <Text style={styles.ctaButtonText}>{recommendation.cta}</Text>
        </TouchableOpacity>

        <View style={styles.relevanceBar}>
          <View
            style={[
              styles.relevanceFill,
              { width: `${recommendation.relevanceScore * 100}%` },
            ]}
          />
        </View>
        <Text style={[styles.relevanceText, { color: theme === 'light' ? '#999' : '#777' }]}>
          {Math.round(recommendation.relevanceScore * 100)}% match
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
  },
  carousel: {
    marginHorizontal: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dismissButton: {
    padding: 4,
  },
  dismissIcon: {
    fontSize: 18,
    color: '#999',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  savingsSection: {
    flex: 1,
  },
  savingsLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  savingsAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4CAF50',
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  urgencyText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    textTransform: 'capitalize',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  relevanceBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  relevanceFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  relevanceText: {
    fontSize: 11,
    textAlign: 'right',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
});

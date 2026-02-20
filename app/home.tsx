import React, { useEffect, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  FlatList,
  ActivityIndicator,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { fetchNews, NewsArticle } from '@/services/newsApi';

function formatDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function NewsCard({ article }: { article: NewsArticle }) {
  const handlePress = () => {
    if (article.url) {
      WebBrowser.openBrowserAsync(article.url);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={{ width: '100%' }}>
      <Box
        className="flex-row items-start bg-background-0 shadow-hard-5 rounded-xl p-5"
        style={{
          borderWidth: 1,
          borderColor: '#DDDCDB',
          height: 200,
          gap: 24,
        }}
      >
        {/* Thumbnail */}
        {article.image ? (
          <Image
            source={{ uri: article.image }}
            style={{ width: 140.5, height: 160 }}
            resizeMode="cover"
          />
        ) : (
          <Box
            className="bg-background-200 items-center justify-center"
            style={{ width: 140.5, height: 160 }}
          >
            <Text className="text-typography-400 text-3xl">📰</Text>
          </Box>
        )}

        {/* Content */}
        <Box className="flex-1 justify-between h-full py-1">
          {/* Date & Source */}
          <Box className="mb-2">
            <Text
              className="text-2xs text-typography-700 mb-1"
              style={{ width: 140.5 }}
            >
              {formatDate(article.datetime)}
            </Text>
            <Text
              className="text-2xs text-typography-800"
              style={{ width: 94, height: 14 }}
            >
              {article.source}
            </Text>
          </Box>

          {/* Headline */}
          <Text
            className="text-base font-bold text-typography-900 flex-1 self-stretch"
            numberOfLines={4}
            style={{ letterSpacing: 0.2 }}
          >
            {article.headline}
          </Text>

          {/* Read More */}
          <Text className="text-2xs text-typography-600 underline mt-auto">
            Read More
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
}

export default function Home() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const articles = await fetchNews('general');
      setNews(articles);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  if (loading) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center">
        <ActivityIndicator size="large" color="#805AD5" />
        <Text className="mt-4 text-typography-500">Loading news...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 bg-background-0 items-center justify-center px-6">
        <Text className="text-4xl mb-4">⚠️</Text>
        <Heading className="text-lg text-typography-900 mb-2">
          Unable to load news
        </Heading>
        <Text className="text-typography-500 text-center mb-6">{error}</Text>
        <Button
          size="md"
          className="bg-primary-500 rounded-3xl px-8"
          onPress={() => loadNews()}
        >
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NewsCard article={item} />}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 24, // px-6
          gap: 12, // gap-3 between items
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadNews(true)}
            tintColor="#805AD5"
          />
        }
        ListHeaderComponent={
          <Box className="pt-safe px-4 pb-4 mt-8">
            <Heading
              style={{
                color: '#000',
                fontFamily: 'Roboto',
                fontSize: 36,
                fontStyle: 'normal',
                fontWeight: '400',
                lineHeight: undefined,
              }}
            >
              News Feed
            </Heading>
          </Box>
        }
        ListEmptyComponent={
          <Box className="items-center justify-center py-20">
            <Text className="text-typography-400 text-base">
              No news articles available
            </Text>
          </Box>
        }
      />
    </Box>
  );
}

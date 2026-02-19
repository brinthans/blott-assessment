import React, { useEffect, useState, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { fetchNews, NewsArticle } from '@/services/newsApi';

function formatDate(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

function NewsCard({ article }: { article: NewsArticle }) {
  const handlePress = () => {
    if (article.url) {
      WebBrowser.openBrowserAsync(article.url);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Box className="flex-row bg-background-50 rounded-2xl mx-4 mb-3 overflow-hidden shadow-sm">
        {article.image ? (
          <Image
            source={{ uri: article.image }}
            style={{ width: 100, height: 100 }}
            resizeMode="cover"
          />
        ) : (
          <Box className="w-[100px] h-[100px] bg-background-200 items-center justify-center">
            <Text className="text-typography-400 text-2xl">📰</Text>
          </Box>
        )}
        <Box className="flex-1 p-3 justify-between">
          <Text
            className="font-semibold text-sm text-typography-900 leading-5"
            numberOfLines={2}
          >
            {article.headline}
          </Text>
          <Box className="flex-row items-center mt-2">
            <Text className="text-xs text-typography-500 font-medium">
              {article.source}
            </Text>
            <Text className="text-xs text-typography-400 mx-1">•</Text>
            <Text className="text-xs text-typography-400">
              {formatDate(article.datetime)}
            </Text>
          </Box>
        </Box>
      </Box>
    </Pressable>
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
        <ActivityIndicator size="large" color="#6366f1" />
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
          className="bg-primary-500 rounded-full px-8"
          onPress={() => loadNews()}
        >
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      <Box className="pt-safe px-4 pb-2 bg-background-0">
        <Heading className="text-2xl font-bold text-typography-900 mt-4">
          Headlines
        </Heading>
      </Box>
      <FlatList
        data={news}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <NewsCard article={item} />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadNews(true)}
            tintColor="#6366f1"
          />
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

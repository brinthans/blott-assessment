import React, { useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { useNewsStore, NewsState } from '@/store/useNewsStore';
import { useAuthStore } from '@/store/useAuthStore';
import { NewsArticle } from '@/services/newsApi';
import NewsCard from '@/components/NewsCard';

const keyExtractor = (item: NewsArticle) => item.id.toString();

const ListHeader = () => (
  <Box className="pt-safe px-4 pb-4 mt-8">
    <Box className="flex-row items-center justify-between">
      <Heading className="text-4xl font-normal text-black">
        News Feed
      </Heading>
      <Button
        size="sm"
        variant="outline"
        className="rounded-3xl border-red-400"
        onPress={() =>
          Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Logout', style: 'destructive', onPress: () => useAuthStore.getState().reset() },
            ]
          )
        }
      >
        <ButtonText className="text-red-500 text-sm">Logout</ButtonText>
      </Button>
    </Box>
  </Box>
);

const ListEmpty = () => (
  <Box className="items-center justify-center py-20">
    <Text className="text-typography-400 text-base">
      No news articles available
    </Text>
  </Box>
);

export default function Home() {
  const articles = useNewsStore((s: NewsState) => s.articles);
  const loading = useNewsStore((s: NewsState) => s.loading);
  const refreshing = useNewsStore((s: NewsState) => s.refreshing);
  const error = useNewsStore((s: NewsState) => s.error);
  const fetchNews = useNewsStore((s: NewsState) => s.fetchNews);

  useEffect(() => {
    fetchNews('general');
  }, [fetchNews]);

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => <NewsCard article={item} />,
    []
  );

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
          onPress={() => fetchNews('general')}
        >
          <ButtonText>Try Again</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      <FlatList
        data={articles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 24, gap: 12 }}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchNews('general', true)}
            tintColor="#805AD5"
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
      />
    </Box>
  );
}

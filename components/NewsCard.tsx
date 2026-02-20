import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { Image, TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { NewsArticle } from '@/services/newsApi';
import { formatDate } from '@/utils/formatDate';

const NewsCard = React.memo(function NewsCard({ article }: { article: NewsArticle }) {
    const handlePress = () => {
        if (article.url) {
            WebBrowser.openBrowserAsync(article.url);
        }
    };

    return (
        <TouchableOpacity onPress={handlePress} activeOpacity={0.85} style={{ width: '100%' }}>
            <Box className="flex-row items-start bg-background-0 shadow-hard-5 rounded-xl p-5 h-[200px] gap-6 border border-[#DDDCDB]">
                {/* Thumbnail */}
                {article.image ? (
                    <Image
                        source={{ uri: article.image }}
                        className="w-[140.5px] h-[160px] bg-background-200"
                        resizeMode="cover"
                    />
                ) : (
                    <Box className="bg-background-200 items-center justify-center w-[140.5px] h-[160px]">
                        <Text className="text-typography-400 text-3xl">📰</Text>
                    </Box>
                )}

                {/* Content */}
                <Box className="flex-1 h-full py-1">
                    {/* Date & Source */}
                    <Box className="mb-2">
                        <Text className="text-2xs text-typography-700 mb-1 w-[140.5px]">
                            {formatDate(article.datetime)}
                        </Text>
                        <Text className="text-2xs text-typography-800 w-[94px] h-[14px]">
                            {article.source}
                        </Text>
                    </Box>

                    {/* Headline */}
                    <Text
                        className="text-base font-bold leading-5 text-typography-900 self-stretch tracking-[0.2px]"
                        numberOfLines={4}
                    >
                        {article.headline}
                    </Text>

                    {/* Read More */}
                    <Text className="text-2xs text-typography-600 underline mt-2">
                        Read More
                    </Text>
                </Box>
            </Box>
        </TouchableOpacity>
    );
});

export default NewsCard;

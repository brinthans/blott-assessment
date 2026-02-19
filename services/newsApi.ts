const API_KEY = 'crals9pr01qhk4bqotb0crals9pr01qhk4bqotbg';
const BASE_URL = 'https://finnhub.io/api/v1';

export interface NewsArticle {
    id: number;
    category: string;
    datetime: number;
    headline: string;
    image: string;
    related: string;
    source: string;
    summary: string;
    url: string;
}

export async function fetchNews(
    category: string = 'general',
    minId?: number
): Promise<NewsArticle[]> {
    let url = `${BASE_URL}/news?category=${category}&token=${API_KEY}`;
    if (minId !== undefined) {
        url += `&minId=${minId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
    }

    return response.json();
}

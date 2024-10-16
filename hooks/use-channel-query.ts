import { axiosInstance } from "@/core/axios";
import { useSocket } from "@/providers/socket-provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface ChatQueryProps {
    queryKey: string;
    apiUrl: string;
    paramKey: "channelId" | "conversationId" | "groupId";
    paramValue: string;
}

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
    const { isConnected } = useSocket();

    const fetchMessages = async (pageParam: number) => {
        const url = qs.stringifyUrl(
            {
                url: apiUrl,
                query: {
                    cursor: pageParam !== 1 ? pageParam : null,
                    [paramKey]: paramValue,
                },
            },
            { skipNull: true }
        );

        const { data } = await axiosInstance.get(url);
        return data;
    };

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
        useInfiniteQuery({
            queryKey: [queryKey],
            queryFn: ({ pageParam }) => fetchMessages(pageParam),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.nextCursor || null,
            refetchInterval: isConnected ? false : 1000,
            select: (data) => {
                const allItems = data.pages.flatMap(page => page.items).reverse();
    
                return {
                    ...data,
                    pages: [{
                        items: allItems
                    }]
                };
            }
        });

    return {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status
    };
}

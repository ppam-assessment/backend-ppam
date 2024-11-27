export const groupByTopic: { [key: string]: number[] } = {
    "0": [0],
    "1": [1, 2, 3, 4],
    "2": [5],
    "3": [6],
    "4": [7],
    "5": [8],
    "6": [9],
    "7": [10],
    "8": [11],
    "9": [12],
    "10": [13]
};

interface Response {
    id: number;
    topicId: number;
    number: number | null;
    question: string;
    value?: string;
    comment?: string | null;
    sub?: SubResponse[];
}

interface SubResponse {
    id: number;
    question: string;
    value?: string;
    comment?: string | null;
}

interface GroupedResponses {
    [key: string]: Response[];
}

export const groupResponsesByTopic = (responses: Response[] | undefined): GroupedResponses => {
    const groupedResponses: GroupedResponses = {};

    for (const [groupKey, topicIds] of Object.entries(groupByTopic)) {
        const groupItems = responses?.filter(item => topicIds.includes(item.topicId));

        if (groupItems && groupItems.length > 0) {
            groupedResponses[groupKey] = groupItems;
        }
    }

    return groupedResponses;
};
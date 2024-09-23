// Define type for the groupByTopic object
const groupByTopic: { [key: string]: number[] } = {
    "0": [0],
    "1": [1, 2, 3, 4, 5],
    "2": [6],
    "3": [7],
    "4": [8],
    "5": [9],
    "6": [10],
    "7": [11],
    "8": [12],
    "9": [13]
};

// Define the response structure
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

// Define the grouped responses structure
interface GroupedResponses {
    [key: string]: Response[];
}

// Function to group responses by topic
const groupResponsesByTopic = (responses: Response[] | undefined): GroupedResponses => {
    const groupedResponses: GroupedResponses = {};

    // Iterate over the keys in the groupByTopic object
    for (const [groupKey, topicIds] of Object.entries(groupByTopic)) {
        // Filter responses by topicId present in each group
        const groupItems = responses?.filter(item => topicIds.includes(item.topicId));

        // Save the filtered results into the groupedResponses object by groupKey
        if (groupItems && groupItems.length > 0) {
            groupedResponses[groupKey] = groupItems;
        }
    }

    return groupedResponses;
};

export default groupResponsesByTopic;

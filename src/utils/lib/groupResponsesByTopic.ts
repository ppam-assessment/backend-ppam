// Define type for the groupByTopic object
const groupByTopic: { [key: string]: number[] } = {
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

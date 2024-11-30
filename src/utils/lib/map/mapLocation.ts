import { choiceIdeal, choiceYa } from "../data/ChoiceOpt.js";
import mapGroup from "../data/mapGroup.js";

interface ProvinceResponses {
    province: {
        name: string;
    } | null;
    responder: {
        response: {
            value: string;
            instrument: {
                topicId: number;
            };
        }[];
    };
}

interface InstrumentByTopic {
    id: number;
    _count: {
        instrument: number;
    };
}

interface result {
    province: string,
    score: object
}

const choiceOpts = [...choiceYa, ...choiceIdeal]

const mapLocation = async (provinceResponses: ProvinceResponses[], instrumentByTopic: InstrumentByTopic[]): Promise<result[]> => {

    const mappedData = provinceResponses.map(data => {
        return {
            province: data.province?.name || 'Unknown Province',
            score: mapGroup.reduce((scoreObj, group) => {
                const groupScore = group.topicId.reduce((totalTopicScore, id) => {
                    const filteredResponse = data.responder.response.filter(response => response.instrument.topicId === id)

                    const topicScore = filteredResponse.reduce((totalResponseScore, resp) => {
                        const respScore = choiceOpts.find(choice => choice.value === resp.value)?.score || 0

                        return totalResponseScore += respScore;
                    }, 0)

                    return totalTopicScore += topicScore
                }, 0)

                const totalInstrumentInGroup = group.topicId.reduce((total, topicId) => {
                    const topicData = instrumentByTopic.find((topic) => topic.id === topicId);
                    return total + (topicData?._count.instrument || 0);
                }, 0);

                const percentage = groupScore / totalInstrumentInGroup * 100

                scoreObj[group.name] = percentage+'%'

                return scoreObj
            }, {} as Record<string, string>)
        }
    })

    return mappedData
}

export default mapLocation
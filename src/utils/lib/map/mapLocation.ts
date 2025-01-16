import { InstrumentType } from "@prisma/client";
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
                type: InstrumentType;
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
    province: string;
    score: Record<string, number>;
}


const choiceOpts = [...choiceYa, ...choiceIdeal]

const mapLocation = async (provinceResponses: ProvinceResponses[], instrumentByTopic: InstrumentByTopic[]): Promise<result[]> => {

    const mappedData = provinceResponses.map(data => {
        return {
            province: data.province?.name || 'Unknown Province',
            score: mapGroup.reduce((scoreObj, group) => {
                const groupScore = group.topicId.reduce((totalTopicScore, id) => {
                    const filteredResponse = data.responder.response.filter(response => response.instrument.topicId === id);

                    const topicScore = filteredResponse.reduce((totalResponseScore, resp) => {
                        let respScore = 0;
                        if (resp.instrument.type === InstrumentType.checkbox) {
                            const checkboxResponses = filteredResponse.filter(fr => fr.instrument.type === InstrumentType.checkbox).length;
                            respScore = checkboxResponses >= 2 ? 2 : checkboxResponses;
                        } else {
                            respScore = choiceOpts.find(choice => choice.value === resp.value)?.score || 0;
                        }

                        return totalResponseScore += respScore;
                    }, 0);

                    return totalTopicScore += topicScore;
                }, 0);

                const totalInstrumentInGroup = group.topicId.reduce((total, topicId) => {
                    const topicData = instrumentByTopic.find((topic) => topic.id === topicId);
                    return total + (topicData?._count.instrument || 0);
                }, 0);

                const averageScore = groupScore / totalInstrumentInGroup;

                scoreObj[group.name] = averageScore;

                return scoreObj;
            }, {} as Record<string, number>)
        }
    });

    return mappedData;
};

export default mapLocation
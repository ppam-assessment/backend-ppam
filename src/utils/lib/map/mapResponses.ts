import { InstrumentType } from "@prisma/client";

interface Response {
    number: number | null;
    topicId: number;
    id: number;
    question: string;
    type: InstrumentType;
    respons: {
        value: string;
        comment: string | null;
    }[];
    sub: {
        id: number;
        question: string;
        type: InstrumentType;
        respons: {
            value: string;
            comment: string | null;
        }[];
    }[];
    topic: {
        topic: string,
        part: number
    }
}

// interface MappedResponse {
//     id: number;
//     number: number | null;
//     topicId: number;
//     question: string;
//     value?: string;
//     comment?: string | null;
//     sub?: SubMappedResponse[];
// }

interface SubMappedResponse {
    id: number;
    question: string;
    value?: string;
    comment?: string | null;
}

export const mapResponses = (responses: Response[]) => {

    return responses.map(item => {
        return {
            id: item.id,
            number: item.number,
            topicId: item.topicId,
            question: item.question,
            value: item.respons[0]?.value,
            comment: item.respons[0]?.comment,
            sub: item.type === InstrumentType.sub ? item.sub.map(subItem => {
                return {
                    id: subItem.id,
                    question: subItem.question,
                    value: subItem.respons[0]?.value,
                    comment: subItem.respons[0]?.comment,
                };
            }) : undefined
        };
    });
};

export const mapXlsResponses = (response: Response[]) => {
    return response.map(item => {
        return {
            question: item.question,
            answer: item.respons,
            comment: item.respons[0].comment,
            title: item.topic.topic,
            topicId: item.topicId,
            topicTitle: item.topic.part,
            id: item.id,
        }
    });

}
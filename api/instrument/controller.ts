import { FastifyReply, FastifyRequest } from "fastify";
import { getAllInstrument } from "../../service/prisma/instrument.js";
import { getSession, getSessionUser } from "../../service/prisma/session.js";
import { error } from "console";

export async function getAllInstrumentController(req: FastifyRequest, res: FastifyReply) {
    const { from, to } = req.query as { from?: string, to?: string };
    const fromNumber = from ? parseInt(from, 10) : undefined;
    const toNumber = to ? parseInt(to, 10) : undefined;

    const choiceya = [
        {
            value: 'Ideal',
            code: 1
        },
        {
            value: 'Minimal Diperlukan',
            code: 2
        },
        {
            value: 'Tidak Memadai',
            code: 3
        },
    ]
    const choiceideal = [
        {
            value: 'Ideal',
            code: 1
        },
        {
            value: 'Minimal Diperlukan',
            code: 2
        },
        {
            value: 'Tidak Memadai',
            code: 3
        },
    ]

    const instruments = await getAllInstrument({ from: fromNumber, to: toNumber });
    const result = instruments.map(instrument => {
        const { id, number, topicId, question, choice, sub } = instrument;
        let { type } = instrument;
        let caseShape = {};
        switch (type) {
            case 'dropdown':
            case 'dropdownya':
                caseShape = {
                    choice: choiceya
                }
                type = 'dropdown'
                break;

            case 'dropdownideal':
                caseShape = {
                    choice: choiceideal
                }
                type = 'dropdown'
                break;

            case 'checkbox':
                caseShape = {
                    choice
                }
                break;
            case 'sub':
                caseShape = {
                    sub: sub.map(item => {
                        const { id, question, type } = item
                        const isDropdown = type.includes('dropdown')
                        let choice = undefined

                        if (type === 'dropdownya') {
                            choice = choiceya
                        } else if (type === 'dropdownideal') {
                            choice = choiceideal
                        }
                        return {
                            id: item.id,
                            question: item.question,
                            type: isDropdown ? 'dropdown' : item.type,
                            choice
                        }
                    })
                }
                break;

            default:
                break;
        }

        return {
            id, number, topicId, question, type, ...caseShape
        }
    })

    res.code(200).send({
        message: 'Success.',
        data: result
    })
}
import { FastifyReply, FastifyRequest } from "fastify";
import { getAllInstrument } from "../../service/prisma/instrument.js";
import { getSession, getSessionUser } from "../../service/prisma/session.js";
import { error } from "console";

export async function getAllInstrumentController(req: FastifyRequest, res: FastifyReply) {
    const { from, to } = req.query as { from?: string, to?: string };
    const fromNumber = from ? parseInt(from, 10) : undefined;
    const toNumber = to ? parseInt(to, 10) : undefined;

    const instruments = await getAllInstrument({ from: fromNumber, to: toNumber });
    const result = instruments.map(instrument => {
        const { id, number, topicId, question, type, choice, sub } = instrument;
        let caseShape = {};
        switch (type) {
            case 'select':
            case 'multiselect':
                caseShape = {
                    choice
                }
                break;
            case 'sub':
                caseShape = {
                    sub
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
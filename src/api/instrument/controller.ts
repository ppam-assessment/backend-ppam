import { FastifyReply, FastifyRequest } from "fastify";
import { getAllInstrument, updateInstrumentsQuestion } from "../../service/prisma/instrument.js";
import { choiceYa, choiceIdeal, choiceCheck } from "../../utils/ChoiceOpt.js"
import { readAreaChoices } from "../../service/prisma/area.js";
import { PutInstrumentsSchema } from "./schema.js";
import { Status } from "@prisma/client";
import { NotFound } from "../../exceptions/NotFound.js";
import { Forbidden } from "../../exceptions/Forbidden.js";
import { getSessionUser } from "../../service/prisma/session.js";

export const getAllInstrumentController = async (req: FastifyRequest, res: FastifyReply) => {
    const { from, to } = req.query as { from?: string, to?: string };
    const fromNumber = from ? parseInt(from, 10) : undefined;
    const toNumber = to ? parseInt(to, 10) : undefined;

    const instruments = await getAllInstrument({ from: fromNumber, to: toNumber });
    const result = instruments.map(instrument => {
        const { id, number, topicId, question, sub } = instrument;
        let { type } = instrument;
        let caseShape = {};
        switch (type) {
            case 'dropdown':
            case 'dropdownya':
                caseShape = {
                    choice: choiceYa
                }
                type = 'dropdown'
                break;

            case 'dropdownideal':
                caseShape = {
                    choice: choiceIdeal
                }
                type = 'dropdown'
                break;

            case 'checkbox':
                caseShape = {
                    choice: choiceCheck
                }
                break;
            case 'sub':
                caseShape = {
                    sub: sub.map(item => {
                        const { id, question, type } = item
                        const isDropdown = type.includes('dropdown')
                        let choice = undefined

                        if (type === 'dropdownya') {
                            choice = choiceYa
                        } else if (type === 'dropdownideal') {
                            choice = choiceIdeal
                        } else if ( type === 'checkbox' ) {
                            choice = choiceCheck
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

export const getAreaController = async (req: FastifyRequest, res: FastifyReply) => {
    const areaChoice = await readAreaChoices();

    return res.code(200).send({
        data: areaChoice
    })
}

export const putInstrumentsQuestionController = async (req: FastifyRequest<{ Body: PutInstrumentsSchema }>, res: FastifyReply) => {
    const session = await req.jwtVerify() as TokenPayload

    const { user } = await getSessionUser({ id: session.id }).catch(() => {
      throw new NotFound("User not found.")
    })
  
    if (user.status !== Status.admin) {
      throw new Forbidden("User doesn't have access.");
    }

    const arrData = req.body;

    await updateInstrumentsQuestion({ data: arrData })

    return res.code(200).send({
        message: 'Instrument question updated.'
    })
}
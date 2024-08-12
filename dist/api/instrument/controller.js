import { getAllInstrument } from "../../service/prisma/instrument.js";
import { choiceYa, choiceIdeal, choiceCheck } from "../../utils/ChoiceOpt.js";
import { readAreaChoices } from "../../service/prisma/area.js";
export async function getAllInstrumentController(req, res) {
    const { from, to } = req.query;
    const fromNumber = from ? parseInt(from, 10) : undefined;
    const toNumber = to ? parseInt(to, 10) : undefined;
    const instruments = await getAllInstrument({ from: fromNumber, to: toNumber });
    const result = instruments.map(instrument => {
        const { id, number, topicId, question, sub, choice } = instrument;
        let { type } = instrument;
        let caseShape = {};
        switch (type) {
            case 'dropdown':
            case 'dropdownya':
                caseShape = {
                    choice: choiceYa
                };
                type = 'dropdown';
                break;
            case 'dropdownideal':
                caseShape = {
                    choice: choiceIdeal
                };
                type = 'dropdown';
                break;
            case 'checkbox':
                caseShape = {
                    choice: choiceCheck
                };
                break;
            case 'sub':
                caseShape = {
                    sub: sub.map(item => {
                        const { id, question, type } = item;
                        const isDropdown = type.includes('dropdown');
                        let choice = undefined;
                        if (type === 'dropdownya') {
                            choice = choiceYa;
                        }
                        else if (type === 'dropdownideal') {
                            choice = choiceIdeal;
                        }
                        else if (type === 'checkbox') {
                            choice = choiceCheck;
                        }
                        return {
                            id: item.id,
                            question: item.question,
                            type: isDropdown ? 'dropdown' : item.type,
                            choice
                        };
                    })
                };
                break;
            default:
                break;
        }
        return Object.assign({ id, number, topicId, question, type }, caseShape);
    });
    res.code(200).send({
        message: 'Success.',
        data: result
    });
}
export async function getAreaController(req, res) {
    const areaChoice = await readAreaChoices();
    return res.code(200).send({
        data: areaChoice
    });
}

import { Markup } from "telegraf"
import { TelegrafContext } from "telegraf/typings/context"
import FusionSolar from "../datasource/api/fusionsolar"
import { Plant } from "../models/plant"

export async function selectPlant(
    fusionsolar: FusionSolar,
    ctx: TelegrafContext,
    actionPrefix: string,
    selectionPrompt: string,
    onSinglePlant: (plantId: string, userId: string) => void
): Promise<void> {
    const userId = ctx.message?.from?.id.toString() ?? ctx.from?.id.toString()

    fusionsolar.getStations(userId)
        .then((plants: Array<Plant>) => {
            if (plants.length > 1) {
                const keyboard = Markup.inlineKeyboard(plants.map(it =>
                    Markup.callbackButton(it.stationName, `${actionPrefix} ${it.stationCode}`))).extra()
                ctx.reply(selectionPrompt, keyboard)
            } else {
                onSinglePlant(plants[0].stationCode, userId)
            }
        })
        .catch(() => ctx.reply("Couldn't retrieve your plants 🤷‍♂️"))
}

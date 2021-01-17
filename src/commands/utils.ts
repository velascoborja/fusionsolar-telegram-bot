import { TelegrafContext } from "telegraf/typings/context";
import DatabaseDataSource from "../datasource/db/DatabaseDataSource";
import { User } from "../models/user";

export function removeCmd(cmd?: string): string {
    if (cmd != undefined) return cmd?.replace(/(\/\w+)\s*/, '')
    else return ''
}

export function slice(input: Array<any>, size: number) {
    if (size < 1) throw new Error("Size cannot be lower than 1")

    const output = []

    for (let i = 0; i < input.length; i += size) {
        output.push(input.slice(i, i + size));
    }

    return output
}

export function getUsername(db: DatabaseDataSource, message: string, userId: string): Promise<string> {
    return new Promise(async function (resolve) {
        const commandUsername = removeCmd(message)
        const defaultUsername = await db.getUserThingiverseUsername(userId)
        const username = commandUsername != "" ? commandUsername : defaultUsername
        resolve(username)
    })
}

export function getUserId(ctx: TelegrafContext): string {
    const username = ctx.from.id || ""
    return username.toString()
}

export function getUser(ctx: TelegrafContext, thingiverseUsername?: string): User {
    const username = ctx.from.username || ""
    const lastName = ctx.from.last_name || ""
    const name = ctx.from.first_name || ""
    const languageCode = ctx.from.language_code || ""
    const userId = ctx.message.from.id.toString()

    return new User(userId, username, thingiverseUsername, languageCode, name, lastName)
}

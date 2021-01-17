export class User {
    id: string
    userName: string
    thingiverseUsername : string
    languageCode : string
    name: string
    lastName: string

    constructor(id: string, userName: string, thingiverseUsername: string, languageCode: string, name: string, lastName: string) {
        this.id = id
        this.userName = userName
        this.thingiverseUsername = thingiverseUsername
        this.languageCode = languageCode
        this.name = name
        this.lastName = lastName
    }
}
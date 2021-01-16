export class User {
    id: string
    userName: string
    thingiverseUsername : string

    constructor(id: string, userName: string, thingiverseUsername: string) {
        this.id = id
        this.userName = userName
        this.thingiverseUsername = thingiverseUsername
    }
}
import { Console } from 'console'
import { Resolver } from 'dns'
import { Collection, Db, MongoClient } from 'mongodb'
import { resolve } from 'path'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
import { Event, EventParam } from '../../analytics/analytics'
import { User } from '../../models/user'

class DatabaseDataSource {

    private usersCollection: Collection
    private eventsCollection: Collection

    init(url: string, dbName: string): Promise<DatabaseDataSource> {
        const database = this

        return new Promise(function (resolve, reject) {
            const options = { useUnifiedTopology: true }

            MongoClient.connect(url, options)
                .then(function (client) {
                    const db = client.db(dbName)

                    database.usersCollection = db.collection("users")
                    database.usersCollection.createIndex({ "id": 1 }, { unique: true })

                    database.eventsCollection = db.collection("events")

                    resolve(database)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    trackEvent(event: Event, userId?: string, params?: Map<EventParam, string>) {
        try {
            this.eventsCollection.insertOne({ event: event, userId: userId, params: params })
        } catch (error) {
            console.log(error)
        }
    }

    insertOrUpdateUser(user: User): Promise<boolean> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.updateOne({ id: user.id }, { $set: user }, { upsert: true })
                .then(function (result) {
                    resolve(true)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    createUser(user: User): Promise<boolean> {
        const dataBase = this

        return new Promise(async function (resolve, reject) {
            const previousUser = await dataBase.usersCollection.findOne({ id: user.id })

            if (previousUser == null) {
                dataBase.usersCollection.insertOne(user)
                    .then(function (result) {
                        resolve(true)
                    })
                    .catch(function (error) {
                        reject(error)
                    })
            }
        })
    }

    getUserById(userId: string): Promise<User> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.findOne({ id: userId })
                .then(function (result: User) {
                    if (result != null) {
                        resolve(new User(result.id, result.userName, result.thingiverseUsername, result.languageCode, result.name, result.name))
                    } else {
                        reject(Error("No user found"))
                    }
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    getUserThingiverseUsername(userId: string): Promise<string> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.findOne({ id: userId })
                .then(function (result: User) {
                    resolve(result?.thingiverseUsername || '')
                })
                .catch(function (error) {
                    resolve('')
                })
        })
    }
}

export default DatabaseDataSource
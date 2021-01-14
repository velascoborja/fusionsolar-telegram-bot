import { Console } from 'console'
import { Collection, Db, MongoClient } from 'mongodb'
import { resolve } from 'path'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript'
import { User } from '../../models/user'

class DatabaseDataSource {

    private usersCollection: Collection

    init(url: string, dbName: string): Promise<DatabaseDataSource> {
        const database = this

        return new Promise(function (resolve, reject) {
            MongoClient.connect(url)
                .then(function (client) {
                    const db = client.db(dbName)
                    database.usersCollection = db.collection("users")
                    database.usersCollection.createIndex({ "id": 1 }, { unique: true })

                    resolve(database)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
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

    getUserById(userId: string): Promise<User> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.findOne({ id: userId })
                .then(function (result: User) {
                    resolve(new User(result.id, result.userName, result.thingiverseUsername))
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }
}

export default DatabaseDataSource
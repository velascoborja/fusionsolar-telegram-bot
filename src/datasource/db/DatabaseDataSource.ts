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
                    resolve(database)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    insertUser(user: User): Promise<boolean> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.insertOne(user)
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
            dataBase.usersCollection.findOne({ userId: userId })
                .then(function (result) {
                    resolve(new User(result.userId, result.userName))
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }
}

export default DatabaseDataSource
import { Collection, Db, MongoClient } from 'mongodb'
import { Device } from '../../models/device'
import { User } from '../../models/user'
import { Plant } from '../../models/plant'

class DatabaseDataSource {

    private usersCollection: Collection
    private devicesCollection: Collection
    private plantsCollection: Collection

    init(url: string, dbName: string): Promise<DatabaseDataSource> {
        const database = this

        return new Promise(function (resolve, reject) {
            const options = { useUnifiedTopology: true }

            MongoClient.connect(url, options)
                .then(function (client) {
                    const db = client.db(dbName)

                    database.usersCollection = db.collection("users")
                    database.usersCollection.createIndex({ "id": 1 }, { unique: true })

                    database.devicesCollection = db.collection("devices")
                    database.devicesCollection.createIndex({ "id": 1 }, { unique: true })

                    database.plantsCollection = db.collection("plants")
                    database.plantsCollection.createIndex({ "stationsCode": 1 }, { unique: true })

                    resolve(database)
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    async insertOrUpdateUser(user: User): Promise<boolean> {
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

    async insertOrUpdatePlantDevices(devices: Array<Device>): Promise<boolean> {
        const dataBase = this

        return new Promise(function (resolve, reject) {

            devices.forEach(function (device) {
                dataBase.devicesCollection.updateOne({ id: device.id }, { $set: device }, { upsert: true })
            })

            resolve(true)
        })
    }

    async insertOrUpdateUserPlants(plants: Array<Plant>): Promise<boolean> {
        const dataBase = this

        return new Promise(function (resolve) {

            plants.forEach(function (plant) {
                dataBase.plantsCollection.updateOne({ userId: plant.userId }, { $set: plant }, { upsert: true })
            })

            resolve(true)
        })
    }

    async getPlantsForUserId(userId: string): Promise<Array<Plant>> {
        const dataBase = this

        return new Promise(function (resolve) {
            dataBase.plantsCollection.find({ userId: userId }).toArray()
                .then(function (plants: Array<Plant>) {
                    resolve(plants)
                })
                .catch(function (error) {
                    resolve([])
                })
        })
    }

    getDevicesForPlantId(plantId: string): Promise<Array<Device>> {
        const dataBase = this

        return new Promise(function (resolve) {
            dataBase.devicesCollection.find({ stationCode: plantId }).toArray()
                .then(function (devices: Array<Device>) {
                    resolve(devices)
                })
                .catch(function (error) {
                    resolve([])
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
                        resolve(new User(result.id, result.fusionSolarToken))
                    } else {
                        reject(Error("No user found"))
                    }
                })
                .catch(function (error) {
                    reject(error)
                })
        })
    }

    getUserFusionsonSolarToken(userId: string): Promise<string> {
        const dataBase = this

        return new Promise(function (resolve, reject) {
            dataBase.usersCollection.findOne({ id: userId })
                .then(function (result: User) {
                    resolve(result?.fusionSolarToken || '')
                })
                .catch(function (error) {
                    resolve('')
                })
        })
    }
}

export default DatabaseDataSource
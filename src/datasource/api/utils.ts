import { AxiosInstance } from "axios"
import { User } from "../../models/user"
import DatabaseDataSource from "../db/DatabaseDataSource"
import { FusionSolarResponse } from "./models/response"

export function get<T>(api: AxiosInstance, endpoint: string): Promise<T> {
    return new Promise((resolve, reject) => {
        api.get(endpoint)
            .then(async function (response) {
                resolve(response.data)
            })
            .catch(function (error) {
                reject(error)
            })
    })
}

export async function post<T>(api: AxiosInstance, endpoint: string, db: DatabaseDataSource, userId: string, body: any = ""): Promise<FusionSolarResponse<T>>{
    const userToken = await db.getUserFusionsonSolarToken(userId)

    return new Promise((resolve, reject) => {
        api.post(endpoint, body, {
            headers: {
                'XSRF-TOKEN': userToken
            }
        }).then(async function (response) {
            if (response.data.failCode == 305) {
                relogin(api).then(async function (response: Response) {
                    const newToken = response.headers["xsrf-token"]

                    if(newToken == '' || newToken == undefined){
                        reject("no token available")
                    }

                    await db.insertOrUpdateUser(new User(userId, newToken))

                    post(api, endpoint, db, userId, body)
                })
            } else if (response.status != 200) {
                reject("unsuccessful response")
            } else {
                resolve(response.data)
            }
        })
            .catch(function (error) {
                reject(error)
            })
    })
}

// TODO include dynamic user and password
async function relogin<T>(api: AxiosInstance): Promise<T> {
    return api.post("login", {
        "userName": "borjavelasco",
        "systemCode": "12345678aA"
    })
}

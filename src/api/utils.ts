import { AxiosInstance } from "axios"

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
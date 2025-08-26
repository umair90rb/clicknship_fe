import { api } from '@/api/index'


export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        me: build.query({
            query: () => 'me'
        })
    })
})
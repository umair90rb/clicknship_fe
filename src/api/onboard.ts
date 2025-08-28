import { api } from '@/api/index';
import type { OnboardRequestBody } from '@/types/onboard';


export const onboardApi = api.injectEndpoints({
    endpoints: (build) => ({
        onboard: build.mutation({
            query: (credentials: OnboardRequestBody) => ({
                url: 'onboard',
                body: credentials,
                method: 'POST'
            }),
        }),
    })
})

export const {useOnboardMutation} = onboardApi;
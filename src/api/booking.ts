import { api } from "@/api/index";

export const bookingApi = api.injectEndpoints({
  endpoints: (build) => ({
    bookingStatus: build.query({
      query: (cn: string) => ({
        url: `booking/status/${cn}`,
        method: "GET",
      }),
    }),
    createBooking: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "booking/create",
        method: "POST",
        body,
      }),
    }),
    cancelBooking: build.mutation<any, {}>({
      query: (body: { orderIds: number[] }) => ({
        url: "booking/cancel",
        method: "POST",
        body,
      }),
    }),
    downloadBookingReceipt: build.mutation<any, {}>({
      query: (body: { cns: string[] }) => ({
        url: "booking/download-receipt",
        method: "POST",
        body,
      }),
    }),
    shipperAdvice: build.query({
      query: (cn: string) => ({
        url: `booking/shipper-advice/${cn}`,
        method: "GET",
      }),
    }),
    createShipperAdvice: build.mutation<any, {}>({
      query: (body: any) => ({
        url: "booking/shipper-advice/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useBookingStatusQuery,
  useLazyBookingStatusQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useDownloadBookingReceiptMutation,
  useCreateShipperAdviceMutation,
  useShipperAdviceQuery,
  useLazyShipperAdviceQuery,
} = bookingApi;

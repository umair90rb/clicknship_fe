import { api } from "@/api/index";
import type {
  LocationListResponse,
  LocationResponse,
  SupplierListResponse,
  SupplierResponse,
  InventoryItemListResponse,
  InventoryItemResponse,
  InventoryMovementListResponse,
  PurchaseOrderListResponse,
  PurchaseOrderResponse,
  StockTransferListResponse,
  StockTransferResponse,
  StockLevelResponse,
  CreateLocationDto,
  UpdateLocationDto,
  CreateSupplierDto,
  UpdateSupplierDto,
  InventoryItemQueryParams,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  ReserveStockDto,
  DeductStockDto,
  ReleaseReservationDto,
  RestockDto,
  AdjustStockDto,
  MovementQueryDto,
  CreatePurchaseOrderDto,
  UpdatePurchaseOrderDto,
  ReceivePurchaseOrderDto,
  CreateTransferDto,
  InventoryItem,
  InventoryMovement,
} from "@/types/inventory";

export const inventoryApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ============ Locations ============
    listLocations: build.query<LocationListResponse, void>({
      query: () => "inventory/location",
      providesTags: ["locations"],
    }),
    getDefaultLocation: build.query<LocationResponse, void>({
      query: () => "inventory/location/default",
      providesTags: ["locations"],
    }),
    getLocation: build.query<LocationResponse, number>({
      query: (id) => `inventory/location/${id}`,
      providesTags: (_result, _error, id) => [{ type: "locations", id }],
    }),
    createLocation: build.mutation<LocationResponse, CreateLocationDto>({
      query: (body) => ({
        url: "inventory/location/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["locations"],
    }),
    updateLocation: build.mutation<
      LocationResponse,
      { id: number; body: UpdateLocationDto }
    >({
      query: ({ id, body }) => ({
        url: `inventory/location/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "locations",
        { type: "locations", id },
      ],
    }),
    setDefaultLocation: build.mutation<LocationResponse, number>({
      query: (id) => ({
        url: `inventory/location/${id}/set-default`,
        method: "PATCH",
      }),
      invalidatesTags: ["locations"],
    }),
    deleteLocation: build.mutation<void, number>({
      query: (id) => ({
        url: `inventory/location/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["locations"],
    }),

    // ============ Suppliers ============
    listSuppliers: build.query<SupplierListResponse, void>({
      query: () => "inventory/supplier",
      providesTags: ["suppliers"],
    }),
    getSupplier: build.query<SupplierResponse, number>({
      query: (id) => `inventory/supplier/${id}`,
      providesTags: (_result, _error, id) => [{ type: "suppliers", id }],
    }),
    createSupplier: build.mutation<SupplierResponse, CreateSupplierDto>({
      query: (body) => ({
        url: "inventory/supplier/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["suppliers"],
    }),
    updateSupplier: build.mutation<
      SupplierResponse,
      { id: number; body: UpdateSupplierDto }
    >({
      query: ({ id, body }) => ({
        url: `inventory/supplier/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "suppliers",
        { type: "suppliers", id },
      ],
    }),
    deleteSupplier: build.mutation<void, number>({
      query: (id) => ({
        url: `inventory/supplier/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["suppliers"],
    }),

    // ============ Inventory Items ============
    listInventoryItems: build.query<
      InventoryItemListResponse,
      InventoryItemQueryParams | void
    >({
      query: (params) => ({
        url: "inventory/items",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item: InventoryItem) => ({
                type: "inventory-items" as const,
                id: item.id,
              })),
              { type: "inventory-items", id: "LIST" },
            ]
          : [{ type: "inventory-items", id: "LIST" }],
    }),
    getLowStockItems: build.query<InventoryItemListResponse, void>({
      query: () => "inventory/items/low-stock",
      providesTags: [{ type: "inventory-items", id: "LOW_STOCK" }],
    }),
    getInventoryItem: build.query<InventoryItemResponse, number>({
      query: (id) => `inventory/items/${id}`,
      providesTags: (_result, _error, id) => [{ type: "inventory-items", id }],
    }),
    createInventoryItem: build.mutation<
      InventoryItemResponse,
      CreateInventoryItemDto
    >({
      query: (body) => ({
        url: "inventory/items/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "inventory-items", id: "LIST" }],
    }),
    updateInventoryItem: build.mutation<
      InventoryItemResponse,
      { id: number; body: UpdateInventoryItemDto }
    >({
      query: ({ id, body }) => ({
        url: `inventory/items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "inventory-items", id },
        { type: "inventory-items", id: "LIST" },
        { type: "inventory-items", id: "LOW_STOCK" },
      ],
    }),
    getStockLevel: build.query<StockLevelResponse, number>({
      query: (productId) => `inventory/stock/${productId}`,
      providesTags: (_result, _error, productId) => [
        { type: "inventory-items", id: `stock-${productId}` },
      ],
    }),

    // ============ Stock Operations ============
    reserveStock: build.mutation<InventoryItemResponse, ReserveStockDto>({
      query: (body) => ({
        url: "inventory/reserve",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-items", "inventory-movements"],
    }),
    releaseStock: build.mutation<InventoryItemResponse, ReleaseReservationDto>({
      query: (body) => ({
        url: "inventory/release",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-items", "inventory-movements"],
    }),
    deductStock: build.mutation<InventoryItemResponse, DeductStockDto>({
      query: (body) => ({
        url: "inventory/deduct",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-items", "inventory-movements"],
    }),
    restockItems: build.mutation<InventoryItemResponse, RestockDto>({
      query: (body) => ({
        url: "inventory/restock",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-items", "inventory-movements"],
    }),
    adjustStock: build.mutation<InventoryItemResponse, AdjustStockDto>({
      query: (body) => ({
        url: "inventory/adjust",
        method: "POST",
        body,
      }),
      invalidatesTags: ["inventory-items", "inventory-movements"],
    }),

    // ============ Stock Movements ============
    listMovements: build.query<
      InventoryMovementListResponse,
      MovementQueryDto | void
    >({
      query: (params) => ({
        url: "inventory/movements",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((m: InventoryMovement) => ({
                type: "inventory-movements" as const,
                id: m.id,
              })),
              { type: "inventory-movements", id: "LIST" },
            ]
          : [{ type: "inventory-movements", id: "LIST" }],
    }),
    getMovementsByOrder: build.query<InventoryMovementListResponse, number>({
      query: (orderId) => `inventory/movements/order/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "inventory-movements", id: `order-${orderId}` },
      ],
    }),
    getMovementsByItem: build.query<InventoryMovementListResponse, number>({
      query: (inventoryItemId) =>
        `inventory/movements/item/${inventoryItemId}`,
      providesTags: (_result, _error, itemId) => [
        { type: "inventory-movements", id: `item-${itemId}` },
      ],
    }),

    // ============ Purchase Orders ============
    listPurchaseOrders: build.query<PurchaseOrderListResponse, void>({
      query: () => "inventory/purchase-order",
      providesTags: [{ type: "purchase-orders", id: "LIST" }],
    }),
    getPurchaseOrder: build.query<PurchaseOrderResponse, number>({
      query: (id) => `inventory/purchase-order/${id}`,
      providesTags: (_result, _error, id) => [{ type: "purchase-orders", id }],
    }),
    createPurchaseOrder: build.mutation<
      PurchaseOrderResponse,
      CreatePurchaseOrderDto
    >({
      query: (body) => ({
        url: "inventory/purchase-order/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "purchase-orders", id: "LIST" }],
    }),
    updatePurchaseOrder: build.mutation<
      PurchaseOrderResponse,
      { id: number; body: UpdatePurchaseOrderDto }
    >({
      query: ({ id, body }) => ({
        url: `inventory/purchase-order/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "purchase-orders", id },
        { type: "purchase-orders", id: "LIST" },
      ],
    }),
    markPurchaseOrderOrdered: build.mutation<PurchaseOrderResponse, number>({
      query: (id) => ({
        url: `inventory/purchase-order/${id}/order`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "purchase-orders", id },
        { type: "purchase-orders", id: "LIST" },
      ],
    }),
    receivePurchaseOrder: build.mutation<
      PurchaseOrderResponse,
      { id: number; body: ReceivePurchaseOrderDto }
    >({
      query: ({ id, body }) => ({
        url: `inventory/purchase-order/${id}/receive`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "purchase-orders", id },
        { type: "purchase-orders", id: "LIST" },
        "inventory-items",
        "inventory-movements",
      ],
    }),
    cancelPurchaseOrder: build.mutation<PurchaseOrderResponse, number>({
      query: (id) => ({
        url: `inventory/purchase-order/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "purchase-orders", id },
        { type: "purchase-orders", id: "LIST" },
      ],
    }),
    deletePurchaseOrder: build.mutation<void, number>({
      query: (id) => ({
        url: `inventory/purchase-order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "purchase-orders", id: "LIST" }],
    }),

    // ============ Stock Transfers ============
    listTransfers: build.query<StockTransferListResponse, void>({
      query: () => "inventory/transfer",
      providesTags: [{ type: "stock-transfers", id: "LIST" }],
    }),
    getTransfer: build.query<StockTransferResponse, number>({
      query: (id) => `inventory/transfer/${id}`,
      providesTags: (_result, _error, id) => [{ type: "stock-transfers", id }],
    }),
    createTransfer: build.mutation<StockTransferResponse, CreateTransferDto>({
      query: (body) => ({
        url: "inventory/transfer/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "stock-transfers", id: "LIST" }],
    }),
    markTransferInTransit: build.mutation<StockTransferResponse, number>({
      query: (id) => ({
        url: `inventory/transfer/${id}/in-transit`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "stock-transfers", id },
        { type: "stock-transfers", id: "LIST" },
        "inventory-items",
        "inventory-movements",
      ],
    }),
    completeTransfer: build.mutation<StockTransferResponse, number>({
      query: (id) => ({
        url: `inventory/transfer/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "stock-transfers", id },
        { type: "stock-transfers", id: "LIST" },
        "inventory-items",
        "inventory-movements",
      ],
    }),
    cancelTransfer: build.mutation<StockTransferResponse, number>({
      query: (id) => ({
        url: `inventory/transfer/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "stock-transfers", id },
        { type: "stock-transfers", id: "LIST" },
        "inventory-items",
        "inventory-movements",
      ],
    }),
    deleteTransfer: build.mutation<void, number>({
      query: (id) => ({
        url: `inventory/transfer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "stock-transfers", id: "LIST" }],
    }),
  }),
});

export const {
  // Locations
  useListLocationsQuery,
  useLazyListLocationsQuery,
  useGetDefaultLocationQuery,
  useGetLocationQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useSetDefaultLocationMutation,
  useDeleteLocationMutation,
  // Suppliers
  useListSuppliersQuery,
  useLazyListSuppliersQuery,
  useGetSupplierQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  // Inventory Items
  useListInventoryItemsQuery,
  useLazyListInventoryItemsQuery,
  useGetLowStockItemsQuery,
  useGetInventoryItemQuery,
  useCreateInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useGetStockLevelQuery,
  // Stock Operations
  useReserveStockMutation,
  useReleaseStockMutation,
  useDeductStockMutation,
  useRestockItemsMutation,
  useAdjustStockMutation,
  // Movements
  useListMovementsQuery,
  useLazyListMovementsQuery,
  useGetMovementsByOrderQuery,
  useGetMovementsByItemQuery,
  // Purchase Orders
  useListPurchaseOrdersQuery,
  useLazyListPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useUpdatePurchaseOrderMutation,
  useMarkPurchaseOrderOrderedMutation,
  useReceivePurchaseOrderMutation,
  useCancelPurchaseOrderMutation,
  useDeletePurchaseOrderMutation,
  // Transfers
  useListTransfersQuery,
  useLazyListTransfersQuery,
  useGetTransferQuery,
  useCreateTransferMutation,
  useMarkTransferInTransitMutation,
  useCompleteTransferMutation,
  useCancelTransferMutation,
  useDeleteTransferMutation,
} = inventoryApi;

import api from "./api";

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
}

interface CreatePaymentData {
  OrderId?: number;
  CartItemIds?: number[];
  PaymentMethod?: string;
  ShippingInfo: ShippingInfo;
}

export const getAll = async () => {
    const res = await api.get("/api/Payment/All");
    return res.data;
};

export const getById = async (id: number) => {
    const res = await api.get(`/api/Payment/${id}`);
    return res.data;
};

export const getByOrderId = async (orderId: number) => {
    const res = await api.get(`/api/Payment/order/${orderId}`);
    return res.data;
};

export const createPayment = async (data: CreatePaymentData) => {
    const res = await api.post("/api/Payment/create", data);
    return res.data;
};

export const updateStatus = async (id: number, newStatus: string) => {
    const res = await api.put(`/api/Payment/update-status/${id}`, `"${newStatus}"`,
    {
        headers: {"Content-Type": "application/json"},
    });
    return res.data;
}
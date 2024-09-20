import { toast } from "react-toastify";
import { redirect, useLoaderData } from "react-router-dom";
import { customFetch } from "../utils";
import {
  SectionTitle,
  ComplexPaginationContainer,
  OrdersList,
} from "../components";

const ordersQuery = (params, user) => {
  return {
    queryKey: [
      "orders",
      user.username,
      params.page ? parseInt(params.page) : 1,
    ],
    queryFn: () =>
      customFetch.get("/orders", {
        params,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }),
  };
};

export const loader =
  (store, queryClient) =>
  async ({ request }) => {
    const user = store.getState().userState.user;

    if (!user) {
      toast.warn("You must be logged in to view orders");
      return redirect("/login");
    }

    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    try {
      const response = await queryClient.ensureQueryData(
        ordersQuery(params, user)
      );
      const orders = response.data.data;
      const meta = response.data.meta;

      return {
        orders,
        meta,
      };
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "there was an error accessing your orders";
      toast.error(errorMessage);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return redirect("/login");
      }
      return null;
    }
  };

const Orders = () => {
  const { meta, orders } = useLoaderData();
  const totalOrders = meta.pagination.total;

  if (totalOrders < 1) {
    return (
      <>
        <SectionTitle text="Please make an order" />
      </>
    );
  }
  return (
    <>
      <SectionTitle text="Your Orders" />
      <OrdersList />
      <ComplexPaginationContainer />
    </>
  );
};
export default Orders;

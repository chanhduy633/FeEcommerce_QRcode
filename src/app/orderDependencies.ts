import { OrderRemote } from "../data/remotes/orderRemote";
import { OrderRepository } from "../data/repositories/orderRepository";
import { CreateOrderUseCase } from "../domain/usecases/order/createOrderUseCase";

// Tạo instance remote
const orderRemote = new OrderRemote();

// Tạo repository, inject remote
export const orderRepository = new OrderRepository(orderRemote);

// Tạo usecase, inject repository
export const createOrderUseCase = new CreateOrderUseCase(orderRepository);

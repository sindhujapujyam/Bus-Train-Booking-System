
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const getRoutes = () => API.get("/routes");
export const addRoute = (data) => API.post("/routes", data);
export const updateRoute = (id, data) =>
  API.put(`/routes/${id}`, data);
export const deleteRoute = (id) =>
  API.delete(`/routes/${id}`);

export const getTransports = () => API.get("/transports");
export const addTransport = (data) =>
  API.post("/transports", data);
export const updateTransport = (id, data) =>
  API.put(`/transports/${id}`, data);
export const deleteTransport = (id) =>
  API.delete(`/transports/${id}`);

export const getPassengers = () => API.get("/passengers");
export const addPassenger = (data) =>
  API.post("/passengers", data);

export const getBookings = () => API.get("/bookings");
export const addBooking = (data) =>
  API.post("/bookings", data);
export const updateBooking = (id, data) =>
  API.patch(`/bookings/${id}`, data);
export const deleteBooking = (id) =>
  API.delete(`/bookings/${id}`);

export default API;

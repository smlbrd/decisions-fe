import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9090",
});

const getUsers = async () => {
  try {
    const response = await api.get("/users");

    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};

const getListbyListId = async (listId: string) => {
  try {
    const response = await api.get(`/lists/${listId}`);

    return response.data;
  } catch (error) {
    console.error("Error: ", error);
  }
};

const getListsByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/saved_lists`);

    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getGroupsByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/groups`);

    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const createList = async (listData: object) => {
  try {
    const response = await api.post("/lists", listData);

    return response.data;
  } catch (error) {
    console.log("Error: ", error);
  }
};

export { getListbyListId, getListsByUserId, createList, getGroupsByUserId };

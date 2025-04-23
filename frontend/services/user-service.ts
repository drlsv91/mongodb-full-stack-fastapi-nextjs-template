import axiosInstance from "@/lib/axios";
import { createSession } from "@/lib/session";
import { LoginFormValues, User } from "@/lib/validations/auth";

class UserService {
  async login(credentials: LoginFormValues) {
    console.log(credentials);
    console.log("credentials =>", credentials);

    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", credentials.email);
    formData.append("password", credentials.password);

    const response = await axiosInstance.post<{ id: string; full_name: string; access_token: string; email: string }>(
      "/login/access-token",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const data = response.data;
    await createSession({
      user: {
        id: data.id,
        name: data.full_name,
        email: data.email,
      },
      accessToken: data.access_token,
    });
    return data;
  }

  async getCurrentUser() {
    const response = await axiosInstance.get("/users/me");
    return response.data;
  }

  async getUsers() {
    const response = await axiosInstance.get("/users");
    return response.data;
  }

  async createUser(userData: Omit<User, "id">) {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  }

  async updateUser(id: string, userData: Partial<Omit<User, "id">>) {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: string) {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  }
}

const userService = new UserService();

export default userService;

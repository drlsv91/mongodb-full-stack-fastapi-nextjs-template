import { BACKEND_URL } from "../constants";

export const authApiLogin = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("grant_type", "password");
  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(`${BACKEND_URL}/login/access-token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    return { errors: error.detail };
  }

  return await response.json();
};

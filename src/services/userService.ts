import { api } from "@/src/lib/api"
import type { User } from "@/src/types"
import type { UpdateUserPayload } from "@/src/types/test"

export const usersService = {
  async getCurrent(): Promise<User> {
    const { data } = await api.get<User>("/Auth/me")
    return data
  },

  async update(payload: UpdateUserPayload): Promise<User> {
    const { data } = await api.put<User>("/Users/me", payload)
    return data
  },
}

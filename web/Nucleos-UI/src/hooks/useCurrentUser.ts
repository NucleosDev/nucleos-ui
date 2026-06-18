import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/users.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: usersService.getMe,
    staleTime: 1000 * 60 * 5,
  });
}

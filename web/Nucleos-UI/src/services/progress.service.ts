// // src/services/progress.service.ts
// import api from "./api";
// import { API_ROUTES } from "@/constants/routes"; // ← CORRIGIDO
// import type { UserLevel } from "@/types/user";
// import type { XpLog, EnergyLog } from "@/types/logs";

// export const progressService = {
//   async addXp(
//     amount: number,
//     source: string,
//     nucleoId?: string,
//   ): Promise<XpLog> {
//     const response = await api.post<XpLog>(API_ROUTES.PROGRESS.XP, {
//       amount,
//       source,
//       nucleoId,
//     });
//     return response.data;
//   },

//   async addEnergy(amount: number, nucleoId?: string): Promise<EnergyLog> {
//     const response = await api.post<EnergyLog>(API_ROUTES.PROGRESS.ENERGY, {
//       amount,
//       nucleoId,
//     });
//     return response.data;
//   },

//   async getUserLevel(userId?: string): Promise<UserLevel> {
//     const url = userId
//       ? API_ROUTES.USERS.LEVEL_BY_ID(userId)
//       : API_ROUTES.USERS.LEVEL;
//     const response = await api.get<UserLevel>(url);
//     return response.data;
//   },
// };

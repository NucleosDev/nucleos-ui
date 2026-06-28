export interface GamificationNotification {
  id: string;
  type: "XP" | "LEVEL_UP" | "ACHIEVEMENT" | "STREAK" | "DAILY_REWARD";
  title: string;
  message: string;
  xp?: number;
  icon?: string;
  read: boolean;
  createdAt: Date;
}

export interface NotificationState {
  notifications: GamificationNotification[];
  unreadCount: number;
  hasNew: boolean;
}

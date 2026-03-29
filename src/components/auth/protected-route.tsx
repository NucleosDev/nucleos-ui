// "use client";

// import { ReactNode, useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/auth";
// import { getLoginUrlWithCallback, isPublicRoute } from "@/constants/routes";

// export function ProtectedRoute({ children, fallback }: any) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (isLoading) return;

//     const isPublic = isPublicRoute(pathname);

//     if (!isAuthenticated && !isPublic) {
//       router.replace(getLoginUrlWithCallback(pathname)); // 🔥 replace evita loop
//     }
//   }, [isAuthenticated, isLoading, pathname, router]);

//   if (isLoading) {
//     return (
//       fallback ?? (
//         <div className="min-h-screen flex items-center justify-center">
//           <div className="animate-spin h-10 w-10 border-b-2 border-blue-600 rounded-full" />
//         </div>
//       )
//     );
//   }

//   if (!isAuthenticated) return null;

//   return <>{children}</>;
// }

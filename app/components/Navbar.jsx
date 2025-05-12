// "use client";
// import React, { useState, useEffect } from "react";
// import { HoveredLink, Menu, MenuItem, ProductItem } from "../components/ui/navbar-menu";
// import { cn } from "@/lib/utils/utils";
// import Link from "next/link";
// import { MapPin, User } from "lucide-react";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/app/providers/AuthProvider";

// export function NavbarDemo() {
//   return (
//     <div className="relative w-full flex items-center justify-center">
//       <Navbar className="top-2 dark " />
//     </div>
//   );
// }

// function Navbar({
//   className
// }) {
//   const [active, setActive] = useState(null);
//   const pathname = usePathname();
//   const { user, isAuthenticated, logout } = useAuth();
  
//   // Check if we're on login or signup page for conditional styling
//   const isAuthPage = pathname === "/login" || pathname === "/signup";
//   return (
//     <div
//       className={cn("fixed top-0 inset-x-0 w-full mx-auto z-50", 
//         isAuthPage ? "bg-black/30 backdrop-blur-lg" : "", 
//         className
//       )}>
//       <Menu setActive={setActive}>
//         <MenuItem setActive={setActive} active={active} item="Home">
//           <div className="flex flex-col space-y-4 text-sm">
//             <HoveredLink href="/">Homepage</HoveredLink>
//             <HoveredLink href="/#featured-tours">Featured Tours</HoveredLink>
//             <HoveredLink href="/#testimonials">Testimonials</HoveredLink>
//           </div>
//         </MenuItem>
//         <MenuItem setActive={setActive} active={active} item="Tours">
//           <div className="text-sm grid grid-cols-2 gap-10 p-4">
//             <ProductItem
//               title="Popular Tours"
//               href="/tours"
//               src="/img/tour-1.jpg"
//               description="Our most popular tours across the globe." />
//             <ProductItem
//               title="Adventure Tours"
//               href="/tours?category=adventure"
//               src="/img/tour-2.jpg"
//               description="Adrenaline-filled experiences for thrill seekers." />
//             <ProductItem
//               title="Relaxation Tours"
//               href="/tours?category=relaxation"
//               src="/img/tour-3.jpg"
//               description="Peaceful getaways to restore your spirit." />
//             <ProductItem
//               title="Cultural Tours"
//               href="/tours?category=cultural"
//               src="/img/tour-4.jpg"
//               description="Immerse yourself in local cultures and traditions." />
//           </div>
//         </MenuItem>
//         <MenuItem setActive={setActive} active={active} item="Destinations">
//           <div className="flex flex-col space-y-4 text-sm">
//             <HoveredLink href="/destinations">All Destinations</HoveredLink>
//             <HoveredLink href="/destinations?region=Europe">Europe</HoveredLink>
//             <HoveredLink href="/destinations?region=Asia">Asia</HoveredLink>
//             <HoveredLink href="/destinations?region=Africa">Africa</HoveredLink>
//             <HoveredLink href="/destinations?region=America">Americas</HoveredLink>
//           </div>
//         </MenuItem>
//         <Link href="/" className="flex items-center">
//           <span className={`font-bold text-xl ${isAuthPage ? "text-white" : "text-emerald-600"}`}>Natours</span>
//         </Link>
//         <div className="flex items-center gap-4">
//           {isAuthenticated ? (
//             <div className="flex items-center gap-2">
//               <Link 
//                 href="/account" 
//                 className={`flex items-center px-3 py-2 rounded-full ${isAuthPage ? "text-white hover:bg-white/10" : "text-emerald-600 hover:bg-emerald-50"}`}
//               >
//                 <User size={18} className="mr-2" />
//                 <span className="font-medium">My Account</span>
//               </Link>
//             </div>
//           ) : (
//             <div className="flex items-center gap-2">
//               <Link 
//                 href="/login" 
//                 className={`px-4 py-2 rounded-lg ${isAuthPage ? "text-white hover:bg-white/10" : "text-emerald-600 hover:bg-emerald-50"}`}
//               >
//                 Login
//               </Link>
//               <Link 
//                 href="/signup" 
//                 className={`px-4 py-2 rounded-lg ${isAuthPage ? "bg-white text-emerald-600" : "bg-emerald-600 text-white"} hover:opacity-90`}
//               >
//                 Sign Up
//               </Link>
//             </div>
//           )}
//         </div>
//       </Menu>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { Menu, X, ChevronDown, User, Globe, Search } from "lucide-react";

// export function Navbar() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setScrolled(true);
//       } else {
//         setScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const navItems = [
//     { name: "Home", href: "/" },
//     { name: "Tours", href: "/tours" },
//     { 
//       name: "Categories", 
//       href: "#", 
//       dropdownItems: [
//         { name: "Adventure", href: "/tours?category=adventure" },
//         { name: "Beach", href: "/tours?category=beach" },
//         { name: "Cultural", href: "/tours?category=cultural" },
//         { name: "Wildlife", href: "/tours?category=wildlife" },
//         { name: "Mountain", href: "/tours?category=mountain" },
//       ]
//     },
//     { name: "Destinations", href: "#" },
//     { name: "About", href: "#" },
//     { name: "Contact", href: "#" },
//   ];

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         scrolled
//           ? "bg-white shadow-md py-3"
//           : "bg-transparent py-6"
//       }`}
//     >
//       <div className="container-custom flex justify-between items-center">
//         {/* Logo */}
//         <Link href="/" className="flex items-center">
//           <div className="relative h-12 w-36">
//             <Image
//               src={scrolled ? "/logo-dark.png" : "/logo-white.png"}
//               alt="Natours Logo"
//               fill
//               className="object-contain"
//               priority
//             />
//           </div>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden lg:flex items-center space-x-1">
//           {navItems.map((item) => (
//             <div key={item.name} className="relative group">
//               <Link
//                 href={item.href}
//                 className={`px-4 py-2 rounded-md font-medium text-sm flex items-center ${
//                   scrolled ? "text-gray-700 hover:text-emerald-600" : "text-white hover:text-emerald-300"
//                 } transition-colors`}
//               >
//                 {item.name}
//                 {item.dropdownItems && (
//                   <ChevronDown size={16} className="ml-1 transition-transform group-hover:rotate-180" />
//                 )}
//               </Link>

//               {item.dropdownItems && (
//                 <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                   <div className="py-1" role="menu" aria-orientation="vertical">
//                     {item.dropdownItems.map((dropdownItem) => (
//                       <Link
//                         key={dropdownItem.name}
//                         href={dropdownItem.href}
//                         className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         {dropdownItem.name}
//                       </Link>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Right Side Actions */}
//         <div className="hidden lg:flex items-center space-x-3">
//           <button className={`p-2 rounded-full ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/20"}`}>
//             <Search size={20} />
//           </button>
//           <button className={`p-2 rounded-full ${scrolled ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/20"}`}>
//             <Globe size={20} />
//           </button>
//           <Link
//             href="/login"
//             className={`flex items-center gap-2 px-5 py-2 rounded-full ${
//               scrolled
//                 ? "bg-emerald-500 text-white hover:bg-emerald-600"
//                 : "bg-white text-emerald-600 hover:bg-emerald-50"
//             } transition-colors font-medium text-sm`}
//           >
//             <User size={18} />
//             Login
//           </Link>
//         </div>

//         {/* Mobile Menu Button */}
//         <div className="lg:hidden">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className={`p-2 rounded-md ${
//               scrolled ? "text-gray-600" : "text-white"
//             }`}
//           >
//             {isOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isOpen && (
//         <div className="lg:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-20">
//           <div className="container-custom py-4">
//             <div className="flex flex-col space-y-3">
//               {navItems.map((item) => (
//                 <div key={item.name}>
//                   <Link
//                     href={item.href}
//                     className="block py-2 px-4 text-gray-800 font-medium hover:bg-gray-50 rounded-md"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     {item.name}
//                   </Link>
//                   {item.dropdownItems && (
//                     <div className="pl-8 mt-1 space-y-1">
//                       {item.dropdownItems.map((dropdownItem) => (
//                         <Link
//                           key={dropdownItem.name}
//                           href={dropdownItem.href}
//                           className="block py-2 px-4 text-gray-600 text-sm hover:bg-gray-50 rounded-md"
//                           onClick={() => setIsOpen(false)}
//                         >
//                           {dropdownItem.name}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ))}
//               <Link
//                 href="/login"
//                 className="mt-2 w-full bg-emerald-500 text-white hover:bg-emerald-600 py-3 px-4 rounded-md text-center font-medium"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Login / Sign Up
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

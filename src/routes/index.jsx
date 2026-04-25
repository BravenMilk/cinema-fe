import { createBrowserRouter, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import GuestLayout from "../layouts/GuestLayout";

import City from "../pages/Global/Cities/City";
import Login from "../pages/Login";
import Register from "../pages/Register";

import CityManager from "../pages/Admin/Cities/CityManager";
import CinemaManager from "../pages/Admin/Cinemas/CinemaManager";
import HallManager from "../pages/Admin/Halls/HallManager";
import RoleManager from "../pages/Admin/Roles/RoleManager";
import MovieManager from "../pages/Admin/Movies/MovieManager";
import SeatTypeManager from "../pages/Admin/SeatTypes/SeatTypeManager";
import SeatManager from "../pages/Admin/Seats/SeatManager";
import ShowtimeManager from "../pages/Admin/Showtimes/ShowtimeManager";
import BookingManager from "../pages/Admin/Bookings/BookingManager";
import MovieList from "../pages/Global/Movies/MovieList";
import CinemaList from "../pages/Global/Cinemas/CinemaList";
import SeatTypeList from "../pages/Global/SeatTypes/SeatTypeList";

// New Pages
import Dashboard from "../pages/Dashboard";
import Scanner from "../pages/Staff/Scanner/Scanner";
import TicketList from "../pages/Staff/Tickets/TicketList";
import MyBookings from "../pages/Customer/Bookings/MyBookings";
import BookingFlow from "../pages/Customer/BookingFlow/BookingFlow";
import CustomerMovieList from "../pages/Customer/Movies/CustomerMovieList";
import MovieDetail from "../pages/Customer/Movies/MovieDetail";
import CustomerCinemaList from "../pages/Customer/Cinemas/CustomerCinemaList";
import CustomerCityList from "../pages/Customer/Cities/CustomerCityList";
import About from "../pages/Global/About";
import Settings from "../pages/Customer/Settings";
import CheckoutResumer from "../pages/Customer/Bookings/CheckoutResumer";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MovieList />, // Landing Page Publik
    },
    {
        path: "/",
        element: <DashboardLayout />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/admin/cities", element: <CityManager /> },
            { path: "/admin/cinemas", element: <CinemaManager /> },
            { path: "/admin/halls", element: <HallManager /> },
            { path: "/admin/roles", element: <RoleManager /> },
            { path: "/admin/movies", element: <MovieManager /> },
            { path: "/admin/seat-types", element: <SeatTypeManager /> },
            { path: "/admin/seats", element: <SeatManager /> },
            { path: "/admin/showtimes", element: <ShowtimeManager /> },
            { path: "/admin/bookings", element: <BookingManager /> },

            // Staff Routes
            { path: "/staff/scanner", element: <Scanner /> },
            { path: "/staff/tickets", element: <TicketList /> },

            // Customer Routes
            { path: "/customer/movies", element: <CustomerMovieList /> },
            { path: "/customer/movies/:movieId", element: <MovieDetail /> },
            { path: "/customer/cinemas", element: <CustomerCinemaList /> },
            { path: "/customer/cities", element: <CustomerCityList /> },
            { path: "/customer/bookings", element: <MyBookings /> },
            { path: "/customer/booking/:movieId", element: <BookingFlow /> },
            { path: "/customer/checkout/:bookingCode", element: <CheckoutResumer /> },
            { path: "/customer/settings", element: <Settings /> },
            { path: "/about", element: <About /> },
        ],
    },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
    {
        path: "/cities",
        element: <City />, // Bisa diakses tanpa login maupun saat login
    },
    {
        path: "/cinemas",
        element: <CinemaList />,
    },
    {
        path: "/tickets",
        element: <SeatTypeList />,
    },
    {
        path: "*",
        element: <div className="min-h-screen flex items-center justify-center bg-[#0f172a] italic text-slate-500 font-bold uppercase tracking-widest leading-none">404 | Page Not Found</div>,
    }
]);

export default router;
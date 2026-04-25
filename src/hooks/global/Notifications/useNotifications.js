import { useState, useEffect, useCallback } from "react";
import { getAdminBookings } from "../../../api/admin/BookingApi";
import { getMyBookings } from "../../../api/customer/BookingApi";
import { useAuth } from "../../../context/AuthContext";

export const useNotifications = () => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);

    const LAST_VIEWED_KEY = `cinepass_last_viewed_notif_${user?.id}`;

    const fetchNotifications = useCallback(async () => {
        if (!token || !user) return;

        setLoading(true);
        try {
            let response;
            const role = user.role?.name?.toLowerCase();
            const params = { status: 'paid', per_page: 5 };

            if (role === 'admin' || role === 'staff' || role === 'staf') {
                response = await getAdminBookings(params);
            } else {
                response = await getMyBookings(params);
            }

            const data = response.data?.data || [];
            setNotifications(data);

            // Check unread status
            const lastViewed = localStorage.getItem(LAST_VIEWED_KEY) || 0;
            const latestNotifTime = data.length > 0 ? new Date(data[0].created_at).getTime() : 0;

            if (latestNotifTime > lastViewed) {
                setHasUnread(true);
            } else {
                setHasUnread(false);
            }
        } catch (err) {
            console.error("useNotifications error:", err);
        } finally {
            setLoading(false);
        }
    }, [token, user, LAST_VIEWED_KEY]);

    useEffect(() => {
        fetchNotifications();
        // Polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = () => {
        const now = Date.now();
        localStorage.setItem(LAST_VIEWED_KEY, now.toString());
        setHasUnread(false);
    };

    return {
        notifications,
        loading,
        hasUnread,
        markAsRead,
        refresh: fetchNotifications
    };
};

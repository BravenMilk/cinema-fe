import { useState, useEffect, useCallback } from "react";
import {
    getMovieReviews,
    createReview,
    updateReview,
    deleteMyReview,
} from "../../../api/global/Reviews/ReviewApi";
import { useAuth } from "../../../context/AuthContext";

export const useMovieReviews = (movieId) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [myReview, setMyReview] = useState(null);
    const [canReview, setCanReview] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const fetchReviews = useCallback(async () => {
        if (!movieId) return;
        setLoading(true);
        setError(null);
        try {
            const res = await getMovieReviews(movieId);
            const payload = res?.data ?? res;

            const reviewList = Array.isArray(payload?.reviews?.data)
                ? payload.reviews.data
                : Array.isArray(payload?.reviews)
                    ? payload.reviews
                    : Array.isArray(payload?.data)
                        ? payload.data
                        : [];

            setReviews(reviewList);
            setAverageRating(payload?.average_rating ?? 0);
            const total = payload?.reviews?.total ?? reviewList.length;
            setTotalReviews(total);

            // Deteksi my_review dari list berdasarkan user yang login
            const myRev = payload?.my_review
                ?? reviewList.find(r => r.user_id === user?.id || r.user?.id === user?.id)
                ?? null;
            setMyReview(myRev);

            // can_review dari backend — true jika user punya booking paid untuk film ini
            const canRev = payload?.can_review ?? false;
            setCanReview(canRev);
        } catch (err) {
            console.error('[Reviews fetch error]', err.response?.data || err.message);
            setError("Gagal memuat ulasan.");
        } finally {
            setLoading(false);
        }
    }, [movieId, user?.id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const submitReview = async (rating, comment) => {
        setSubmitting(true);
        setError(null);
        try {
            await createReview(movieId, { rating, comment });
            await fetchReviews();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal mengirim ulasan.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setSubmitting(false);
        }
    };

    const editReview = async (rating, comment) => {
        setSubmitting(true);
        setError(null);
        try {
            await updateReview(movieId, { rating, comment });
            await fetchReviews();
            return { success: true };
        } catch (err) {
            const msg = err.response?.data?.message || "Gagal mengubah ulasan.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setSubmitting(false);
        }
    };

    const removeReview = async () => {
        setSubmitting(true);
        try {
            await deleteMyReview(movieId);
            await fetchReviews();
            return { success: true };
        } catch (err) {
            return { success: false };
        } finally {
            setSubmitting(false);
        }
    };

    return {
        reviews,
        averageRating,
        totalReviews,
        myReview,
        canReview,
        loading,
        submitting,
        error,
        submitReview,
        editReview,
        removeReview,
        refresh: fetchReviews,
    };
};

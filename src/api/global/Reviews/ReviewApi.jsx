import axiosClient from "../../axiosClient";

// GET /api/movies/{movieId}/reviews — publik
export const getMovieReviews = async (movieId) => {
    const response = await axiosClient.get(`/movies/${movieId}/reviews`);
    return response.data;
};

// POST /api/movies/{movieId}/reviews — customer (butuh token)
export const createReview = async (movieId, payload) => {
    const response = await axiosClient.post(`/movies/${movieId}/reviews`, payload);
    return response.data;
};

// PUT /api/movies/{movieId}/reviews — customer (edit ulasan sendiri)
export const updateReview = async (movieId, payload) => {
    const response = await axiosClient.put(`/movies/${movieId}/reviews`, payload);
    return response.data;
};

// DELETE /api/movies/{movieId}/reviews — customer (hapus ulasan sendiri)
export const deleteMyReview = async (movieId) => {
    const response = await axiosClient.delete(`/movies/${movieId}/reviews`);
    return response.data;
};

// DELETE /api/reviews/{reviewId} — admin
export const deleteReviewById = async (reviewId) => {
    const response = await axiosClient.delete(`/reviews/${reviewId}`);
    return response.data;
};

import api from "./api";
import type { AxiosResponse } from "axios";
import type { Review, ReviewResponse, MyReview } from "../types/review.types";
import type { AdminReview } from "../types/admin.types";

const BASE_BOOKS = "/books";
const BASE_REVIEWS = "/reviews";

export const addReview = (
  bookId: number,
  review: Review,
): Promise<AxiosResponse<void>> =>
  api.post<void>(`${BASE_BOOKS}/${bookId}/reviews`, review);

export const getAllReviewsByBookId = (
  bookId: number,
): Promise<AxiosResponse<ReviewResponse[]>> =>
  api.get<ReviewResponse[]>(`${BASE_BOOKS}/${bookId}/reviews`);

export const getMyReviews = (): Promise<AxiosResponse<MyReview[]>> =>
  api.get<MyReview[]>(`${BASE_REVIEWS}/me`);

export const getAllReviews = (): Promise<AxiosResponse<AdminReview[]>> =>
  api.get<AdminReview[]>(BASE_REVIEWS);

export const getMyReviewForBook = (
  bookId: number,
): Promise<AxiosResponse<MyReview | null>> =>
  api.get<MyReview | null>(`${BASE_BOOKS}/${bookId}/reviews/me`);

export const updateReview = (
  reviewId: number,
  review: Review,
): Promise<AxiosResponse<void>> =>
  api.put<void>(`${BASE_REVIEWS}/${reviewId}`, review);

export const deleteReview = (reviewId: number): Promise<AxiosResponse<void>> =>
  api.delete<void>(`${BASE_REVIEWS}/${reviewId}`);

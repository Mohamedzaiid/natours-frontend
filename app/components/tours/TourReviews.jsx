"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ThumbsUp, Flag, ChevronLeft, ChevronRight } from "lucide-react";

export const TourReviews = ({ tourId, reviews = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 4;

  // Placeholder reviews if none provided
  const tourReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            id: 1,
            review:
              "This tour exceeded all my expectations! The guides were knowledgeable and friendly, the accommodations were comfortable, and the scenery was breathtaking. I would highly recommend this adventure to anyone looking for an unforgettable experience.",
            rating: 5,
            user: {
              name: "Sarah Johnson",
              photo: "/api/placeholder/100/100?text=User+1",
            },
            createdAt: "2025-03-15T12:00:00.000Z",
            helpful: 12,
          },
          {
            id: 2,
            review:
              "Great tour overall. The guide was excellent and very informative. Only giving 4 stars because some of the accommodations were not as nice as advertised, but the experiences made up for it.",
            rating: 4,
            user: {
              name: "Michael Chen",
              photo: "/api/placeholder/100/100?text=User+2",
            },
            createdAt: "2025-03-10T12:00:00.000Z",
            helpful: 5,
          },
          {
            id: 3,
            review:
              "The locations were beautiful but the tour felt a bit rushed at times. Would have appreciated more free time to explore on our own. The guide was very knowledgeable though.",
            rating: 3,
            user: {
              name: "Emma Wilson",
              photo: "/api/placeholder/100/100?text=User+3",
            },
            createdAt: "2025-03-05T12:00:00.000Z",
            helpful: 3,
          },
          {
            id: 4,
            review:
              "One of the best travel experiences I've ever had! Everything was perfectly organized, and our guide went above and beyond to make sure everyone was having a great time. Will definitely book another tour soon!",
            rating: 5,
            user: {
              name: "David Rodriguez",
              photo: "/api/placeholder/100/100?text=User+4",
            },
            createdAt: "2025-02-28T12:00:00.000Z",
            helpful: 8,
          },
          {
            id: 5,
            review:
              "The tour was good value for money. Beautiful sights and well-organized activities. The food options could be improved though.",
            rating: 4,
            user: {
              name: "Olivia Taylor",
              photo: "/api/placeholder/100/100?text=User+5",
            },
            createdAt: "2025-02-20T12:00:00.000Z",
            helpful: 2,
          },
        ];

  // Calculate ratings summary
  const ratingsCount = tourReviews.length;
  const averageRating =
    tourReviews.reduce((acc, review) => acc + review.rating, 0) / ratingsCount;
  const ratingDistribution = {
    5: tourReviews.filter((r) => r.rating === 5).length,
    4: tourReviews.filter((r) => r.rating === 4).length,
    3: tourReviews.filter((r) => r.rating === 3).length,
    2: tourReviews.filter((r) => r.rating === 2).length,
    1: tourReviews.filter((r) => r.rating === 1).length,
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = tourReviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );
  const totalPages = Math.ceil(tourReviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Reviews & Ratings</h2>

      {/* Rating Summary */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="text-center md:border-r md:pr-6 md:w-1/4">
            <div className="text-5xl font-bold text-green-600 dark:text-green-500 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className="text-yellow-400"
                  fill={
                    star <= Math.round(averageRating) ? "currentColor" : "none"
                  }
                />
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{ratingsCount} reviews</p>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold mb-3 dark:text-white">Rating Distribution</h3>
            {[5, 4, 3, 2, 1].map((rating) => {
              const percentage =
                (ratingDistribution[rating] / ratingsCount) * 100;
              return (
                <div key={rating} className="flex items-center mb-2">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm">{rating}</span>
                    <Star
                      size={14}
                      className="text-yellow-400"
                      fill="currentColor"
                    />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded mx-2">
                    <div
                      className="h-2 bg-green-600 rounded"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="md:w-1/4 md:border-l md:pl-6 self-stretch flex flex-col">
            <h3 className="font-semibold mb-3 dark:text-white">Write a Review</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share your experience with this tour to help others make better
              decisions.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors mt-auto dark:bg-green-700 dark:hover:bg-green-800">
              Write a Review
            </button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {currentReviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={
                      review.user.photo?.startsWith('http') ? review.user.photo :
                      review.user.photo ? `https://natours-yslc.onrender.com/img/users/${review.user.photo}` :
                      "/api/placeholder/100/100?text=User"
                    }
                    alt={review.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold dark:text-white">{review.user.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-3 py-1 rounded-md">
                <Star
                  size={16}
                  className="text-yellow-500 fill-yellow-500 mr-1"
                />
                <span className="font-medium">{review.rating}</span>
              </div>
            </div>

            <p className="mt-4 text-slate-700 dark:text-gray-300">{review.review}</p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500">
                <ThumbsUp size={14} />
                <span>Helpful ({review.helpful})</span>
              </button>
              <button className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500">
                <Flag size={14} />
                <span>Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
            }`}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "text-green-600 dark:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20"
            }`}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TourReviews;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, CheckCircle, MessageSquare, Trash2, Send } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const ReviewsSection = ({ productId, ratingsAverage = 0, ratingsCount = 0 }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { success, error, warning } = useToast();

  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [loading, setLoading] = useState(true);

  // New review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await reviewService.getProductReviews(productId);
        if (res.success) {
          setReviews(res.reviews || []);
          setDistribution(res.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        }
      } catch (err) {
        console.warn('Reviews fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      warning('Please sign in to write a review');
      return;
    }
    if (!comment.trim()) {
      warning('Please enter a review comment');
      return;
    }

    try {
      setSubmitting(true);
      const res = await reviewService.createReview({
        productId,
        rating,
        title: title.trim(),
        comment: comment.trim()
      });

      if (res.success && res.review) {
        setReviews([res.review, ...reviews]);
        // Update distribution
        setDistribution((prev) => ({
          ...prev,
          [rating]: (prev[rating] || 0) + 1
        }));
        setTitle('');
        setComment('');
        success(res.message || 'Review submitted successfully!');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const res = await reviewService.deleteReview(reviewId);
      if (res.success) {
        setReviews(reviews.filter((r) => r._id !== reviewId));
        success('Review deleted');
      }
    } catch (err) {
      error(err.customMessage || 'Failed to delete review');
    }
  };

  const totalReviews = reviews.length;

  return (
    <div className="space-y-10">
      {/* Ratings Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft">
        {/* Score column */}
        <div className="md:col-span-4 text-center md:border-r border-slate-100 md:pr-8">
          <div className="text-5xl font-black text-slate-900 tracking-tight mb-2">
            {(ratingsAverage || 0).toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            <RatingStars rating={ratingsAverage} size="md" showScore={false} />
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Based on {totalReviews || ratingsCount} customer ratings
          </p>
        </div>

        {/* Breakdown bar charts */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-slate-600 flex items-center gap-1">
                  <span>{stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-medium">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-soft">
        <h4 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-600" />
          <span>Write a Customer Review</span>
        </h4>
        <p className="text-xs text-slate-400 mb-6">
          Share your real experience with this product to help other shoppers make informed choices.
        </p>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 -ml-1 text-slate-300 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-bold text-slate-700">
                  {rating === 5 ? 'Excellent' : rating === 4 ? 'Very Good' : rating === 3 ? 'Average' : rating === 2 ? 'Below Average' : 'Poor'}
                </span>
              </div>
            </div>

            {/* Review Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Headline / Title
              </label>
              <input
                type="text"
                placeholder="e.g., Exceeded my expectations!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Review Details *
              </label>
              <textarea
                rows={4}
                required
                placeholder="What did you like or dislike? How was the build quality and performance?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Review'}</span>
            </button>
          </form>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl text-center">
            <p className="text-sm text-slate-600 mb-3">
              You need to be signed in to write a review.
            </p>
            <Link
              to="/login"
              className="inline-flex px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold text-xs transition-colors shadow-xs"
            >
              Sign In to Review
            </Link>
          </div>
        )}
      </div>

      {/* Customer Reviews List */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-slate-900">
          Customer Feedback ({reviews.length})
        </h4>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 text-sm">
            No reviews yet. Be the first customer to review this product!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
            {reviews.map((rev) => (
              <div key={rev._id} className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-slate-800 mr-2">
                        {rev.user?.name || 'Verified Buyer'}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          <span>Verified Purchase</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Date and Delete Option */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    {(isAdmin || (user && rev.user?._id === user._id)) && (
                      <button
                        onClick={() => handleDeleteReview(rev._id)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-1">
                  <RatingStars rating={rev.rating} size="xs" showScore={false} />
                </div>

                {rev.title && (
                  <h5 className="font-bold text-sm text-slate-900 pt-1">
                    {rev.title}
                  </h5>
                )}

                <p className="text-sm text-slate-600 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { ChevronDown, Filter, Flag, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";

interface Review {
    id: string;
    guestName: string;
    guestAvatar?: string;
    rating: number;
    comment: string;
    createdAt: string;
    helpfulCount: number;
    response?: {
        hostName: string;
        comment: string;
        createdAt: string;
    };
    categories: {
        cleanliness: number;
        communication: number;
        checkIn: number;
        accuracy: number;
        location: number;
        value: number;
    };
}

interface PropertyReviewsProps {
    reviews: Review[];
    overallRating: number;
    totalReviews: number;
    ratingBreakdown: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
    categoryAverages: {
        cleanliness: number;
        communication: number;
        checkIn: number;
        accuracy: number;
        location: number;
        value: number;
    };
}

export function PropertyReviews({
    reviews,
    overallRating,
    totalReviews,
    ratingBreakdown,
    categoryAverages,
}: PropertyReviewsProps) {
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [filterRating, setFilterRating] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState("recent");

    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

    const filteredReviews = filterRating
        ? displayedReviews.filter((review) => review.rating === filterRating)
        : displayedReviews;

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        switch (sortBy) {
            case "recent":
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case "oldest":
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "highest":
                return b.rating - a.rating;
            case "lowest":
                return a.rating - b.rating;
            default:
                return 0;
        }
    });

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                        <Star className="w-5 h-5 fill-current text-yellow-500" />
                        <span>
                            {overallRating} • {totalReviews} reviews
                        </span>
                    </CardTitle>
                </div>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* Rating Overview */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Rating Distribution */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Rating Distribution</h3>
                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating) => {
                                const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
                                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                                return (
                                    <div key={rating} className="flex items-center space-x-3">
                                        <button
                                            onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                                            className={`flex items-center space-x-1 text-sm transition-colors ${
                                                filterRating === rating
                                                    ? "text-primary font-medium"
                                                    : "hover:text-primary"
                                            }`}
                                        >
                                            <span>{rating}</span>
                                            <Star className="w-3 h-3 fill-current" />
                                        </button>
                                        <div className="flex-1">
                                            <Progress value={percentage} className="h-2" />
                                        </div>
                                        <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Ratings */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Category Ratings</h3>
                        <div className="space-y-3">
                            {Object.entries(categoryAverages).map(([category, rating]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <span className="text-sm capitalize">
                                        {category === "checkIn" ? "Check-in" : category}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${
                                                        i < Math.round(rating)
                                                            ? "fill-current text-yellow-500"
                                                            : "text-muted-foreground"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Review Controls */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                        {filterRating && (
                            <Badge variant="secondary" className="flex items-center space-x-1">
                                <span>{filterRating}</span>
                                <Star className="w-3 h-3 fill-current" />
                                <button onClick={() => setFilterRating(null)} className="ml-1 hover:text-destructive">
                                    ×
                                </button>
                            </Badge>
                        )}
                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm bg-background"
                    >
                        <option value="recent">Most recent</option>
                        <option value="oldest">Oldest first</option>
                        <option value="highest">Highest rated</option>
                        <option value="lowest">Lowest rated</option>
                    </select>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {sortedReviews.map((review) => (
                        <div key={review.id} className="space-y-4">
                            {/* Review Header */}
                            <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-4">
                                    <Avatar>
                                        <AvatarImage src={review.guestAvatar} alt={review.guestName} />
                                        <AvatarFallback>
                                            {review.guestName
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-medium">{review.guestName}</h4>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <div className="flex items-center space-x-1">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-3 h-3 ${
                                                            i < review.rating
                                                                ? "fill-current text-yellow-500"
                                                                : "text-muted-foreground"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <span>•</span>
                                            <span>
                                                {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button variant="ghost" size="sm">
                                    <Flag className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Review Content */}
                            <div className="ml-14">
                                <p className="text-muted-foreground leading-relaxed mb-4">{review.comment}</p>

                                {/* Category Ratings */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4 text-xs">
                                    {Object.entries(review.categories).map(([category, rating]) => (
                                        <div key={category} className="flex items-center justify-between">
                                            <span className="capitalize text-muted-foreground">
                                                {category === "checkIn" ? "Check-in" : category}
                                            </span>
                                            <div className="flex items-center space-x-1">
                                                <Star className="w-3 h-3 fill-current text-yellow-500" />
                                                <span>{rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Review Actions */}
                                <div className="flex items-center space-x-4">
                                    <Button variant="ghost" size="sm" className="text-xs">
                                        <ThumbsUp className="w-3 h-3 mr-1" />
                                        Helpful ({review.helpfulCount})
                                    </Button>
                                </div>

                                {/* Host Response */}
                                {review.response && (
                                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-medium text-sm">
                                                Response from {review.response.hostName}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(review.response.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{review.response.comment}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Show More Button */}
                {!showAllReviews && reviews.length > 6 && (
                    <div className="text-center">
                        <Button
                            variant="outline"
                            onClick={() => setShowAllReviews(true)}
                            className="flex items-center space-x-2"
                        >
                            <span>Show all {totalReviews} reviews</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </div>
                )}

                {/* Write Review CTA */}
                <div className="text-center pt-6 border-t">
                    <div className="space-y-3">
                        <h3 className="font-semibold">Share your experience</h3>
                        <p className="text-muted-foreground text-sm">
                            Help other travelers by sharing your thoughts about this property.
                        </p>
                        <Button>Write a Review</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TourPackage extends Model
{
    protected $table = 'tour_packages';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'slug',
        'title',
        'destination',
        'category',
        'tour_type',
        'price',
        'show_price',
        'show_price_breakdown',
        'tax',
        'duration',
        'duration_days',
        'duration_nights',
        'rating',
        'reviews_count',
        'description',
        'overview',
        'route_overview',
        'highlights',
        'itinerary',
        'inclusions',
        'exclusions',
        'image',
        'gallery',
        'holiday_category',
        'terms_and_conditions',
        'cancellation_policy',
        'quick_info',
        'featured',
        'related_tours',
        'status',
        'meta_title',
        'meta_description',
        'canonical_url',
    ];

    protected $casts = [
        'price' => 'float',
        'show_price' => 'boolean',
        'show_price_breakdown' => 'boolean',
        'tax' => 'float',
        'duration_days' => 'integer',
        'duration_nights' => 'integer',
        'rating' => 'float',
        'reviews_count' => 'integer',
        'featured' => 'boolean',
        'overview' => 'array',
        'route_overview' => 'array',
        'highlights' => 'array',
        'itinerary' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'gallery' => 'array',
        'holiday_category' => 'array',
        'terms_and_conditions' => 'array',
        'cancellation_policy' => 'array',
        'quick_info' => 'array',
        'related_tours' => 'array',
    ];
}

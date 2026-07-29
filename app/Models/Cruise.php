<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cruise extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'destination',
        'duration',
        'price',
        'show_price',
        'short_description',
        'about',
        'banner_image',
        'gallery',
        'highlights',
        'itinerary',
        'inclusions',
        'exclusions',
        'need_to_know',
        'faqs',
        'reviews',
        'featured',
        'order_no',
        'status',
        'meta_title',
        'meta_description',
        'url_slug',
        'canonical_url',
    ];

    protected $casts = [
        'show_price' => 'boolean',
        'featured' => 'boolean',
        'gallery' => 'array',
        'highlights' => 'array',
        'itinerary' => 'array',
        'inclusions' => 'array',
        'exclusions' => 'array',
        'need_to_know' => 'array',
        'faqs' => 'array',
        'reviews' => 'array',
        'order_no' => 'integer',
        'price' => 'decimal:2',
    ];
}

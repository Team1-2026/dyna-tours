<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupTour extends Model
{
    protected $fillable = [
        'name',
        'destination',
        'type',
        'image',
        'duration',
        'departure_date',
        'starting_price',
        'status',
        'full_details',
        'is_visible',
        'is_featured',
        'featured_order',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'url_slug',
        'og_title',
        'og_description',
        'og_image',
        'canonical_url',
        'structured_data'
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'is_featured' => 'boolean',
        'departure_date' => 'date',
        'starting_price' => 'decimal:2',
    ];

    public function enquiries()
    {
        return $this->hasMany(GroupTourEnquiry::class);
    }
}

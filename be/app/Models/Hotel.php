<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'destination_id',
        'short_description',
        'about',
        'location',
        'distance_from_attractions',
        'category',
        'gallery',
        'facilities',
        'featured',
        'show_rooms',
        'show_offer_label',
        'show_price',
        'price',
        'offer_label',
        'order_no',
        'status',
        'meta_title',
        'meta_description',
        'url_slug',
        'canonical_url',
        'og_title',
        'og_description',
        'country',
        'state',
        'city',
        'inclusions',
        'exclusions',
        'terms_conditions',
        'related_hotels',
        'video_url',
    ];

    protected $casts = [
        'gallery' => 'array',
        'facilities' => 'array',
        'featured' => 'boolean',
        'show_rooms' => 'boolean',
        'show_offer_label' => 'boolean',
        'show_price' => 'boolean',
        'price' => 'float',
        'order_no' => 'integer',
        'related_hotels' => 'array',
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class, 'destination_id', 'id');
    }

    public function rooms()
    {
        return $this->hasMany(Room::class, 'hotel_id', 'id');
    }

    public function facilities()
    {
        return $this->belongsToMany(Facility::class, 'hotel_facility', 'hotel_id', 'facility_id');
    }
}

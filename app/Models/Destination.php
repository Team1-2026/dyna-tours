<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'type',
        'parent_id',
        'overview',
        'how_to_reach',
        'best_time_to_visit',
        'banner_image',
        'gallery',
        'top_attractions',
        'show_packages',
        'show_hotels',
        'meta_title',
        'meta_description',
        'url_slug',
        'canonical_url',
        'country',
        'state',
        'city',
        'related_tours',
        'order_no',
    ];

    protected $casts = [
        'gallery' => 'array',
        'top_attractions' => 'array',
        'show_packages' => 'boolean',
        'show_hotels' => 'boolean',
        'related_tours' => 'array',
        'order_no' => 'integer',
    ];

    public function subDestinations()
    {
        return $this->hasMany(Destination::class, 'parent_id', 'id');
    }

    public function parentDestination()
    {
        return $this->belongsTo(Destination::class, 'parent_id', 'id');
    }

    public function hotels()
    {
        return $this->hasMany(Hotel::class, 'destination_id', 'id')->orderBy('order_no', 'asc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    use HasFactory;

    protected $fillable = [
        'hotel_id',
        'type',
        'size',
        'view',
        'bed_type',
        'breakfast',
        'occupancy',
        'image',
        'description',
        'images',
        'amenities',
        'price',
        'remaining_rooms',
        'video_url',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'price' => 'float',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class, 'hotel_id', 'id');
    }
}

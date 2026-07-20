<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'type',
        'destination_id',
        'description',
        'price',
        'image',
        'metadata',
        'status',
    ];

    protected $casts = [
        'price' => 'float',
        'metadata' => 'array',
    ];

    public function destination(): BelongsTo
    {
        return $this->belongsTo(Destination::class, 'destination_id', 'id');
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visa extends Model
{
    use HasFactory;

    // Use string IDs
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'flag',
        'type',
        'price',
        'processing_time',
        'validity',
        'biometric',
        'entry_type',
        'stay_period',
        'description',
        'requirements',
        'important_notes',
        'terms',
        'faqs',
        'region',
        'is_active',
    ];

    protected $casts = [
        'requirements' => 'array',
        'important_notes' => 'array',
        'terms' => 'array',
        'faqs' => 'array',
        'is_active' => 'boolean',
    ];
}

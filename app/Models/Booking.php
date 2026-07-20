<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference',
        'customer_id',
        'service_id',
        'requirements',
        'from_date',
        'to_date',
        'num_travelers',
        'price_paid',
        'status',
        'notes',
        'user_id',
        'booked_at',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
        'num_travelers' => 'integer',
        'price_paid' => 'float',
        'booked_at' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

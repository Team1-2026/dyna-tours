<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'entity_type',
        'description',
        'is_active',
        'order_no',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'order_no' => 'integer',
    ];
}

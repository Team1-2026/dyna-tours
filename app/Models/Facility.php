<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
        'description',
    ];

    public function hotels()
    {
        return $this->belongsToMany(Hotel::class, 'hotel_facility', 'facility_id', 'hotel_id');
    }
}

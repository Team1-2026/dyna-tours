<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'target_id',
        'name',
        'phone',
        'email',
        'num_people',
        'travel_date',
        'check_in',
        'check_out',
        'num_adults',
        'num_children',
        'children_ages',
        'message',
    ];
}

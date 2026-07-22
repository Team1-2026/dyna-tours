<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupTourEnquiry extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'num_travellers',
        'message',
        'group_tour_id',
        'status'
    ];

    public function groupTour()
    {
        return $this->belongsTo(GroupTour::class);
    }
}

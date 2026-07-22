<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GroupTourPage extends Model
{
    protected $fillable = [
        'title',
        'tagline',
        'banner_image',
        'overview_heading',
        'overview_description',
        'overview_image'
    ];
}

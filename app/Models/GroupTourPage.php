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
        'overview_image',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'url_slug',
        'og_title',
        'og_description',
        'og_image',
        'canonical_url',
        'structured_data'
    ];
}

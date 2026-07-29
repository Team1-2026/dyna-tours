<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CruisePage extends Model
{
    use HasFactory;

    protected $table = 'cruise_pages';

    protected $fillable = [
        'banner_title',
        'banner_tagline',
        'banner_image',
        'overview_heading',
        'overview_description',
        'overview_image',
        'overview_cta_text',
        'cta_heading',
        'cta_description',
        'cta_image',
        'cta_button1_text',
        'cta_button2_text',
        'faqs',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'faqs' => 'array',
    ];
}

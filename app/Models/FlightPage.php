<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FlightPage extends Model
{
    protected $fillable = [
        'hero_headline',
        'hero_tagline',
        'hero_image',
        'overview_title',
        'overview_description',
        'overview_image',
        'gallery_images',
        'why_book_title',
        'why_book_benefits',
        'cta_heading',
        'cta_text',
        'cta_bg_image',
        'whatsapp_number',
        'faqs',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'why_book_benefits' => 'array',
        'faqs' => 'array',
    ];
}

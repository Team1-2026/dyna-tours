<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    use HasFactory;

    protected $fillable = [
        'hero_slides',
        'offers',
        'themes',
        'stats',
        'testimonials',
        'blogs',
        'about',
        'cta',
        'reviews_bottom_content',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'og_title',
        'og_description',
        'og_image',
    ];

    protected $casts = [
        'hero_slides' => 'array',
        'offers' => 'array',
        'themes' => 'array',
        'stats' => 'array',
        'testimonials' => 'array',
        'blogs' => 'array',
        'about' => 'array',
        'cta' => 'array',
        'reviews_bottom_content' => 'array',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactPage extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_subtitle',
        'hero_bg_image',
        'hero_cta_primary_text',
        'hero_cta_primary_url',
        'hero_cta_secondary_text',
        'hero_cta_secondary_url',
        'office_name',
        'office_address',
        'google_maps_url',
        'phone_numbers',
        'email_addresses',
        'business_hours_weekday',
        'business_hours_weekend',
        'brand_tagline',
        'brand_description',
        'social_links',
        'quick_contact_cards',
        'why_contact_cards',
        'map_embed_url',
    ];

    protected $casts = [
        'phone_numbers' => 'array',
        'email_addresses' => 'array',
        'social_links' => 'array',
        'quick_contact_cards' => 'array',
        'why_contact_cards' => 'array',
    ];
}

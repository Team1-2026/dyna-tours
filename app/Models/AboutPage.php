<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_subtitle',
        'hero_bg_image',
        'overview_title',
        'overview_description',
        'overview_image_1',
        'overview_image_2',
        'years_experience',
        'founder_name',
        'founder_title',
        'founder_image',
        'founder_message',
        'founder_quote',
        'founder_signature',
        'mission_title',
        'mission_text',
        'vision_title',
        'vision_text',
        'why_choose_title',
        'why_choose_cards',
        'services_title',
        'services_list',
        'trusted_partner_title',
        'trusted_partner_description',
        'trusted_partner_bg_image',
        'trust_badges',
        'achievements_title',
        'achievements_bg_image',
        'achievement_counters',
        'certifications_title',
        'certification_logos',
        'cta_title',
        'cta_description',
        'cta_bg_image',
        'cta_primary_btn_text',
        'cta_primary_btn_url',
        'cta_secondary_btn_text',
        'cta_secondary_btn_url',
    ];

    protected $casts = [
        'why_choose_cards' => 'array',
        'services_list' => 'array',
        'trust_badges' => 'array',
        'achievement_counters' => 'array',
        'certification_logos' => 'array',
    ];
}

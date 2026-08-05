<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\VisaPage;
use Illuminate\Http\Request;

class VisaPageController extends Controller
{
    /**
     * Get Visa Page SEO settings.
     */
    public function show()
    {
        $page = VisaPage::first();

        if (!$page) {
            $page = VisaPage::create([
                'meta_title' => 'Trusted Global Visa Services | Dyna Tours India',
                'meta_description' => 'Apply for your tourist visa with confidence. Dyna Tours India provides reliable visa assistance for international destinations, including e-Visas and embassy visas.',
                'meta_keywords' => 'Visa Services, Tourist Visa, e-Visa, Schengen Visa, USA Visa, UK Visa, Dyna Tours',
                'url_slug' => 'visa',
                'og_title' => 'Trusted Global Visa Services | Dyna Tours India',
                'og_description' => 'Apply for your tourist visa with confidence. Dyna Tours India provides reliable visa assistance for international destinations.',
            ]);
        }

        return response()->json($page);
    }

    /**
     * Update Visa Page SEO settings.
     */
    public function update(Request $request)
    {
        $page = VisaPage::first();
        if (!$page) {
            $page = new VisaPage();
        }

        $validated = $request->validate([
            'meta_title' => 'sometimes|string|nullable',
            'meta_description' => 'sometimes|string|nullable',
            'meta_keywords' => 'sometimes|string|nullable',
            'url_slug' => 'sometimes|string|nullable',
            'og_title' => 'sometimes|string|nullable',
            'og_description' => 'sometimes|string|nullable',
            'og_image' => 'sometimes|string|nullable',
            'canonical_url' => 'sometimes|string|nullable',
            'structured_data' => 'sometimes|string|nullable',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json([
            'message' => 'Visa page SEO settings updated successfully',
            'page' => $page
        ]);
    }
}

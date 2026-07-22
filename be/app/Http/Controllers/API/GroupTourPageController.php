<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GroupTourPage;
use Illuminate\Http\Request;

class GroupTourPageController extends Controller
{
    public function show()
    {
        $page = GroupTourPage::first();
        if (!$page) {
            $page = GroupTourPage::create([
                'title' => 'Group Tours',
                'tagline' => 'Explore the World Together with Our Carefully Planned Group Tours',
                'banner_image' => '',
                'overview_heading' => 'Why Choose Our Group Tours?',
                'overview_description' => 'Travel brings people together...',
                'overview_image' => '',
            ]);
        }
        return response()->json($page);
    }

    public function update(Request $request)
    {
        $page = GroupTourPage::first();
        if (!$page) {
            $page = new GroupTourPage();
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'banner_image' => 'nullable|string',
            'overview_heading' => 'nullable|string|max:255',
            'overview_description' => 'nullable|string',
            'overview_image' => 'nullable|string',
        ]);

        $page->fill($validated);
        $page->save();

        return response()->json(['message' => 'Page settings updated successfully', 'page' => $page]);
    }
}

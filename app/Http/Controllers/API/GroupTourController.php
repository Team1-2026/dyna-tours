<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GroupTour;
use App\Services\ImageStorageService;
use Illuminate\Http\Request;

class GroupTourController extends Controller
{
    public function index(Request $request)
    {
        $query = GroupTour::query();

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('destination')) {
            $query->where('destination', 'like', '%' . $request->destination . '%');
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true)->orderBy('featured_order', 'asc');
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        if ($request->has('visible_only') || !request()->user()) {
            $query->where('is_visible', true);
        }

        $tours = $query->get();

        // Sanitize and auto-migrate base64 images
        foreach ($tours as $tour) {
            $changed = false;
            if (ImageStorageService::isBase64Image($tour->image)) {
                $tour->image = ImageStorageService::saveBase64ToFile($tour->image, 'grouptour_img');
                $changed = true;
            }
            if (ImageStorageService::isBase64Image($tour->banner_image)) {
                $tour->banner_image = ImageStorageService::saveBase64ToFile($tour->banner_image, 'grouptour_banner');
                $changed = true;
            }
            if (is_array($tour->gallery)) {
                $hasBase64 = false;
                foreach ($tour->gallery as $item) {
                    $u = is_string($item) ? $item : ($item['url'] ?? '');
                    if (ImageStorageService::isBase64Image($u)) {
                        $hasBase64 = true;
                        break;
                    }
                }
                if ($hasBase64) {
                    $tour->gallery = ImageStorageService::cleanGallery($tour->gallery, 'grouptour_gallery');
                    $changed = true;
                }
            }
            if ($changed) {
                $tour->save();
            }
        }

        return response()->json($tours);
    }

    private function sanitizeArrayInputs(Request $request): void
    {
        if ($request->has('gallery')) {
            $val = $request->input('gallery');
            if (is_string($val)) {
                $decoded = json_decode($val, true);
                $request->merge(['gallery' => is_array($decoded) ? $decoded : []]);
            } elseif (is_null($val) || $val === '') {
                $request->merge(['gallery' => []]);
            }
        }
    }

    public function store(Request $request)
    {
        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'destination' => 'required|string|max:255',
            'type' => 'required|in:domestic,international',
            'image' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'banner_title' => 'nullable|string|max:255',
            'banner_tagline' => 'nullable|string|max:255',
            'gallery' => 'nullable|array',
            'duration' => 'required|string|max:255',
            'departure_date' => 'nullable|date',
            'starting_price' => 'required|numeric|min:0',
            'status' => 'required|in:Filling Fast,Limited Seats,Available,Sold Out',
            'full_details' => 'nullable|string',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'featured_order' => 'integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'url_slug' => 'nullable|string|max:255',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'canonical_url' => 'nullable|string|max:255',
            'structured_data' => 'nullable|string',
        ]);

        if (isset($validated['image'])) {
            $validated['image'] = ImageStorageService::saveBase64ToFile($validated['image'], 'grouptour_img');
        }
        if (isset($validated['banner_image'])) {
            $validated['banner_image'] = ImageStorageService::saveBase64ToFile($validated['banner_image'], 'grouptour_banner');
        }
        if (isset($validated['gallery']) && is_array($validated['gallery'])) {
            $validated['gallery'] = ImageStorageService::cleanGallery($validated['gallery'], 'grouptour_gallery');
        }

        $tour = GroupTour::create($validated);
        return response()->json(['message' => 'Group Tour created successfully', 'tour' => $tour], 201);
    }

    public function show($id)
    {
        return response()->json(GroupTour::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $tour = GroupTour::findOrFail($id);
        $this->sanitizeArrayInputs($request);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'destination' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|in:domestic,international',
            'image' => 'nullable|string',
            'banner_image' => 'nullable|string',
            'banner_title' => 'nullable|string|max:255',
            'banner_tagline' => 'nullable|string|max:255',
            'gallery' => 'nullable|array',
            'duration' => 'sometimes|required|string|max:255',
            'departure_date' => 'nullable|date',
            'starting_price' => 'sometimes|required|numeric|min:0',
            'status' => 'sometimes|required|in:Filling Fast,Limited Seats,Available,Sold Out',
            'full_details' => 'nullable|string',
            'is_visible' => 'boolean',
            'is_featured' => 'boolean',
            'featured_order' => 'integer',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
            'url_slug' => 'nullable|string|max:255',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'canonical_url' => 'nullable|string|max:255',
            'structured_data' => 'nullable|string',
        ]);

        if (isset($validated['image'])) {
            $validated['image'] = ImageStorageService::saveBase64ToFile($validated['image'], 'grouptour_img');
        }
        if (isset($validated['banner_image'])) {
            $validated['banner_image'] = ImageStorageService::saveBase64ToFile($validated['banner_image'], 'grouptour_banner');
        }
        if (isset($validated['gallery']) && is_array($validated['gallery'])) {
            $validated['gallery'] = ImageStorageService::cleanGallery($validated['gallery'], 'grouptour_gallery');
        }

        $tour->update($validated);
        return response()->json(['message' => 'Group Tour updated successfully', 'tour' => $tour]);
    }

    public function destroy($id)
    {
        GroupTour::findOrFail($id)->delete();
        return response()->json(['message' => 'Group Tour deleted successfully']);
    }
}

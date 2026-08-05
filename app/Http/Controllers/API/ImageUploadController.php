<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,svg|max:1024',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            $path = $file->storeAs('uploads', $filename, 'public');
            $url = '/storage/' . $path;

            return response()->json([
                'message' => 'Image uploaded successfully',
                'url' => $url
            ], 200);
        }

        return response()->json(['message' => 'No image file uploaded'], 400);
    }
}

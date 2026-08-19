<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Visa;
use Illuminate\Http\Request;

class VisaController extends Controller
{
    public function index()
    {
        $visas = Visa::all();
        return response()->json($visas);
    }

    public function show($id)
    {
        $clean = strtolower(trim($id));
        $visa = Visa::where('id', $id)
            ->orWhere('id', $clean)
            ->orWhere('url_slug', $clean)
            ->first();

        if (!$visa) {
            // Check common aliases
            $aliasMap = [
                'united-arab-emirates' => 'uae',
                'dubai' => 'uae',
                'united-kingdom' => 'uk',
                'great-britain' => 'uk',
                'united-states' => 'usa',
                'united-states-of-america' => 'usa',
                'new-zealand' => 'newzealand',
                'newzealand' => 'new-zealand',
                'southkorea' => 'south-korea',
                'southafrica' => 'south-africa',
            ];
            if (isset($aliasMap[$clean])) {
                $targetId = $aliasMap[$clean];
                $visa = Visa::where('id', $targetId)
                    ->orWhere('url_slug', $targetId)
                    ->first();
            }
        }

        if (!$visa) {
            // Try matching name slug
            $visa = Visa::all()->first(function ($v) use ($clean) {
                $slug = \Illuminate\Support\Str::slug($v->name);
                return $slug === $clean || strtolower($v->name) === $clean;
            });
        }

        if (!$visa) {
            return response()->json(['message' => 'Visa not found'], 404);
        }

        return response()->json($visa);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id' => 'required|string|unique:visas,id',
            'name' => 'required|string',
            'flag' => 'required|string',
            'type' => 'required|in:e-visa,stamped',
            'processing_time' => 'required|string',
            'validity' => 'required|string',
            'biometric' => 'required|string',
        ]);

        $visa = Visa::create($request->all());

        return response()->json(['message' => 'Visa created successfully', 'visa' => $visa], 201);
    }

    public function update(Request $request, $id)
    {
        $visa = Visa::find($id);

        if (!$visa) {
            return response()->json(['message' => 'Visa not found'], 404);
        }

        $visa->update($request->all());

        return response()->json(['message' => 'Visa updated successfully', 'visa' => $visa]);
    }

    public function destroy($id)
    {
        $visa = Visa::find($id);

        if (!$visa) {
            return response()->json(['message' => 'Visa not found'], 404);
        }

        $visa->delete();

        return response()->json(['message' => 'Visa deleted successfully']);
    }
}

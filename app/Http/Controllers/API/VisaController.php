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
        $visa = Visa::find($id);

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

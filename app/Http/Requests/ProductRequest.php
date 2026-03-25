<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // STORE
        if ($this->isMethod('post')) {
            return [
                'name' => 'required|string|max:255',
                'production_code' => 'required|string|max:50|unique:products,production_code',
                'selling_price' => 'required|numeric|min:0',
                'cost_price' => 'required|numeric|min:0',
                'category_id' => ['required', 'exists:categories,id'],
                'unit_id' => 'nullable|exists:units,id',

                // Image wajib, tipe file jpg/png/jpeg, ukuran fleksibel
                'image' => 'nullable|file|mimes:jpeg,png,jpg|min:0',
            ];
        }

        // UPDATE
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $product = $this->route('product');
            $productId = $product ? $product->id : null;

            return [
                'name' => 'required|string|max:255',
                'production_code' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique('products', 'production_code')->ignore($productId),
                ],
                'selling_price' => 'required|numeric|min:0',
                'cost_price' => 'required|numeric|min:0',
                'category_id' => 'required|exists:categories,id',
                'unit_id' => 'required|exists:units,id',

                // Image optional saat update
                'image' => 'nullable|file|mimes:jpeg,png,jpg|min:0',
            ];
        }

        return [];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StockOpnameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
{
    return [
        // ===== TABLE stock_opnames =====
        'opname_date' => ['required', 'date'],
        'status' => ['required', 'string', 'in:pending,approved,canceled'],

        // ===== RELASI stock_opname_details =====
        'products' => ['required', 'array', 'min:1'],

        'products.*.product_id' => [
            'required',
            'integer',
            'exists:products,id'
        ],

        'products.*.physical_quantity' => [
            'required',
            'integer',
            'min:0'
        ],
    ];
}
}

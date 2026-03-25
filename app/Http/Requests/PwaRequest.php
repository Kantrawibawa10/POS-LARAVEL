<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PwaRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:100',
            'short_name' => 'required|string|max:50',
            'theme_color' => 'required|string'
        ];
    }
}

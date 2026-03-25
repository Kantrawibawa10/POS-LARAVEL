<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Province;
use Laravolt\Indonesia\Models\Province as IndonesiaProvince;

class ProvincesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = IndonesiaProvince::all();

        if ($provinces->isEmpty()) {
            $this->command->error('No provinces found from Laravolt Indonesia.');
            return;
        }

        $this->storeProvinces($provinces);

        $this->command->info('Provinces table seeded successfully.');
    }

    private function storeProvinces($provinces): void
    {
        $data = $provinces->map(function ($province) {
            return [
                'id' => $province->id,
                'name' => $province->name,
            ];
        })->toArray();

        Province::insert($data);
    }
}
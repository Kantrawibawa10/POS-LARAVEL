<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\City;
use App\Models\Province;
use Laravolt\Indonesia\Models\City as IndonesiaCity;

class CitiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $provinces = Province::all();

        if ($provinces->isEmpty()) {
            $this->command->error('Tidak ada data provinsi. Jalankan ProvincesTableSeeder terlebih dahulu.');
            return;
        }

        $cities = IndonesiaCity::all();

        if ($cities->isEmpty()) {
            $this->command->error('Tidak ada data kota dari Laravolt Indonesia.');
            return;
        }

        $this->storeCities($cities);

        $this->command->info('Table Kota berhasil di-seed.');
    }

    private function storeCities($cities): void
    {
        $data = $cities->map(function ($city) {
            return [
                'id' => $city->id,
                'province_id' => $city->province_code,
                'name' => $city->name,
            ];
        })->toArray();

        City::insert($data);
    }
}
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();

            $table->index('slug');
        });

        // Insert default categories
        $defaultCategories = [
            ['name' => 'System', 'slug' => 'system'],
            ['name' => 'Productivity', 'slug' => 'productivity'],
            ['name' => 'Development', 'slug' => 'development'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Social', 'slug' => 'social'],
            ['name' => 'Entertainment', 'slug' => 'entertainment'],
            ['name' => 'Utilities', 'slug' => 'utilities'],
            ['name' => 'Games', 'slug' => 'games'],
            ['name' => 'Other', 'slug' => 'other'],
        ];

        foreach ($defaultCategories as $category) {
            DB::table('categories')->insert([
                'name' => $category['name'],
                'slug' => $category['slug'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};


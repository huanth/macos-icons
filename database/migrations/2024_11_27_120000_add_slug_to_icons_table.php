<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('icons', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('name');
        });
        
        // Generate slugs for existing icons
        $icons = \App\Models\Icon::all();
        foreach ($icons as $icon) {
            $baseSlug = \Illuminate\Support\Str::slug($icon->name);
            $slug = $baseSlug;
            $counter = 1;
            
            while (\App\Models\Icon::where('slug', $slug)->where('id', '!=', $icon->id)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            
            $icon->update(['slug' => $slug]);
        }
        
        // Add unique index after generating slugs
        Schema::table('icons', function (Blueprint $table) {
            $table->unique('slug');
            $table->index('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('icons', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropColumn('slug');
        });
    }
};


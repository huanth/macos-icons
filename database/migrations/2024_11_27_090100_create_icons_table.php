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
        Schema::create('icons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category');
            $table->string('size')->nullable();
            $table->string('tags')->nullable();
            $table->string('file_path');
            $table->string('preview_path')->nullable(); // Preview image for ICNS
            $table->string('file_type'); // svg or icns
            $table->integer('file_size'); // in bytes
            $table->integer('downloads')->default(0);
            $table->boolean('is_approved')->default(false);
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('category');
            $table->index('is_approved');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('icons');
    }
};


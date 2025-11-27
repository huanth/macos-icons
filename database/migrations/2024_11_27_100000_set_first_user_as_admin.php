<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Set the first user as admin
        $firstUser = User::orderBy('id')->first();
        if ($firstUser) {
            $firstUser->update(['role' => 'admin']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Optionally revert the first user back to 'user'
        $firstUser = User::orderBy('id')->first();
        if ($firstUser) {
            $firstUser->update(['role' => 'user']);
        }
    }
};


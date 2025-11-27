<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');

    // Authentication settings (only admins can access)
    Route::get('settings/authentication', function () {
        abort_unless(auth()->user()->isAdmin(), 403);

        $googleEnabled = \App\Models\Setting::getBoolean('auth_google_enabled', false);
        $googleClientId = \App\Models\Setting::get('auth_google_client_id', '');
        $googleClientSecret = \App\Models\Setting::get('auth_google_client_secret', '');
        $googleRedirect = \App\Models\Setting::get('auth_google_redirect', url('/auth/google/callback'));

        return Inertia::render('settings/authentication', [
            'google' => [
                'enabled' => $googleEnabled,
                'client_id' => $googleClientId,
                'client_secret' => $googleClientSecret,
                'redirect' => $googleRedirect,
            ],
        ]);
    })->name('settings.authentication');

    Route::post('settings/authentication', function () {
        abort_unless(auth()->user()->isAdmin(), 403);

        request()->validate([
            'google_enabled' => 'boolean',
            'google_client_id' => 'nullable|string|max:255',
            'google_client_secret' => 'nullable|string|max:255',
            'google_redirect' => 'nullable|string|max:255',
        ]);

        \App\Models\Setting::set('auth_google_enabled', request('google_enabled', false));
        \App\Models\Setting::set('auth_google_client_id', request('google_client_id'));
        \App\Models\Setting::set('auth_google_client_secret', request('google_client_secret'));
        \App\Models\Setting::set('auth_google_redirect', request('google_redirect'));

        return back()->with('success', 'Authentication settings updated.');
    })->name('settings.authentication.update');
});

<?php

namespace App\Listeners;

use App\Notifications\WelcomeNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Cache;

class SendWelcomeNotification
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $user = $event->user;
        
        // Prevent duplicate emails using cache lock
        $cacheKey = "welcome_email_sent_{$user->id}";
        
        // Check if email was already sent
        if (Cache::has($cacheKey)) {
            return;
        }
        
        // Only send if user was created very recently (within last 10 seconds)
        // This prevents duplicate sends from multiple event triggers
        if ($user->created_at->diffInSeconds(now()) > 10) {
            return;
        }
        
        // Set lock for 5 minutes to prevent duplicates
        Cache::put($cacheKey, true, 300);
        
        // Send welcome email to the newly registered user
        $user->notify(new WelcomeNotification());
    }
}

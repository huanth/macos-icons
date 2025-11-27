<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('🎉 Welcome to macOS Icons - Your Icon Journey Starts Here!')
            ->greeting('Hello ' . $notifiable->name . '! 👋')
            ->line('Welcome to **macOS Icons** - Your ultimate destination for beautiful, high-quality macOS-style icons!')
            ->line('We\'re thrilled to have you join our creative community of designers and developers.')
            ->line('')
            ->line('### 🚀 What You Can Do Now:')
            ->line('')
            ->line('**📤 Upload Your Icons**')
            ->line('Share your stunning macOS-style icon designs with the community. Support for SVG and ICNS formats.')
            ->line('')
            ->line('**🔍 Browse & Download**')
            ->line('Explore thousands of beautiful macOS-style icons created by talented designers worldwide.')
            ->line('')
            ->line('**💼 Manage Your Collection**')
            ->line('Keep track of all your uploaded icons in one convenient dashboard.')
            ->line('')
            ->line('**📊 Track Performance**')
            ->line('See how many times your icons have been downloaded and appreciated.')
            ->line('')
            ->action('🎨 Go to Dashboard', url('/dashboard'))
            ->line('')
            ->line('### 💡 Quick Tips:')
            ->line('• Use descriptive names for your icons to help others find them')
            ->line('• Add relevant tags and categories for better discoverability')
            ->line('• High-quality macOS-style icons get more downloads!')
            ->line('')
            ->line('### 🆘 Need Help?')
            ->line('If you have any questions or need assistance, our support team is here to help.')
            ->line('Simply reply to this email or visit our help center.')
            ->line('')
            ->line('Happy designing! We can\'t wait to see what you create! 🎨✨')
            ->salutation('Best regards,  
**The macOS Icons Team**  
_Building the world\'s best macOS icon library, together._');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}

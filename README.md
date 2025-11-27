# macOS Icons

A beautiful, modern icon library platform for macOS-style icons. Built with Laravel, React, TypeScript, and Inertia.js.

## 🎨 Features

- **Icon Library**: Browse and download high-quality macOS-style icons
- **User Uploads**: Upload SVG and ICNS format icons with preview images
- **Category Management**: Organize icons by categories (System, Productivity, Development, etc.)
- **Search & Filter**: Search icons by name and filter by category
- **SEO Optimized**: SEO-friendly URLs with slugs, meta tags, and Open Graph support
- **Role-Based Access**: Admin and user roles with different permissions
- **Dashboard**: Personal dashboard for managing uploaded icons
- **Infinite Scroll**: Smooth infinite scroll for browsing icons
- **Download Tracking**: Track icon download counts
- **Email Notifications**: Welcome emails for new users

## 🚀 Tech Stack

- **Backend**: Laravel 11
- **Frontend**: React 18 + TypeScript
- **Framework**: Inertia.js
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Database**: MySQL
- **File Storage**: Laravel Storage (Public disk)

## 📋 Requirements

- PHP 8.2+
- Composer
- Node.js 18+
- npm or yarn
- MySQL 8.0+
- Laravel Herd (recommended) or any PHP server

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd macos-icons
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure database in `.env`**
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=macos-icons
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Run migrations**
   ```bash
   php artisan migrate
   ```

7. **Create storage link**
   ```bash
   php artisan storage:link
   ```

8. **Build assets**
   ```bash
   npm run build
   ```

   Or for development:
   ```bash
   npm run dev
   ```

## 🎯 Usage

### Development

1. **Start Laravel server** (if using Herd, it's already running)
   ```bash
   php artisan serve
   ```

2. **Start Vite dev server** (in a separate terminal)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Homepage: `http://localhost`
   - Dashboard: `http://localhost/dashboard` (requires login)

### Creating Admin User

After running migrations, the first user in the database will automatically be set as admin. You can also manually set a user as admin:

```php
php artisan tinker
$user = User::find(1);
$user->update(['role' => 'admin']);
```

## 📁 Project Structure

```
macos-icons/
├── app/
│   ├── Http/
│   │   └── Middleware/
│   │       └── EnsureUserIsAdmin.php
│   ├── Models/
│   │   ├── Icon.php
│   │   ├── Category.php
│   │   └── User.php
│   ├── Notifications/
│   │   └── WelcomeNotification.php
│   └── Listeners/
│       └── SendWelcomeNotification.php
├── database/
│   └── migrations/
│       ├── create_icons_table.php
│       ├── create_categories_table.php
│       └── add_slug_to_icons_table.php
├── resources/
│   ├── js/
│   │   ├── components/
│   │   │   ├── app-footer.tsx
│   │   │   ├── app-header.tsx
│   │   │   └── ui/
│   │   ├── layouts/
│   │   │   └── app/
│   │   ├── pages/
│   │   │   ├── welcome.tsx
│   │   │   ├── dashboard.tsx
│   │   │   ├── upload.tsx
│   │   │   ├── my-icons.tsx
│   │   │   ├── icon-detail.tsx
│   │   │   └── admin/
│   │   └── routes/
│   └── views/
│       └── app.blade.php
└── routes/
    └── web.php
```

## 🔐 User Roles

### Admin
- Manage all icons
- Manage users (edit, delete, toggle roles)
- Manage categories
- View platform statistics

### User
- Upload icons
- Manage own icons
- Download icons
- View dashboard with personal stats

## 📝 Icon Upload

### Supported Formats
- **SVG**: Vector format, preview generated automatically
- **ICNS**: macOS icon format, requires preview image (PNG/JPG)

### Upload Requirements
- Icon file: SVG or ICNS (max 5MB)
- Preview image: PNG/JPG (max 5MB, required for ICNS)
- Name: Required
- Category: Required (from database)
- Description: Optional
- Tags: Optional
- Size: Optional (512, 1024, 2048, vector)

## 🔍 SEO Features

- **Slug-based URLs**: `/icons/my-awesome-icon`
- **Meta Tags**: Title, description, keywords
- **Open Graph**: For social media sharing
- **Twitter Cards**: Optimized for Twitter
- **Sitemap Ready**: SEO-friendly structure

## 📧 Email Configuration

See `MAIL_SETUP.md` for detailed email configuration instructions.

The application sends:
- Welcome emails on user registration
- Password reset emails

## 🛠️ Available Commands

```bash
# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate storage link
php artisan storage:link

# Run tests
php artisan test
```

## 📦 Dependencies

### PHP
- Laravel 11
- Laravel Fortify (Authentication)
- Intervention Image (Image processing)

### JavaScript
- React 18
- TypeScript
- Inertia.js
- Tailwind CSS
- Shadcn/ui components
- Lucide React (Icons)

## 🎨 Design

- **Theme**: Light theme only
- **Colors**: Black, white, gray palette
- **Responsive**: Mobile-first design
- **Icons**: Lucide React icon library

## 📄 License

This project is proprietary software. All rights reserved.

## 👥 Contributing

This is a private project. For questions or support, please contact the development team.

## 🐛 Troubleshooting

### Icons not displaying
- Check storage link: `php artisan storage:link`
- Verify file permissions on `storage/app/public`
- Clear cache: `php artisan cache:clear`

### Email not sending
- Check `.env` mail configuration
- See `MAIL_SETUP.md` for setup instructions
- Verify mail driver (log, smtp, etc.)

### Migration errors
- Ensure database is created and configured
- Check `.env` database settings
- Run `php artisan migrate:fresh` (WARNING: deletes all data)

## 📞 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for the macOS icon community**


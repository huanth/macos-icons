<?php

use App\Models\Icon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    $icons = Icon::with('user')
        ->where('is_approved', true)
        ->latest()
        ->paginate(30);
    
    $categories = \App\Models\Category::orderBy('name')->get();
    
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
        'icons' => $icons,
        'categories' => $categories,
        'initialSearch' => request('search', ''),
        'initialCategory' => request('category', 'all'),
    ]);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        $userId = auth()->id();
        
        $stats = [
            'my_icons' => Icon::where('user_id', $userId)->count(),
            'my_downloads' => Icon::where('user_id', $userId)->sum('downloads'),
        ];
        
        return Inertia::render('dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');
    
    Route::get('/dashboard/upload', function () {
        $categories = \App\Models\Category::orderBy('name')->get();
        
        return Inertia::render('upload', [
            'categories' => $categories,
        ]);
    })->name('dashboard.upload');
    
    Route::post('/dashboard/upload', function () {
        // Handle upload logic here
        // Get valid category slugs
        $validCategories = \App\Models\Category::pluck('slug')->toArray();
        
        request()->validate([
            'icon' => 'required|file|mimes:svg,icns|max:5120', // 5MB max
            'preview_image' => 'nullable|file|mimes:png,jpg,jpeg|max:5120', // 5MB max
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'category' => 'required|string|in:' . implode(',', $validCategories),
            'size' => 'nullable|string|in:512,1024,2048,vector',
            'tags' => 'nullable|string|max:500',
        ]);
        
        // Store the icon with original name preserved
        $file = request()->file('icon');
        $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
        $path = $file->storeAs('macos-icons', $filename, 'public');
        
        // Handle preview for ICNS files
        $previewPath = null;
        if ($file->getClientOriginalExtension() === 'icns') {
            // For ICNS, require user to upload preview image
            $previewFile = request()->file('preview_image');
            
            if (!$previewFile) {
                return back()->withErrors(['preview_image' => 'Preview image is required for ICNS files.']);
            }
            
            // Store the preview image
            $previewFilename = time() . '_preview_' . str_replace(' ', '_', $previewFile->getClientOriginalName());
            $previewPath = $previewFile->storeAs('macos-icons/previews', $previewFilename, 'public');
        }
        
        // Generate unique slug from name
        $slug = Icon::generateUniqueSlug(request('name'));
        
        // Save to database with metadata - AUTO APPROVE ALL
        Icon::create([
            'user_id' => auth()->id(),
            'name' => request('name'),
            'slug' => $slug,
            'description' => request('description'),
            'category' => request('category'),
            'size' => request('size'),
            'tags' => request('tags'),
            'file_path' => $path,
            'preview_path' => $previewPath,
            'file_type' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
            'is_approved' => true, // AUTO APPROVE ALL ICONS
        ]);
        
        return redirect()->route('dashboard.upload')->with('success', 'macOS icon uploaded successfully!');
    })->name('dashboard.upload.store');
    
    // My Icons - User can manage their own icons
    Route::get('/dashboard/my-icons', function () {
        $icons = Icon::where('user_id', auth()->id())
            ->latest()
            ->paginate(30); // 30 icons per page
            
        return Inertia::render('my-icons', [
            'icons' => $icons,
        ]);
    })->name('dashboard.my-icons');
    
    // Delete own icon
    Route::delete('/dashboard/my-icons/{icon}', function (Icon $icon) {
        // Check if user owns this icon
        if ($icon->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }
        
        // Delete file from storage
        \Storage::disk('public')->delete($icon->file_path);
        
        // Delete from database
        $icon->delete();
        
        return redirect()->route('dashboard.my-icons')->with('success', 'Icon deleted successfully!');
    })->name('dashboard.my-icons.destroy');
    
});

// Public icon download with SEO-friendly slug and download counter
Route::get('/icons/{icon:slug}/download', function (Icon $icon) {
    $icon->increment('downloads');

    $filePath = storage_path('app/public/' . $icon->file_path);

    if (!file_exists($filePath)) {
        abort(404, 'File not found');
    }

    // Use slug for download filename
    return response()->download($filePath, $icon->slug . '.' . $icon->file_type);
})->name('icons.download');

// Public icon detail page - SEO friendly
Route::get('/icons/{icon:slug}', function (Icon $icon) {
    if (!$icon->is_approved) {
        abort(404);
    }

    return Inertia::render('icon-detail', [
        'icon' => $icon->load('user'),
    ]);
})->name('icons.show');

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', function () {
        $stats = [
            'total_icons' => Icon::count(),
            'total_downloads' => Icon::sum('downloads'),
            'total_users' => \App\Models\User::count(),
            'total_categories' => \App\Models\Category::count(),
        ];
        
        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    })->name('dashboard');
    
    Route::get('/icons', function () {
        $icons = Icon::with('user')
            ->latest()
            ->paginate(20);
            
        return Inertia::render('admin/icons', [
            'icons' => $icons,
        ]);
    })->name('icons');
    
    // Approve icon
    Route::post('/icons/{icon}/approve', function (Icon $icon) {
        $icon->update(['is_approved' => true]);
        return back()->with('success', 'Icon approved successfully!');
    })->name('icons.approve');
    
    // Reject/Delete icon
    Route::delete('/icons/{icon}', function (Icon $icon) {
        \Storage::disk('public')->delete($icon->file_path);
        $icon->delete();
        return back()->with('success', 'Icon deleted successfully!');
    })->name('icons.destroy');
    
    // Manage users
    Route::get('/users', function () {
        $users = \App\Models\User::withCount('icons')
            ->latest()
            ->paginate(20);
            
        return Inertia::render('admin/users', [
            'users' => $users,
        ]);
    })->name('users');
    
    // Edit user
    Route::get('/users/{user}/edit', function (\App\Models\User $user) {
        return Inertia::render('admin/edit-user', [
            'user' => $user,
        ]);
    })->name('users.edit');
    
    // Update user
    Route::put('/users/{user}', function (\App\Models\User $user) {
        request()->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:user,admin',
        ]);
        
        $user->update([
            'name' => request('name'),
            'email' => request('email'),
            'role' => request('role'),
        ]);
        
        return redirect()->route('admin.users')->with('success', 'User updated successfully!');
    })->name('users.update');
    
    // Delete user
    Route::delete('/users/{user}', function (\App\Models\User $user) {
        // Don't allow deleting yourself
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'You cannot delete your own account.']);
        }
        
        // Delete user's icons first
        foreach ($user->icons as $icon) {
            \Storage::disk('public')->delete($icon->file_path);
            if ($icon->preview_path) {
                \Storage::disk('public')->delete($icon->preview_path);
            }
        }
        
        $user->delete();
        
        return back()->with('success', 'User deleted successfully!');
    })->name('users.destroy');
    
    // Manage categories
    Route::get('/categories', function () {
        $categories = \App\Models\Category::withCount('icons')
            ->orderBy('name')
            ->get();
            
        return Inertia::render('admin/categories', [
            'categories' => $categories,
        ]);
    })->name('categories');
    
    // Add category
    Route::post('/categories', function () {
        request()->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
        ]);
        
        \App\Models\Category::create([
            'name' => request('name'),
            'slug' => request('slug'),
        ]);
        
        return back()->with('success', 'Category added successfully!');
    })->name('categories.store');
    
    // Update category
    Route::put('/categories/{category}', function (\App\Models\Category $category) {
        request()->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $category->id,
        ]);
        
        $category->update([
            'name' => request('name'),
            'slug' => request('slug'),
        ]);
        
        return back()->with('success', 'Category updated successfully!');
    })->name('categories.update');
    
    // Delete category
    Route::delete('/categories/{category}', function (\App\Models\Category $category) {
        // Check if category has icons
        if ($category->icons()->count() > 0) {
            return back()->withErrors(['error' => 'Cannot delete category with icons. Please move or delete the icons first.']);
        }
        
        $category->delete();
        
        return back()->with('success', 'Category deleted successfully!');
    })->name('categories.destroy');
});

require __DIR__.'/settings.php';

<?php

namespace Tests\Feature;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_admin_login(): void
    {
        $this->get('/admin/login')->assertOk()->assertInertia(fn ($page) => $page->component('Admin/Auth/Login'));
    }

    public function test_admin_can_log_in_and_out(): void
    {
        $admin = Admin::factory()->create(['password' => 'correct-password']);

        $this->post('/admin/login', [
            'email' => $admin->email,
            'password' => 'correct-password',
        ])->assertRedirect('/admin/dashboard');

        $this->assertAuthenticatedAs($admin, 'admin');
        $this->post('/admin/logout')->assertRedirect('/admin/login');
        $this->assertGuest('admin');
    }

    public function test_customer_session_cannot_access_admin_backend(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/dashboard')
            ->assertRedirect('/admin/login');
    }

    public function test_admin_session_does_not_authenticate_customer_guard(): void
    {
        $admin = Admin::factory()->create();

        $this->actingAs($admin, 'admin')->get('/admin/dashboard')->assertOk();
        $this->assertGuest('web');
    }

    public function test_invalid_admin_credentials_are_rejected(): void
    {
        $admin = Admin::factory()->create();

        $this->from('/admin/login')->post('/admin/login', [
            'email' => $admin->email,
            'password' => 'wrong-password',
        ])->assertRedirect('/admin/login')->assertSessionHasErrors('email');
    }
}

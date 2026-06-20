<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCreationCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_be_created_with_artisan_command(): void
    {
        $this->artisan('admin:create', [
            '--name' => 'Content Admin',
            '--email' => 'admin@example.com',
        ])
            ->expectsQuestion('Password', 'very-secure-password')
            ->expectsQuestion('Confirm password', 'very-secure-password')
            ->assertSuccessful();

        $this->assertDatabaseHas('admins', [
            'name' => 'Content Admin',
            'email' => 'admin@example.com',
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    public $fillable = [
        'user_id',
        'text'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}

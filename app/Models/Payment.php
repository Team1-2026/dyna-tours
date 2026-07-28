<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'visitor_id',
        'order_id',
        'amount',
        'description',
        'status',
    ];

    public function visitor()
    {
        return $this->belongsTo(WebsiteChatVisitor::class, 'visitor_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    
}

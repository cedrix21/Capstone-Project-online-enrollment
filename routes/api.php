<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\EnrollmentController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/user-test', function (Request $request) {
    return response()->json($request->user());
});

Route::middleware('auth:sanctum')->post('/enroll', [EnrollmentController::class, 'store']);

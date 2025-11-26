<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class EnrollmentController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'firstName' => 'required|string',
            'lastName' => 'required|string',
            'email' => 'required|email|unique:students,email',
            'gradeLevel' => 'required|string',
        ]);

        $student = Student::create($request->all());

        return response()->json(['message' => 'Enrollment successful', 'student' => $student]);
    }
}

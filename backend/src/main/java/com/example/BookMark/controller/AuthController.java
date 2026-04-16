package com.example.BookMark.controller;

import com.example.BookMark.dto.AuthRequest;
import com.example.BookMark.dto.AuthResponse;
import com.example.BookMark.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody AuthRequest request){
        authService.register(request.getEmail(), request.getPassword());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody AuthRequest request){
        String token = authService.login(request.getEmail(), request.getPassword());
        return new AuthResponse(token);
    }
    
}

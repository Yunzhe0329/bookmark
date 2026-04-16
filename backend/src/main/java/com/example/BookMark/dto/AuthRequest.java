package com.example.BookMark.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthRequest {
    @NotBlank
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;
    
}

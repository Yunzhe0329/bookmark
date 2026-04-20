package com.example.BookMark.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class AuthRequest {
    @NotBlank
    @Email(message = "電子郵件格式不正確")
    private String email;

    @NotBlank

    @Size(min = 8, message = "密碼至少需要 8 個字元")
    private String password;
    
}

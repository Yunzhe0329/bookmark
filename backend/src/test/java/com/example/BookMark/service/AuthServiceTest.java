package com.example.BookMark.service;

import java.util.Optional;

// unit test packages
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import com.example.BookMark.repository.UserRepository;
import com.example.BookMark.security.JwtUtil;
import com.example.BookMark.entity.User;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.assertj.core.api.Assertions.assertThat;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @InjectMocks
    private AuthService authService;

    @Test
    void register_newEmail_saveUser(){
        // Arrange
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("hashed");

        // Act
        authService.register("new@test.com", "password");

        // Assert
        verify(userRepository).save(any(User.class));

    }
    @Test
    void register_duplicateEmail_ThrowConflict(){
        // Arrange
        when(userRepository.existsByEmail("dup@test.com")).thenReturn(true);
        // Act
        assertThatThrownBy(() -> authService.register("dup@test.com","password"))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Email is already in use");
        
        //Assert
        verify(userRepository, never()).save(any());
    }
    
    @Test
    void login_success(){
        // Arrange
        User user = new User();
        user.setEmail("user@test.com");
        user.setPassword("Hashed");
        when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "Hashed")).thenReturn(true);
        when(jwtUtil.generateToken("user@test.com")).thenReturn("jwt-token");
        // Act
        String token = authService.login("user@test.com", "password");
        // Assert
        assertThat(token).isEqualTo("jwt-token");
    }
    @Test
    void login_emailNotExist(){
        // Arrange
        when(userRepository.findByEmail("nobody@test.com")).thenReturn(Optional.empty());
        // Act
        assertThatThrownBy(() -> authService.login("nobody@test.com", "password"))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Invalid credentials");
        // Assert
        verify(userRepository, never()).save(any());
    }
    @Test
    void login_pswError(){
        User user = new User();
        user.setEmail("wrongpsw@test.com");
        user.setPassword("hashed");
        // Arrange
        when(userRepository.findByEmail("wrongpsw@test.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password", "hashed")).thenReturn(false); // Mock 已經預設matches()會回傳 false
        // Act
        assertThatThrownBy(() -> authService.login("wrongpsw@test.com", "password"))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("Invalid credentials");
        // Assert
        verify(jwtUtil, never()).generateToken(any());
    }
}

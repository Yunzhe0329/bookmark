package com.example.BookMark.service;

import com.example.BookMark.entity.User;
import com.example.BookMark.repository.UserRepository;
import com.example.BookMark.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void register(String email, String password){
        if(userRepository.existsByEmail(email)){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use");
        }
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
    public String login(String email, String password){
        User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new ResponseStatusException(
            HttpStatus.UNAUTHORIZED, "Invalid credentials"
        ));  

        if(!passwordEncoder.matches(password, user.getPassword())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        return jwtUtil.generateToken(email);
    }
}

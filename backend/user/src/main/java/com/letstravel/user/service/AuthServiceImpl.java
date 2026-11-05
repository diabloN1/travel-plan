package com.letstravel.user.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.letstravel.user.dto.AuthResult;
import com.letstravel.user.dto.LoginRequest;
import com.letstravel.user.dto.RegisterRequest;
import com.letstravel.user.dto.UserResponse;
import com.letstravel.user.entity.Role;
import com.letstravel.user.entity.User;
import com.letstravel.common.exception.ConflictException;
import com.letstravel.common.exception.UnauthorizedException;
import com.letstravel.user.repository.UserRepository;
import com.letstravel.user.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResult register(RegisterRequest request) {

        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new ConflictException("Email already exists");
        }

        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));

        user.setRole(Role.valueOf(request.role().name()));

        user = userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);

        return new AuthResult(
                accessToken,
                new UserResponse(user));
    }

    public AuthResult login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken = jwtService.generateAccessToken(user);

        return new AuthResult(
                accessToken,
                new UserResponse(user));
    }
}

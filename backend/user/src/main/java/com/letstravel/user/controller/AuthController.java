package com.letstravel.user.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.letstravel.user.dto.AuthResult;
import com.letstravel.user.dto.LoginRequest;
import com.letstravel.user.dto.RegisterRequest;
import com.letstravel.user.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PermitAll
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResult register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response) {

        return authService.register(request);
    }

    @PermitAll
    @PostMapping("/login")
    public AuthResult login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        return authService.login(request);
    }
}
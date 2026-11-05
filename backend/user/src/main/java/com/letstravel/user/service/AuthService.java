package com.letstravel.user.service;

import com.letstravel.user.dto.AuthResult;
import com.letstravel.user.dto.LoginRequest;
import com.letstravel.user.dto.RegisterRequest;

public interface AuthService {
    AuthResult register(RegisterRequest request);

    AuthResult login(LoginRequest request);
}
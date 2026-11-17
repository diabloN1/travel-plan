package com.letstravel.user.service;

import java.util.UUID;

import com.letstravel.user.dto.UserResponse;

public interface UserService {
    UserResponse me(UUID userId);
}
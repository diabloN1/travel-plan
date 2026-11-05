package com.letstravel.user.dto;

public record AuthResult(
        String accessToken,
        UserResponse user) {
}
package com.letstravel.user.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import com.letstravel.user.dto.UserResponse;
import com.letstravel.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UserResponse me(@AuthenticationPrincipal Jwt jwt) {

        UUID currentId = getCurrentId(jwt);
        System.out.println("cuurent user id" + currentId.toString());
        return userService.me(currentId);
    }

    private UUID getCurrentId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}

package com.letstravel.user.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.letstravel.common.exception.NotFoundException;
import com.letstravel.user.dto.UserResponse;
import com.letstravel.user.entity.User;
import com.letstravel.user.repository.UserRepository;
import com.letstravel.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    public UserResponse me(UUID userId) {
        return resolveUser(userId);
    }

    private UserResponse resolveUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("No user found with this id!"));
        return new UserResponse(user);
    }
}

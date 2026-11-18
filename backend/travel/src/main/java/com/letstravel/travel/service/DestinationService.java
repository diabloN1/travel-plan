package com.letstravel.travel.service;

import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface DestinationService {

    DestinationResponse create(DestinationRequest request, UUID managerId);

    DestinationResponse getById(UUID id, Jwt jwt);

    Page<DestinationResponse> getByManager(Jwt jwt, UUID managerId, Pageable pageable);

    DestinationResponse update(UUID id, DestinationRequest request, Jwt jwt);

    void delete(UUID id, Jwt jwt);
}
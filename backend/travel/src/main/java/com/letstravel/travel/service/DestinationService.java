package com.letstravel.travel.service;

import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface DestinationService {

    DestinationResponse create(DestinationRequest request, UUID managerId);

    DestinationResponse getById(UUID id, UUID managerId);

    Page<DestinationResponse> getByManager(UUID managerId, Pageable pageable);

    DestinationResponse update(UUID id, DestinationRequest request, UUID managerId);

    void delete(UUID id, UUID managerId);
}
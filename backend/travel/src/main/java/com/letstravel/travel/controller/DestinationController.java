package com.letstravel.travel.controller;

import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;
import com.letstravel.travel.service.DestinationService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;

import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/destinations")
@RequiredArgsConstructor
public class DestinationController {

    private final DestinationService destinationService;

    @PostMapping
    public ResponseEntity<DestinationResponse> create(
            @Valid @RequestBody DestinationRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID managerId = getCurrentId(jwt);

        DestinationResponse response = destinationService.create(request, managerId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DestinationResponse> getById(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID managerId = getCurrentId(jwt);

        return ResponseEntity.ok(
                destinationService.getById(id, managerId)
        );
    }

    @GetMapping("/me")
    public ResponseEntity<Page<DestinationResponse>> getMyDestinations(
            @AuthenticationPrincipal Jwt jwt,
            @PageableDefault(size = 10, sort = "name") Pageable pageable
    ) {
        UUID managerId = getCurrentId(jwt);

        return ResponseEntity.ok(
                destinationService.getByManager(managerId, pageable)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<DestinationResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody DestinationRequest request,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID managerId = getCurrentId(jwt);

        return ResponseEntity.ok(
                destinationService.update(id, request, managerId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID managerId = getCurrentId(jwt);

        destinationService.delete(id, managerId);

        return ResponseEntity.noContent().build();
    }

    private UUID getCurrentId(Jwt jwt) {
        return UUID.fromString(jwt.getSubject());
    }
}
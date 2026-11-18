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
import org.springframework.security.access.prepost.PreAuthorize;
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
        @PreAuthorize("hasRole('TRAVEL_MANAGER') or hasRole('ADMIN')")
        public ResponseEntity<DestinationResponse> create(
                        @Valid @RequestBody DestinationRequest request,
                        @AuthenticationPrincipal Jwt jwt) {
                UUID managerId = UUID.fromString(jwt.getSubject());

                DestinationResponse response = destinationService.create(request, managerId);

                return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }

        @GetMapping("/{id}")
        @PreAuthorize("hasRole('TRAVEL_MANAGER') or hasRole('ADMIN')")
        public ResponseEntity<DestinationResponse> getById(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal Jwt jwt) {
                return ResponseEntity.ok(
                                destinationService.getById(id, jwt));
        }

        @GetMapping("/me")
        @PreAuthorize("hasRole('TRAVEL_MANAGER') or hasRole('ADMIN')")
        public ResponseEntity<Page<DestinationResponse>> getMyDestinations(
                        @AuthenticationPrincipal Jwt jwt,
                        @PageableDefault(size = 10, sort = "name") Pageable pageable) {
                UUID managerId = UUID.fromString(jwt.getSubject());

                return ResponseEntity.ok(
                                destinationService.getByManager(jwt, managerId, pageable));
        }

        @PutMapping("/{id}")
        @PreAuthorize("hasRole('TRAVEL_MANAGER') or hasRole('ADMIN')")
        public ResponseEntity<DestinationResponse> update(
                        @PathVariable UUID id,
                        @Valid @RequestBody DestinationRequest request,
                        @AuthenticationPrincipal Jwt jwt) {
                return ResponseEntity.ok(
                                destinationService.update(id, request, jwt));
        }

        @DeleteMapping("/{id}")
        @PreAuthorize("hasRole('TRAVEL_MANAGER') or hasRole('ADMIN')")
        public ResponseEntity<Void> delete(
                        @PathVariable UUID id,
                        @AuthenticationPrincipal Jwt jwt) {
                destinationService.delete(id, jwt);

                return ResponseEntity.noContent().build();
        }
}
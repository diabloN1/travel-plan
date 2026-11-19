package com.letstravel.travel.service.impl;

import com.letstravel.common.exception.ForbiddenException;
import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;
import com.letstravel.travel.entity.Destination;
import com.letstravel.travel.mapper.DestinationMapper;
import com.letstravel.travel.repository.DestinationRepository;
import com.letstravel.travel.service.ActivityService;
import com.letstravel.travel.service.DestinationService;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;
    private final DestinationMapper destinationMapper;
    private final ActivityService activityService;

    @Override
    @Transactional
    public DestinationResponse create(DestinationRequest request, UUID managerId) {

        Destination destination = destinationMapper.toEntity(request);

        destination.setManagerId(managerId);

        activityService.createActivities(destination, request.activities());

        Destination saved = destinationRepository.save(destination);

        return destinationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DestinationResponse getById(UUID id, Jwt jwt) {

        Destination destination = findById(id, jwt);

        return destinationMapper.toResponse(destination);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DestinationResponse> getByManager(
            Jwt jwt,
            UUID managerId,
            Pageable pageable) {
        validateAccessToManagerData(jwt, managerId);

        return destinationRepository.findByManagerId(managerId, pageable)
                .map(destinationMapper::toResponse);
    }

    @Override
    public DestinationResponse update(
            UUID id,
            DestinationRequest request,
            Jwt jwt) {

        Destination destination = findById(id, jwt);

        destinationMapper.updateEntity(request, destination);

        activityService.syncActivities(destination, request.activities());

        return destinationMapper.toResponse(destinationRepository.save(destination));
    }

    @Override
    public void delete(UUID id, Jwt jwt) {

        Destination destination = findById(id, jwt);

        if (!destination.getTravels().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete a destination associated with existing travels");
        }

        destinationRepository.delete(destination);
    }

    private Destination findById(UUID id, Jwt jwt) {
        Destination destination = destinationRepository.findWithActivitiesById(id)
                .orElseThrow(() -> new EntityNotFoundException("Destination not found with ID: " + id));

        validateAccessToManagerData(jwt, destination.getManagerId());

        return destination;
    }

    private void validateAccessToManagerData(Jwt jwt, UUID managerId) {
        UUID currentId = UUID.fromString(jwt.getSubject());
        String role = jwt.getClaimAsString("role");

        if (!currentId.equals(managerId) && !"ADMIN".equals(role))
            throw new ForbiddenException("You do not have appropriate access for given action");
    }

}
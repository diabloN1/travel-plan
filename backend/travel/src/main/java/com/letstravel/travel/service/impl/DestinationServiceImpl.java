package com.letstravel.travel.service.impl;

import com.letstravel.travel.dto.request.DestinationRequest;
import com.letstravel.travel.dto.response.DestinationResponse;
import com.letstravel.travel.entity.Destination;
import com.letstravel.travel.mapper.DestinationMapper;
import com.letstravel.travel.repository.DestinationRepository;
import com.letstravel.travel.service.DestinationService;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DestinationServiceImpl implements DestinationService {

    private final DestinationRepository destinationRepository;
    private final DestinationMapper destinationMapper;

    @Override
    @Transactional
    public DestinationResponse create(DestinationRequest request, UUID managerId) {
        Destination destination = destinationMapper.toEntity(request);

        destination.setManagerId(managerId);

        Destination saved = destinationRepository.save(destination);
        return destinationMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DestinationResponse getById(UUID id, UUID managerId) {

        Destination destination = findByIdAndManagerId(id, managerId);

        return destinationMapper.toResponse(destination);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DestinationResponse> getByManager(
            UUID managerId,
            Pageable pageable) {
        return destinationRepository.findByManagerId(managerId, pageable)
                .map(destinationMapper::toResponse);
    }

    @Override
    public DestinationResponse update(
            UUID id,
            DestinationRequest request,
            UUID managerId) {
        Destination destination = findByIdAndManagerId(id, managerId);

        destinationMapper.updateEntity(request, destination);

        Destination updated = destinationRepository.save(destination);

        return destinationMapper.toResponse(updated);
    }

    @Override
    public void delete(UUID id, UUID managerId) {

        Destination destination = findByIdAndManagerId(id, managerId);

        if (!destination.getTravels().isEmpty()) {
            throw new IllegalStateException(
                    "Cannot delete a destination associated with existing travels");
        }

        destinationRepository.delete(destination);
    }

    private Destination findByIdAndManagerId(UUID id, UUID managerId) {

        return destinationRepository.findByIdAndManagerId(id, managerId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Destination not found with ID: " + id));
    }
}
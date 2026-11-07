package com.letstravel.travel.repository;

import com.letstravel.travel.entity.Destination;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface DestinationRepository extends JpaRepository<Destination, UUID> {

    @EntityGraph(attributePaths = "activities")
    Optional<Destination> findByIdAndManagerId(UUID id, UUID managerId);

    @EntityGraph(attributePaths = "activities")
    Page<Destination> findByManagerId(UUID managerId, Pageable pageable);
}
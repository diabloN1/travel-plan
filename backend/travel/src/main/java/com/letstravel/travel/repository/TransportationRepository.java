package com.letstravel.travel.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.letstravel.travel.entity.Transportation;

public interface TransportationRepository extends JpaRepository<Transportation, UUID> {
}
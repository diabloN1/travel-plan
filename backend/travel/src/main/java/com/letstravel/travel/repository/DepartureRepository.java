package com.letstravel.travel.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.letstravel.travel.entity.Departure;

public interface DepartureRepository extends JpaRepository<Departure, UUID> {
}
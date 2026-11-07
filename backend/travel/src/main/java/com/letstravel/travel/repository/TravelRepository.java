package com.letstravel.travel.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.letstravel.travel.entity.Travel;

public interface TravelRepository extends JpaRepository<Travel, UUID> {
}
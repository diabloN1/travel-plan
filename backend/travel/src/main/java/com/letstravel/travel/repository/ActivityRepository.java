package com.letstravel.travel.repository;

import com.letstravel.travel.entity.Activity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    List<Activity> findAllByDestination_Id(UUID destinationId);
}
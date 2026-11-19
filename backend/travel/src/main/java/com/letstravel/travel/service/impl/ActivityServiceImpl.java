package com.letstravel.travel.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.letstravel.common.exception.BadRequestException;
import com.letstravel.common.exception.NotFoundException;
import com.letstravel.travel.dto.request.ActivityRequest;
import com.letstravel.travel.entity.Activity;
import com.letstravel.travel.entity.Destination;
import com.letstravel.travel.mapper.ActivityMapper;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ActivityServiceImpl {

    private final ActivityMapper activityMapper;

    public void createActivities(
            Destination destination,
            List<ActivityRequest> requests) {
        if (requests == null) {
            return;
        }

        if (requests.size() > 20) {
            throw new BadRequestException("Activities can't go beyond 20 per destination");
        }

        List<Activity> activities = activityMapper.toEntities(requests);

        activities.forEach(activity -> {
            activity.setDestination(destination);
            destination.getActivities().add(activity);
        });
    }

    public void syncActivities(
            Destination destination,
            List<ActivityRequest> requests) {
        if (requests == null) {
            return;
        }

        if (requests.size() > 20) {
            throw new BadRequestException("Activities can't go beyond 20 per destination");
        }

        List<Activity> existingActivities = destination.getActivities();

        // Remove activities that are no longer present
        existingActivities.removeIf(existing -> requests.stream()
                .noneMatch(request -> existing.getId().equals(request.id())));

        for (ActivityRequest request : requests) {

            if (request.id() == null) {
                // Create new activity
                Activity activity = activityMapper.toEntity(request);
                activity.setDestination(destination);

                existingActivities.add(activity);

            } else {
                // Update existing activity
                Activity activity = existingActivities.stream()
                        .filter(existing -> existing.getId().equals(request.id()))
                        .findFirst()
                        .orElseThrow(() -> new NotFoundException(
                                "Activity not found: " + request.id()));

                activityMapper.updateEntity(request, activity);
            }
        }
    }
}

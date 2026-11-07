package com.letstravel.travel.dto.response;

import com.letstravel.travel.entity.Destination.DestinationType;

import java.util.List;
import java.util.UUID;

public record DestinationResponse(
                UUID id,
                String name,
                String country,
                String city,
                String description,
                Double latitude,
                Double longitude,
                DestinationType type,
                List<ActivitySummaryResponse> activities) {
}
package com.letstravel.travel.dto.request;

import com.letstravel.travel.entity.Destination.DestinationType;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DestinationRequest(

        @NotBlank
        @Size(max = 255)
        String name,

        @Size(max = 100)
        String country,

        @Size(max = 100)
        String city,

        String description,

        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        Double latitude,

        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        Double longitude,

        @NotNull
        DestinationType type
) {}
package com.letstravel.travel.dto.request;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActivityRequest(
                UUID id,
                @NotBlank @Size(max = 100) String title,
                @Size(max = 1000) String description) {
}

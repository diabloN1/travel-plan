package com.letstravel.travel.dto.response;

import java.util.UUID;

public record ActivitySummaryResponse(
                UUID id,
                String title,
                String description) {
}
package com.letstravel.travel.mapper;

import com.letstravel.travel.dto.response.ActivitySummaryResponse;
import com.letstravel.travel.entity.Activity;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ActivityMapper {

    ActivitySummaryResponse toResponse(Activity activity);
}
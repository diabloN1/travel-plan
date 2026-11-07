package com.letstravel.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "transportations")
@Getter
@Setter
@NoArgsConstructor
public class Transportation {

    public enum TransportationType {
        BUS,
        TRAIN,
        PLANE,
        BOAT,
        CAR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private TransportationType type;

    private LocalDateTime departureTime;

    private LocalDateTime arrivalTime;

    private Double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "travel_id", nullable = false)
    private Travel travel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_destination_id", nullable = false)
    private Destination fromDestination;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_destination_id", nullable = false)
    private Destination toDestination;
}
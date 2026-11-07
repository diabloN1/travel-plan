package com.letstravel.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "travels")
@Getter
@Setter
@NoArgsConstructor
public class Travel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID managerId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer durationDays;

    private Integer maxSeats;

    private String status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Departure> departures = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "travel_destinations", joinColumns = @JoinColumn(name = "travel_id"), inverseJoinColumns = @JoinColumn(name = "destination_id"))
    private List<Destination> destinations = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
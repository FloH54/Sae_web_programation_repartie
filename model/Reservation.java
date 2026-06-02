package com.projet.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
public class Reservation {
*
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reservation")
    private Integer idReservation;

    // Relation Plusieurs-à-Un : Plusieurs réservations pour un seul restaurant
    @ManyToOne(fetch = FetchType.LAZY) // Lazy = Ne charge le restaurant que si on l'appelle
    @JoinColumn(name = "id_restaurant", nullable = false) // Crée la clé étrangère
    private Restaurant restaurant;

    @Column(name = "nb_personne", nullable = false)
    private Integer nbPersonne;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;
    
    // Constructeur sans argument obligatoire pour Hibernate
    public Reservation() {}

    public Reservation(Restaurant restaurant, Integer nbPersonne, LocalDateTime date) {
        this.restaurant = restaurant;
        this.nbPersonne = nbPersonne;
        this.date = date;
    }

    // Getters / Setters

    public Integer getIdReservation() { return idReservation; }
    public void setIdReservation(Integer idReservation) { this.idReservation = idReservation; }

    public Restaurant getRestaurant() { return restaurant; }
    public void setRestaurant(Restaurant restaurant) { this.restaurant = restaurant; }

    public Integer getNbPersonne() { return nbPersonne; }
    public void setNbPersonne(Integer nbPersonne) { this.nbPersonne = nbPersonne; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    @Override
    public String toString() {
        return "Reservation{id=" + idReservation
                + ", restaurant=" + (restaurant != null ? restaurant.getNom() : "null")
                + ", nbPersonne=" + nbPersonne
                + ", date=" + date + "}";
    }
}
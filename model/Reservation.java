package com.projet.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation")
public class Reservation {
*
    private Integer idReservation;
    // Clé étrangère vers restaurant — on charge le restaurant complet dans le JSON
    private Restaurant restaurant;
    private Integer nbPersonne;
    private LocalDateTime date;
    
    // Constructeurs

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
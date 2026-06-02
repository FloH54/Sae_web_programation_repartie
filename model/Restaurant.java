package com.projet.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "restaurant")
public class Restaurant {

    private Integer idRestaurant;
    private String nom;
    private String coordonneeGps; // Format : "48.8566, 2.3522"
    private String adresse;

    // Relation inverse : un restaurant a plusieurs réservations
    // @JsonIgnore évite la boucle infinie lors de la sérialisation JSON
    private List<Reservation> reservations;


    // Constructeurs
    public Restaurant(String nom, String coordonneeGps, String adresse) {
        this.nom = nom;
        this.coordonneeGps = coordonneeGps;
        this.adresse = adresse;
    }

    // Getters / Setters

    public Integer getIdRestaurant() { return idRestaurant; }
    public void setIdRestaurant(Integer idRestaurant) { this.idRestaurant = idRestaurant; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getCoordonneeGps() { return coordonneeGps; }
    public void setCoordonneeGps(String coordonneeGps) { this.coordonneeGps = coordonneeGps; }

    public String getAdresse() { return adresse; }
    public void setAdresse(String adresse) { this.adresse = adresse; }

    public List<Reservation> getReservations() { return reservations; }
    public void setReservations(List<Reservation> reservations) { this.reservations = reservations; }

    @Override
    public String toString() {
        return "Restaurant{id=" + idRestaurant + ", nom='" + nom + "', adresse='" + adresse + "'}";
    }
}
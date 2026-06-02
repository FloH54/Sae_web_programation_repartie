package com.projet.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "restaurant")
public class Restaurant {

    @Id // Clé primaire
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTO_INCREMENT
    @Column(name = "id_restaurant") // Le nom de la colonne en base de données
    private Integer idRestaurant;

    @Column(name = "nom", nullable = false, length = 150)
    private String nom;

    @Column(name = "coordonnee_gps", length = 100)
    private String coordonneeGps; 

    @Column(name = "adresse", nullable = false)
    private String adresse;

    // Relation Un-à-Plusieurs : Un restaurant a plusieurs réservations
    // CascadeType.ALL : si on supprime un restaurant, on supprime ses réservations
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore // Évite la boucle infinie lors de la génération du JSON
    private List<Reservation> reservations;

    // Constructeur sans argument obligatoire pour Hibernate
    public Restaurant() {}

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
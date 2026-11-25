package com.example.BanckingAppBackend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fname;
    private String mname;
    private  String lname;

    @Column(unique = true)
    private String email;

    private String password;
    private String gender;
    private Long contactNo;

    @Column(unique = true)
    private String accountNumber;

    private BigDecimal balance=BigDecimal.valueOf(0.0);
    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, APPROVED, REJECTED

    private String role="USER";

    @Transient
    public String getFullName() {
        return String.format("%s %s %s",
                fname != null ? fname : "",
                mname != null ? mname : "",
                lname != null ? lname : "").trim();
    }

}

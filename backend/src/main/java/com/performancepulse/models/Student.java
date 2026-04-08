package com.performancepulse.models;

import javax.persistence.*;
import lombok.*;

import java.util.Map;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String studentId;

    private String name;
    private String department;
    private Integer yearOfStudy; // Can't use "year" as it's a SQL reserved keyword
    private Double attendance;
    private Integer overall;
    private String grade;
    private String risk;
    
    @Column(length = 1000)
    private String notes;

    @ElementCollection
    @CollectionTable(name = "student_scores", joinColumns = @JoinColumn(name = "student_id"))
    @MapKeyColumn(name = "subject")
    @Column(name = "score")
    private Map<String, Integer> scores;
}

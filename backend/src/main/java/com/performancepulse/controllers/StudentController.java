package com.performancepulse.controllers;

import com.performancepulse.models.Student;
import com.performancepulse.repositories.StudentRepository;
import com.performancepulse.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final com.performancepulse.repositories.CourseRepository courseRepository;

    @GetMapping
    public List<Student> getAllStudents(Authentication authentication) {
        if (authentication != null && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return studentRepository.findAll();
        } else if (authentication != null) {
            String userName = ((UserDetailsImpl) authentication.getPrincipal()).getName();
            return studentRepository.findByNameContainingIgnoreCase(userName);
        }
        return studentRepository.findAll();
    }

    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Optional<Student> studentOptional = studentRepository.findById(id);

        if (studentOptional.isPresent()) {
            Student student = studentOptional.get();
            student.setStudentId(studentDetails.getStudentId());
            student.setName(studentDetails.getName());
            student.setDepartment(studentDetails.getDepartment());
            student.setYearOfStudy(studentDetails.getYearOfStudy());
            student.setAttendance(studentDetails.getAttendance());
            student.setScores(studentDetails.getScores());
            student.setOverall(studentDetails.getOverall());
            student.setGrade(studentDetails.getGrade());
            student.setRisk(studentDetails.getRisk());
            student.setNotes(studentDetails.getNotes());
            return ResponseEntity.ok(studentRepository.save(student));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedDatabase() {
        // Clear existing
        studentRepository.deleteAll();
        courseRepository.deleteAll();

        // 1. Seed Courses
        com.performancepulse.models.Course c1 = com.performancepulse.models.Course.builder().name("Operating System (OS)").code("CS301").credits(4).build();
        com.performancepulse.models.Course c2 = com.performancepulse.models.Course.builder().name("Full Stack Development (FSAD)").code("CS302").credits(4).build();
        com.performancepulse.models.Course c3 = com.performancepulse.models.Course.builder().name("System Programming for Hardware Acceleration (SPHA)").code("CS303").credits(3).build();
        com.performancepulse.models.Course c4 = com.performancepulse.models.Course.builder().name("UX Design").code("DS301").credits(3).build();
        com.performancepulse.models.Course c5 = com.performancepulse.models.Course.builder().name("Probability & Statistics (P&S)").code("MA301").credits(3).build();
        
        courseRepository.saveAll(java.util.Arrays.asList(c1, c2, c3, c4, c5));

        // 2. Seed 5 Students
        Student s1 = Student.builder()
                .studentId("STU-001")
                .name("Aarav Sharma")
                .department("CSE")
                .yearOfStudy(3)
                .attendance(88.5)
                .overall(85)
                .grade("A")
                .risk("Low")
                .notes("Excellent in practical lab sessions.")
                .scores(new java.util.HashMap<String, Integer>() {{ 
                    put("Operating System (OS)", 85); 
                    put("Full Stack Development (FSAD)", 90); 
                    put("System Programming for Hardware Acceleration (SPHA)", 82); 
                    put("UX Design", 78); 
                    put("Probability & Statistics (P&S)", 88); 
                }})
                .build();
        
        Student s2 = Student.builder()
                .studentId("STU-002")
                .name("Ananya Verma")
                .department("ECE")
                .yearOfStudy(3)
                .attendance(62.0)
                .overall(55)
                .grade("D")
                .risk("High")
                .notes("Needs support in core subjects, frequent absenteeism.")
                .scores(new java.util.HashMap<String, Integer>() {{ 
                    put("Operating System (OS)", 50); 
                    put("Full Stack Development (FSAD)", 60); 
                    put("System Programming for Hardware Acceleration (SPHA)", 45); 
                    put("UX Design", 70); 
                    put("Probability & Statistics (P&S)", 52); 
                }})
                .build();

        Student s3 = Student.builder()
                .studentId("STU-003")
                .name("Rohan Mehta")
                .department("CSE")
                .yearOfStudy(3)
                .attendance(95.0)
                .overall(92)
                .grade("A+")
                .risk("Low")
                .notes("Top performer. Strong grasp of full stack concepts.")
                .scores(new java.util.HashMap<String, Integer>() {{ 
                    put("Operating System (OS)", 92); 
                    put("Full Stack Development (FSAD)", 95); 
                    put("System Programming for Hardware Acceleration (SPHA)", 90); 
                    put("UX Design", 85); 
                    put("Probability & Statistics (P&S)", 98); 
                }})
                .build();

        Student s4 = Student.builder()
                .studentId("STU-004")
                .name("Priya Patel")
                .department("CSE")
                .yearOfStudy(3)
                .attendance(75.5)
                .overall(70)
                .grade("B")
                .risk("Medium")
                .notes("Struggling slightly with Systems Programming but good otherwise.")
                .scores(new java.util.HashMap<String, Integer>() {{ 
                    put("Operating System (OS)", 65); 
                    put("Full Stack Development (FSAD)", 78); 
                    put("System Programming for Hardware Acceleration (SPHA)", 55); 
                    put("UX Design", 82); 
                    put("Probability & Statistics (P&S)", 70); 
                }})
                .build();

        Student s5 = Student.builder()
                .studentId("STU-005")
                .name("Vikram Singh")
                .department("ECE")
                .yearOfStudy(3)
                .attendance(81.0)
                .overall(77)
                .grade("B+")
                .risk("Low")
                .notes("Consistent performer. Good team player in FSAD.")
                .scores(new java.util.HashMap<String, Integer>() {{ 
                    put("Operating System (OS)", 75); 
                    put("Full Stack Development (FSAD)", 82); 
                    put("System Programming for Hardware Acceleration (SPHA)", 70); 
                    put("UX Design", 75); 
                    put("Probability & Statistics (P&S)", 84); 
                }})
                .build();

        studentRepository.saveAll(java.util.Arrays.asList(s1, s2, s3, s4, s5));
        return ResponseEntity.ok("Database seeded successfully with 5 courses and 5 students.");
    }
}

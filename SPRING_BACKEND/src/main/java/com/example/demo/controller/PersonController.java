package com.example.demo.controller;

import com.example.demo.model.Person;
import com.example.demo.repository.PersonRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonRepository repository;

    public PersonController(PersonRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Person>> getAll() {
        try {
            List<Person> persons = repository.findAll();
            return ResponseEntity.ok(persons);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Person> getOne(@PathVariable Long id) {
        try {
            return repository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody Person person) {
        try {
            // Walidacja wieku
            if (person.getAge() != null && person.getAge() > 110) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Wiek nie może przekraczać 110 lat");
            }

            // Walidacja wymaganych pól
            if ((person.getFirstName() == null || person.getFirstName().trim().isEmpty()) &&
                    (person.getFamilyName() == null || person.getFamilyName().trim().isEmpty())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Wymagane jest podanie imienia lub nazwiska");
            }

            Person savedPerson = repository.save(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPerson);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Wystąpił wewnętrzny błąd serwera");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        try {
            if (!repository.existsById(id)) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Nie znaleziono osoby o podanym ID");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            repository.deleteById(id);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Osoba została pomyślnie usunięta");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Wystąpił wewnętrzny błąd serwera");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
package model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Verification {

    private boolean status = false;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private String planType;
}

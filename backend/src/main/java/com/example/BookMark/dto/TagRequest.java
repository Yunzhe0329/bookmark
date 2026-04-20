package com.example.BookMark.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TagRequest {
    @NotBlank(message = "標籤名稱為必填")
    private String name;
}

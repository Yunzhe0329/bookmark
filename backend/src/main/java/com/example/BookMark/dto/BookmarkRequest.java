package com.example.BookMark.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

// 前端送進來的資料格式
@Getter @Setter
public class BookmarkRequest {
    @NotBlank(message = "Url is required")
    private String url;
    private String title;
    private String description;
}

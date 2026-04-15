package com.example.BookMark.dto;

import com.example.BookMark.entity.Bookmark;
import lombok.Getter;

import java.util.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

// 後端回傳給前端的資料格式
@Getter
public class BookmarkResponse {
    private final Long id;
    private final String url;
    private final String title;
    private final String description;
    private final java.time.LocalDateTime createdAt;
    private final Set<String> tags;

    public BookmarkResponse(Bookmark bookmark){
        this.id = bookmark.getId();
        this.url = bookmark.getUrl();
        this.title = bookmark.getTitle();
        this.description = bookmark.getDescription();
        this.createdAt = bookmark.getCreateAt();
        this.tag = bookmark.getTag().stream().map(tag -> tag.getName()).collect(Collectors.toSet());
    }
}

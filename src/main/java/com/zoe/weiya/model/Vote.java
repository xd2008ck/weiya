package com.zoe.weiya.model;

import org.hibernate.validator.constraints.NotBlank;

/**
 * Created by chenghui on 2016/12/29.
 */
public class Vote {
    @NotBlank
    private String id;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}

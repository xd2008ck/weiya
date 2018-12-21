package com.zoe.weiya.controller;

import com.zoe.weiya.comm.constant.CommonConstant;
import com.zoe.weiya.comm.response.ZoeObject;
import me.chanjar.weixin.common.error.WxErrorException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

/**
 * Created by andy on 2016/12/16.
 */
@RequestMapping("/test")
@RestController
public class InnerController {

    private static final Logger logger = LoggerFactory.getLogger(InnerController.class);

    @RequestMapping(value = "/test",produces = "text/plain;charset=utf-8")
    @ResponseBody
    public String authGet(String xml) {
        logger.info(xml);
        logger.info("hello");
        return "hello";

    }
}

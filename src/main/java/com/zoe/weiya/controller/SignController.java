package com.zoe.weiya.controller;

import com.zoe.weiya.comm.constant.CommonConstant;
import com.zoe.weiya.comm.constant.ZoeErrorCode;
import com.zoe.weiya.comm.logger.ZoeLogger;
import com.zoe.weiya.comm.logger.ZoeLoggerFactory;
import com.zoe.weiya.comm.response.ZoeObject;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.impl.WxMpServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by andy on 2016/12/18.
 */
@RequestMapping("sign")
@RestController
public class SignController {
    private static final ZoeLogger log = ZoeLoggerFactory.getLogger(SignController.class);

    @Autowired
    protected WxMpServiceImpl wxMpService;

    /**
     * 构建js-sdk所需配置
     * @param url
     * @return
     */
    @RequestMapping(value = "url", method = RequestMethod.GET)
    public Object getSign(@RequestParam String url) {
        try {
            return ZoeObject.success(wxMpService.createJsapiSignature(url));
        } catch (WxErrorException e) {
            log.error(CommonConstant.ERROR + e.toString());
            return ZoeObject.failure(ZoeErrorCode.ERROR_WECHAT);
        }
    }

    /**
     * 根据openId获取用户信息
     * @param id
     * @return
     */
    @RequestMapping(value = "getUserInfo", method = RequestMethod.GET)
    public Object getUserInfo(@RequestParam String id) {
        try {
            return ZoeObject.success(wxMpService.getUserService().userInfo(id));
        } catch (WxErrorException e) {
            log.error("error", e);
            return ZoeObject.failure(ZoeErrorCode.ERROR_OPENID);
        }
    }
}

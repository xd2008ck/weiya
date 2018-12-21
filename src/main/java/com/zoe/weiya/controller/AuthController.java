package com.zoe.weiya.controller;

import com.zoe.weiya.comm.constant.CommonConstant;
import com.zoe.weiya.comm.logger.ZoeLogger;
import com.zoe.weiya.comm.logger.ZoeLoggerFactory;
import com.zoe.weiya.comm.response.ZoeObject;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.mp.api.impl.WxMpServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by andy on 2016/12/16.
 */
@RequestMapping("/auth")
@RestController
public class AuthController {
    private static final ZoeLogger log = ZoeLoggerFactory.getLogger(AuthController.class);
    @Autowired
    protected WxMpServiceImpl wxMpService;

    /**
     * 获取授权登陆的URL
     * @param url
     * @param state
     * @return
     */
    @RequestMapping(value="url",method = RequestMethod.GET)
    public Object getAuthUrl(String url,String state){
        return ZoeObject.success(wxMpService.oauth2buildAuthorizationUrl(url, CommonConstant.AUTH_USERINFO,state));
    }

    /**
     * 根据code获取access_token
     * @param code
     * @return
     */
    @RequestMapping("access_token")
    public Object getAccessToken(@RequestParam(value = "code") String code){
        try {
            return ZoeObject.success(wxMpService.oauth2getAccessToken(code));
        } catch (WxErrorException e) {
            log.error("error",e);
            return ZoeObject.failure(e.toString());
        }
    }

    /**
     * 根据code获取用户信息
     * @param code
     * @param lang
     * @return
     */
    @RequestMapping("user_info")
    public Object getUserInfo(@RequestParam(value = "code") String code, String lang){
        try {
            return ZoeObject.success(wxMpService.oauth2getUserInfo(wxMpService.oauth2getAccessToken(code),lang));
        } catch (WxErrorException e) {
            log.error("error",e);
            return ZoeObject.failure(e.toString());
        }
    }

    /**
     * 刷新access_token
     * @param refreshToken
     * @return
     */
    @RequestMapping("refresh_token")
    public Object refreshToken(@RequestParam(value = "refreshToken") String refreshToken){
        try {
            return wxMpService.oauth2refreshAccessToken(refreshToken);
        } catch (WxErrorException e) {
            log.error("error",e);
            return ZoeObject.failure(e.toString());
        }
    }


    @RequestMapping(value = "wx",produces = "text/plain;charset=utf-8")
    @ResponseBody
    public String authGet(@RequestParam(name = "signature", required = false) String signature,
                          @RequestParam(name = "timestamp", required = false) String timestamp,
                          @RequestParam(name = "nonce", required = false) String nonce,
                          @RequestParam(name = "echostr", required = false) String echostr) {
        return echostr;

    }


}

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Created by Administrator on 2017/1/15.
 */
(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

})(jQuery);
var cookie = require('./mod/cookie')
$(function () {
    var flag=false;
    //网页头部城市选择交互
    var headerClick=(function () {
        $('body').on('click',function(e){
            $('#city_chose').hide();
            flag=false
        })
        $('#city_chose').on('click',function(e){
            e.stopPropagation()
        })
      $("#cityProp").hover(function (e) {
        e.stopPropagation()
        $('#city_chose').show();
        carBrandChose();
        $('#city_chose').css({
            top: $(this).offset().top + 18,
            left: $(this).offset().left - 300
        });
        $("#city_chose").hover(
           function () {
               $('#city_chose').show();
           },
           function () {
               $(this).hide();
        });
        $("#city_position_qie").click(function () {
            $('#city_chose').css({
                top: $(this).offset().top + 35,
                left: $(this).offset().left - 300
            });
        })
        return false;
      }, function () {
        $('#city_chose').hide();
      });
        //点击城市切换按钮，显示城市选择模块，同时让字体颜色改变
        $('.header_nav').on('click',function (e) {
            e=e||window.event;
            var tar=e.target||e .srcElement;
            if(tar.id=='city_position'||tar.id=='city_position_qie'||tar.id=='city_position_triangle'){
                e.stopPropagation()
                if(!flag){
                    $('#city_chose').show();
                    carBranChose();
                    flag=true;
                }else{
                    $('#city_chose').hide();
                    flag=false
                }
            }else{
                flag=false;
                return
            }
        });
        function mouseWheel(obj,upfun,downfun){
            if(obj.addEventListener){
                obj.addEventListener("mousewheel",fn);
                obj.addEventListener("DOMMouseScroll",fn)
            }else{
                obj.attachEvent("onmousewheel",fn);
            }
            function fn(e){
                var ev=e||window.event;
                //鼠标滚轮滚动的方向
                //火狐 ev.detail  向上-3  向下3
                //IE chrome      ev.wheelDelta  向上120 向下-120
                var val=ev.detail||ev.wheelDelta;
                if(val==-3||val==120){
                    upfun();
                }else if(val==3||val==-120){
                    downfun();
                }
                if(ev.preventDefault){
                    ev.preventDefault();
                }else{
                    ev.returnValue=false;
                }
            }
        }

        function carBrandChose() {
            var out=document.querySelector(".city_scroll")
            var inner=document.querySelector("#city_chose_region")
            var scrollbtn=document.querySelector(".scrollbtn")
            var scrollbar=document.querySelector(".scrollbar");
            var innerH=inner.offsetHeight;
            var outH=$(out).height();
            var scrollbarH=scrollbar.offsetHeight;
            var bili=innerH/outH;
            var tops=0;
            var topsC=0;
            var speed=20;
            var scrollbtnH=scrollbarH/bili;
            scrollbtn.style.height=scrollbtnH+"px";
            var lenH=scrollbarH-scrollbtnH;
            if(bili<1){
                scrollbar.style.display="none";
            }else{
                scrollbtn.onclick=function (e) {
                    var ev=e||window.event;
                    if(scrollbtn.stopPropagation){
                        ev.stopPropagation();
                    }else{
                        return  ev.cancelBubble=true;
                    }
                }
                scrollbtn.onmousedown = function (e) {
                    var ev=e||window.event;
                    var lenY=ev.clientY-this.offsetTop;
                    if(ev.preventDefault){
                        ev.preventDefault()
                    }else{
                        ev.returnValue=false;
                    }
                    document.onmousemove = function (e) {
                        var ev = e || window.event;
                        tops = ev.clientY - lenY;
                        if(tops<0){
                            tops=0;
                        }
                        if(tops>lenH){
                            tops=lenH;
                        }
                        scrollbtn.style.top = tops + "px";
                        var innerT=tops*bili;
                        inner.style.marginTop=-innerT+"px";
                    };
                    document.onmouseup = function () {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                };
                mouseWheel(out,function(){
                    tops-=speed;
                    setTop()
                },function(){
                    tops+=speed;
                    setTop()
                });
                scrollbar.onclick=function (e) {
                    var ev=e||window.event;
                    tops=ev.offsetY;
                    setTop()
                };

                $('.hot_city_num a').on('click',function () {
                    var curN=$(this).text().toString();
                    var regN=/curN/i;
                    var  allNum=$('#city_chose_region dl dt .province_tx').text().toString();
                    allNum.replace(regN,function () {
                    })
                });
                $('.hot_city_num a').on('click',function (e) {
                    e=e||window.event;
                    var tar=e.target||e.srcElement;
                    e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
                    e.preventDefault();
                    var myTop=0;
                    var selectL=$(this).text();
                    var weNeed;
                    var allProvinceL=$('#city_chose_region dl dt .province_tx');
                    for(var i=0;i<allProvinceL.length;i++){
                        if($(allProvinceL[i]).text()==selectL){
                            weNeed=allProvinceL[i]
                            break;
                        }else{
                            myTop+=$(allProvinceL[i]).parents('dl').height()+9
                        }
                    }
                    topsC=myTop;
                    if(topsC>=innerH-378){
                        topsC=innerH-378;
                    }
                    setTopC();

                });
                function setTopC(){
                    if(topsC<0){
                        topsC=0;
                    }
                    scrollbtn.style.top=topsC/bili+"px";
                    inner.style.marginTop=-topsC+"px";
                }


                document.onkeydown=function (e) {
                    var ev=e||event;
                    if(ev.keyCode==38){
                        tops-=speed;
                        setTop()
                    }else if(ev.keyCode==40){
                        tops+=speed;
                        setTop()
                    }
                }
                function setTop(){
                    if(tops<0){
                        tops=0;
                    }
                    if(tops>=lenH){
                        tops=lenH;
                    }
                    scrollbtn.style.top=tops+"px";
                    inner.style.marginTop=-tops*bili+"px";
                }
            }

        }


        $('.header_hover').on('mouseover',function(e){
            e=e||window.event;
            var tar=e.target||e.srcElement;

            // $(this).find('a').css('color',"#fff");
            $('.login_third_container').find('a').css('color','#333')
            $('.user_drop').find('a').css('color','#333');
            $(this).find('.triangle1').css('border-top-color','#fff')
            $(this).find('.triangle').css('border-top-color','#fff')
        })
        $('.header_hover').on('mouseout',function(e){
            e=e||window.event;
            var tar=e.target||e.srcElement;
            if(tar.id!='login_id'){
                // $(tar).find('a').css('color',"#999")
                $('.user_drop').find('a').css('color','#333');
                $(tar).find('.triangle1').css('border-top-color','#999');
                $(tar).find('.triangle').css('border-top-color','#999');
            }
        })
        // $('.message_drop').find('a').on('mouseover',function(event){
        //     event.stopPropagation();
        //     $(this).css('color','#398be4').find("span").css('color','#398be4');
        // })
        $('.user_drop').find('a').on('mouseover',function(event){
            $(this).parents('.user_drop').prev().prev().find('a').css('color','#fff')
            event.stopPropagation();
            $(this).css('color','#398be4');

        })
        $('#login_third').on('mouseover',function(){
            $(this).find('a').css('color',"#fff");
            $(this).find('.triangle1').css('border-top-color',"#fff");
            $('.login_third_container').find('a').css('color','#333');

            $('.login_third_container').show();
        })
        $('#login_third').on('mouseout',function(){
            $(this).find('a').css('color',"#999");
            $(this).find('.triangle1').css('border-top-color',"#999");
            $('.login_third_container').find('a').css('color','#333');
            $('.login_third_container').hide();
        })
    })();


    //hover城市选择按钮，字体和三角符号变色；
    var cityHover=(function () {
        $('#city_position').on('mouseover',function (e) {
            $('.changeAdd').css({'color':'#fff'})
            $('#city_position .triangle').css({'border-top-color':'#fff'})
        });
        $('#city_position').on('mouseout',function (e) {
            $('.changeAdd').css({'color':'#999'})
            $('#city_position .triangle').css({'border-top-color':'#999'})
        });
        $('#city_position').on('mousedown',function () {
            $('.changeAdd').css({'color':'#398be4'})
            $(' #city_position .triangle').css({'border-top-color':'#398be4'});
        });
        $('#city_position').on('mouseup',function () {
            $('.changeAdd').css({'color':'#fff'})
            $(' #city_position .triangle').css({'border-top-color':'#fff'});
        });
        $('.hot_city_num a').click(function (e) {
            e.stopPropagation();
            $(this).addClass("a_active").siblings("a").removeClass("a_active");
        });

        //城市 名称的hover&&press效果
        $('.city_chose_region dd a').mouseover(function (e) {
            e=e||window.event;
            $(this).css({'background':'#398be4','color':'#fff'})
        });
        $('.city_chose_region dd a').mouseout(function (e) {
            $(this).css({'background':'#fff','color':'#333'})
        });
        $('.city_chose_region dd a').mousedown(function (e) {
            $(this).css({'background':'#1064c1','color':'#fff'})
        });
        $('.city_chose_region dd a').mouseup(function (e) {
            $(this).css({'background':'#398be4','color':'#fff'})
        });

        //点击关闭按钮，城市选择模块隐藏
        $('.delete_city').on('click',function () {
            $('#city_chose').hide();
            flag = false
        });

        //城市输入框获取焦点显示搜索内容框，失去焦点隐藏
        $('.input').on('focus',function (e) {
           // $('#input_letters_search').css({"display":"block"});
            if($('#input_letters').val()=='请输入城市'){
                $('#input_letters').val('');
            }
        });
        $('#input_letters').on('blur',function (e) {
            if($('#input_letters').val()==''){
                $('#input_letters').val('请输入城市');
                $('#input_letters_search').css({"display":"none"})
            }
        });
        //头部跳转二级页面nav
        $("#total_nav_content li").mouseover(function(e){
            $(this).addClass("bg").siblings().removeClass("bg");

        });
        $("#total_nav_content li").mousedown(function(e){

            $(this).addClass("active").removeClass('bg')

        });
        $("#total_nav_content li").mouseup(function(e){
            $(this).addClass('bg').removeClass("active")
        });

    })();
    //城市模块hover显示，离开隐藏
    var cityChange=(function () {
        $('#city_chose_region dd a').on('click',function () {
            $('.header_nav_left .default_address a').text(decodeURI($(this).text()));
            setCookies("xyautoarea",this);
            var serial_val = $("#serialId").attr("value");
            var caryear_val = $("#caryear").attr("value");
            var carid = $("#carId").attr("value");
	        var serialId = (serial_val==undefined||serial_val==null||serial_val=="")?0:serial_val;
	        var caryear = (caryear_val==undefined||caryear_val==null||caryear_val=="")?0:caryear_val;
	        var carID = (carid==undefined||carid==null||carid=="")?0:carid;
	        var cityID = $(this).attr("cityid");
	        if(serialId!=0&&caryear!=0){
		        modelFuc(0,cityID,0,serialId ,0,0,6,1,0,caryear);
            }
            if(carID!=0){
	            modelFucmodel(0,cityID,0,serialId,carID,0,4,1,0,0);
            }
	        $("#currentCity").find("span").html($(this).text());
            $('#city_chose').hide();
            flag=false;
        })
        $('.city_hot_search a').on('click',function () {
            $('.header_nav_left .default_address a').text(decodeURI($(this).text()));
	        setCookies("xyautoarea",this);
	        var serial_val = $("#serialId").attr("value");
	        var caryear_val = $("#caryear").attr("value");
	        var carid = $("#carId").attr("value");
	        var serialId = (serial_val==undefined||serial_val==null||serial_val=="")?0:serial_val;
	        var caryear = (caryear_val==undefined||caryear_val==null||caryear_val=="")?0:caryear_val;
	        var carID = (carid==undefined||carid==null||carid=="")?0:carid;
	        var cityID = $(this).attr("cityid");
	        if(serialId!=0&&caryear!=0){
		        modelFuc(0,cityID,0,serialId ,0,0,6,1,0,caryear);
	        }
	        if(carID!=0){
		        modelFucmodel(0,cityID,0,serialId,carID,0,4,1,0,0);
	        }
	        $("#currentCity").find("span").html($(this).text());
            $('#city_chose').hide();
            flag=false;
        });
    })();
    var cookie_city = $("#city_chose_region dd a");
    for(var i = 0;i<cookie_city.length;i++){
        if(window.location.href.indexOf($(cookie_city[i]).attr("href"))>-1){
	        var value = cookie_city[i].getAttribute("cityid")+"_"+$(cookie_city[i]).text();
	        $('.header_nav_left .default_address a').text($(cookie_city[i]).text());
	        $.cookie("xyautoarea",value,{
		        expires:30,//有效日期
		        path:"/",//cookie的路 径
		        domain:".qichedaquan.com"    //cookie的域名
	        });

        }
    }


    //添加cookie
    function setCookies(key,target) {
        var value = target.getAttribute("cityid")+"_"+$(target).text();
        $.cookie(key,value,{
            expires:30,//有效日期
            path:"/",//cookie的路 径
            domain:".qichedaquan.com"    //cookie的域名
        });
    }
    //播放按钮点击交互
    var playClick=(function () {
        $('.iconSpan3').mouseover(function () {
            $(this).removeClass('icon-play-norme').addClass('icon-play-hover')
        });
        $('.iconSpan3').mouseout(function () {
            $(this).removeClass('icon-play-hover').addClass('icon-play-norme')
        });
        $('.iconSpan3').mousedown(function () {
            $(this).removeClass('icon-play-hover').addClass('icon-play-press')
        });
        $('.iconSpan3').mouseup(function () {
            $(this).removeClass('icon-play-press').addClass('icon-play-hover')
        });
    })();

    //轮播图文字描述背景色效果
    var bannerImgClick=(function () {
        $('.car_small_img li a').mouseover(function () {
            $(this).find('.img_description').css({'background':'#398be4','opacity':'0.8'})
        });
        $('.car_small_img li a').mouseout(function () {
            $(this).find('.img_description').css({'background':'#000','opacity':'0.8'})
        });
        $('.car_small_img li a').mousedown(function () {
            $(this).find('.img_description').css({'background':'#126acc','opacity':'0.8'})
        });
        $('.car_small_img li a').mouseup(function () {
            $(this).find('.img_description').css({'background':'#398be4','opacity':'0.8'})
        });

        $('.car_big_img a').mouseover(function () {
            $(this).find('.img_description').css({'background':'#398be4','opacity':'0.8'})
        });
        $('.car_big_img a').mouseout(function () {
            $(this).find('.img_description').css({'background':'#000','opacity':'0.8'})
        });
        $('.car_big_img a').mousedown(function () {
            $(this).find('.img_description').css({'background':'#126acc','opacity':'0.8'})
        });
        $('.car_big_img a').mouseup(function () {
            $(this).find('.img_description').css({'background':'#398be4','opacity':'0.8'})
        });



        //点击左键交互
        $('.left').mousedown(function () {
            $(this).addClass('icon-bannerLeft-btn-press').removeClass('icon-bannerLeft-btn-hover')
        });
        $('.left').mouseup(function () {

            $(this).addClass('icon-bannerLeft-btn-hover').removeClass('icon-bannerLeft-btn-press')
        });
        $('.left').mouseover(function () {
            $(this).addClass('icon-bannerLeft-btn-hover').removeClass('icon-bannerLeft-btn-default')
        });
        $('.left').mouseout(function () {
            $(this).addClass('icon-bannerLeft-btn-default').removeClass('icon-bannerLeft-btn-hover')
        });


        //点击右键交互
        $('.right').mousedown(function () {
            $(this).addClass('icon-bannerRight-btn-press').removeClass('icon-bannerRight-btn-hover')
        });
        $('.right').mouseup(function () {
            $(this).addClass('icon-bannerRight-btn-hover').removeClass('icon-bannerRight-btn-press')
        });
        $('.right').mouseover(function () {
            $(this).addClass('icon-bannerRight-btn-hover').removeClass('icon-bannerRight-btn-default')
        });
        $('.right').mouseout(function () {
            $(this).addClass('icon-bannerRight-btn-default').removeClass('icon-bannerRight-btn-hover')
        });
    })();

    //汽车图标hover&&press效果
    var iconsHoverPress=(function () {
        var reg=/^(icon-\w+)-(\w+)/ig;
        $('#carIcon_detail_ul li').on('mouseover',function (e) {
            var e=e||window.event;
            var tar=e.target||e.srcElement;
            var curClassName=$(this).find('i').attr('class')

            var nowClassName=curClassName.replace(reg,function () {
                return arguments[1]+'-hover'
            });
            $(this).find('i').removeClass(curClassName).addClass(nowClassName);

        });
        $('#carIcon_detail_ul li').on('mousedown',function (e) {
            var e=e||window.event;
            var tar=e.target||e.srcElement;
            var curClassName=$(this).find('i').attr('class')

            var nowClassName=curClassName.replace(reg,function () {
                return arguments[1]+'-press'
            });
            $(this).find('i').removeClass(curClassName).addClass(nowClassName);

        });
        $('#carIcon_detail_ul li').on('mouseup',function (e) {
            var e=e||window.event;
            var tar=e.target||e.srcElement;
            var curClassName=$(this).find('i').attr('class');

            var nowClassName=curClassName.replace(reg,function () {
                return arguments[1]+'-hover'
            });
            $(this).find('i').removeClass(curClassName).addClass(nowClassName);

        });
        var $aLi=$('#carIcon_detail_ul li');
        $.each($aLi,function (index,item) {
            var curClass=null;
            var nowClassName;
            $(item).on('mouseout',function () {
                curClass=$(item).find('.icons').find('i').attr('class')
                nowClassName=curClass.replace(reg,function () {
                    return arguments[1]+'-norme'
                });
                $(item).find('.icons').find('i').removeClass(curClass).addClass(nowClassName)
            })
        })
    })();

    //tab模块切换hover效果
    var tabChange=(function () {
        $("#car_class_tab .hover1 a").mouseover(function(e){
            e=e||window.event;
            var tar=e.target||e.srcElement;
            if(tar.id=='beijing_market'){
                return;
            }else{

                $(tar).parent().addClass("on").siblings().removeClass("on");
                $("#tab_car div").hide().eq($(this).parent().index()).show();
            }
        })

        $('#car_class_tab .hover1 a').mouseout(function (e) {
            e=e||window.event;
            var tar=e.target||e.srcElement;
            $(tar).addClass('on').siblings().removeClass('on')

        })


        $('#js-left-tap .js-menu').on('mouseover',function () {
            $('#js-tab-warp ul').eq($(this).index()).show().siblings().hide();
        })
    })();

    //汽车品牌选择
    var carSelect=(function () {
        var flag=false;
        $('#for_input_brand').on('click',function (e) {
            e=e||window.event;
            var tar=e.target||e.srcElement;
            if(tar.id=='search_brand'||tar.id=='search_down'||tar.id=='for_input_brand'){
                if(!flag){
                    $('#car_brand_select').css('visibility','visible');
                    $('#search_brand').css('border-color','#398be4');
                    $('#search_down').addClass('hover').removeClass('default1');
                    flag=true;
                }else{
                    $('#car_brand_select').css('visibility','hidden');
                    $('#search_brand').css('border-color','#dadada');
                    $('#search_down').addClass('default1').removeClass('hover');
                    flag=false;
                }
            }else{
                flag=false;
                return;
            }
        });

        //点击车品牌字母，将该品牌字母置顶
        $('#car_letters').on('click',function (e) {
            e=e||window.event;
            var tar=e.target||e.srcElement;
            $(this).addClass('active').siblings().removeClass('active');
            var lettersValue=$(tar).text();
            moveToTop(lettersValue);
        });
        $('#car_letters span').on('click',function () {
            $(this).addClass('active').siblings().removeClass('active');
        })

        //点击字母，滚动到对应首字母车品牌位置
        function moveToTop(lettersValue) {
            var allDl=$('#brand_car_name dl');
            var reg=/^letters_(\w)/ig;
            var topMove=null;
            for(var i=0;i<allDl.length;i++){
                var cur=allDl[i];
                var keyWords=$(cur).attr('id').replace(reg,function () {
                    return arguments[1];
                });
                if(keyWords==lettersValue){
                    $('#brand_car_name').animate({top:-(topMove)})
                }else{//1px为border,不包含在height中，每一个dl都有，所以需要累加1px
                    topMove+=$(cur).height()+1;
                }
            }
        }
    })();

    //车市左边切换模块
    var tabPrice=(function () {
        $('.price_list li').mouseover(function () {
            $(this).addClass('bg').siblings().removeClass('bg');
            $(".carMarket_left_tab_content").eq($(this).index()).addClass("show").siblings().removeClass("show");
        })

        $('.hot-list .fl .js-menu').on('mouseover',function () {
            $(this).addClass('active').siblings().removeClass('active');
            $('.show_now .js-con').eq($(this).index()).addClass('js-show').siblings().removeClass('js-show');

        });
    })();


    //footer
    //footer top值根据body高度来展示；
    var footerOffsetTop=(function () {
        var bodyHeight=$(document.body).height();
        var clientHeight=$(window).height();
        var  footerHeight=$('.footer').height();
        if(bodyHeight<clientHeight){
            $('.footer').css({'position':'fixed','bottom':0})
        }else{
            $('.footer').css({'position':'relative','bottom':0})
        }
    })();
    $('#input_city_search .city_search_result').on('click',function (e) {
        e=e||window.event;
        var tar=e.target||e.srcElement;
        e.stopPropagation?e.stopPropagation():e.cancelBubble=true;
        if(tar.tagName=='SPAN'){

        }

    })


    //首页视频模块跳转到视频页，让对应的tab按钮高亮并定位到该模块
    var jumpVideo=(function () {
        var  curUrl=window.location.hash;
        var $li=$('#js-v-list li');
        var reg=/^#(\d)$/g;
        var checkId;
        curUrl.replace(reg,function () {
            return checkId=arguments[1];
        });
        $.each($li,function (index,item) {
            if(item.id==checkId){
                $(item).css({'color':'#398be4','font-weight':'bold'})
                $(item).siblings().css({'color':'#333','font-weight':'normal'})
            }
        })
    })()

    if($('.rightsm_ad_mod img')[0]){
        $('.rightsm_ad_mod img').parents('.rightsm_ad_mod').css({
            'margin-bottom':'10px'
        });

    }
    if($('.rightarticle_ad_mod img')[0]&&$('#div_cartype')[0]){
        $('#div_cartype').css({
            'margin-top':'20px'
        })
    }
    if($('.ad_article_mod img')[0]){
        $('.ad_article_mod img').parents('.ad_article_mod').css({
            'margin-bottom':'20px'
        });
    }
    if($('.car_intro')[0]){
        $('.car_intro li').hover(function() {
            $(this).find('.img_box').show();
        }, function() {
            $(this).find('.img_box').hide();
        });
    }
    var noCompatibilityPlaceholde=function(){
        if(!placeholderSupport()){ // 判断浏览器是否支持 placeholder
            $('[placeholder]').focus(function() {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.removeClass('placeholder');
                }
            }).blur(function() {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.addClass('placeholder');
                    input.val(input.attr('placeholder'));
                }
            }).blur();
        };
        function placeholderSupport() {
            return 'placeholder' in document.createElement('input');
        }
    }
    noCompatibilityPlaceholde()


    //换一换（4S)店促销区域有无广告样式
    var changeContent=(function () {
        var clickCount=0;
        var $allLI=$('.carMarket_right ul li');
        var totalCount=Math.ceil($allLI.length/9);
        if(!$('.rightsm_ad_mod ins img')||!$('.rightsm_ad_mod ins object')){
            $('.rightsm_ad_mod').siblings('p').css('margin-top','40px');
            totalCount=Math.ceil($allLI.length/12);
            $('.refresh').on('click',function () {
                clickCount+=1;
                for(var j=0;j<$allLI.length;j++){
                    if(clickCount==totalCount){
                        clickCount=0;
                        $($allLI[i]).show();
                        return;
                    }
                    if(clickCount==1){
                        if(i<13){
                            $($allLI[i]).hide()
                        }
                    }
                    if(clickCount==2){
                        if(i<26){
                            $($allLI[i]).hide()
                        }
                    }
                }
            })
            return;
        }else{
            $('.rightsm_ad_mod').siblings('p').css('margin-top','20px');
            if(totalCount>=2){
                $('.refresh').show()
                $('.refresh').on('click',function () {
                    clickCount+=1;
                    changeAction();

                })
            }else{
                // $('.refresh').hide()
            }

        }

        function changeAction() {
            for(var i=0;i<$allLI.length;i++){
                if(clickCount==totalCount){
                    clickCount=0;
                    $($allLI).show();
                    return
                }
                if(clickCount==1){
                    if(i<9){
                        $($allLI[i]).hide();
                    }
                }
                if(clickCount==2){
                    if(i<18){
                        $($allLI[i]).hide();
                    }
                }
                if(clickCount==3){
                    if(i<27){
                        $($allLI[i]).hide();
                    }
                }
            }
        }
    })()
});

},{"./mod/cookie":2}],2:[function(require,module,exports){
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

})(jQuery);

},{}]},{},[1])
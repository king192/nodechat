(function () {
	var d = document,
	w = window,
	p = parseInt,
	dd = d.documentElement,
	db = d.body,
	dc = d.compatMode == 'CSS1Compat',
	dx = dc ? dd: db,
	ec = encodeURIComponent;
    var bin_host = w.location.href
    var bin_yes_host = w.location.host;
    var bin_app = "";
    if(parseInt(bin_host.indexOf('app_xian'))>=0){
//      bin_yes_host = bin_yes_host+"/app_xian";
        console.log(bin_yes_host)
        bin_app = "app_xian";
    }
	w.CHAT = {
		msgObj:d.getElementById("g_msg_box"),
		host: bin_yes_host,
		nick:null,
		uid:null,
		socket:null,
		gid:$('.submit').attr('data-gid'),
		//提交聊天消息内容
		submit:function(gid,cont){
			var content = $("#cont").val() || cont;
			var to_uid  = $('.submit').attr('data-id') || 0; //发送给谁
			if(content != ''){
				var obj = {
					uid: this.uid,
					nick: this.nick,
					cont: content,
					gid:this.gid,
					to_uid:to_uid,
					host:this.host,
				};
				this.socket.emit('message', obj);
				$("#cont").val('');
				//隐藏排行榜
				$('.rank_box').hide();
			}
			return false;
		},

		//送花
		send_hua:function(gid,cont){
			var content = cont;
			var gid = gid;
			var to_uid  = $('.submit').attr('data-id') || 0; //发送给谁
			if(content != ''){
				var obj = {
					uid   : this.uid,
					nick  : this.nick,
					cont  : content,
					gid   : gid,
					to_uid:to_uid,
					host  :this.host,
				};
				this.socket.emit('message', obj);
				$("#cont").val('');
			}
			return false;
		},

		//提交礼物信息
		submit_gift:function(gid){
			var content = '赠送礼物';
			var gift_id = $('#gift_id').val();
			var gift_number =$('#gf_num').val();
			var gid = gid ;
			if(gift_id){
				var obj = {
					uid: this.uid,
					nick: this.nick,
					cont: content,
					gid:gid,
					gift_id:gift_id,
					is_gift:1,
					gift_number:gift_number,
					host  :this.host,
					bin_app  :bin_app,
				};
				this.socket.emit('message', obj);
			}
			$('#gift_box').hide();
			return false;
		},

		//更新系统消息，本例中在用户加入、退出的时候调用
		updateSysMsg:function(o, action){
			//当前在线人数
			var onlineCount = o.onlineCount;
			var onlineCount_bin = onlineCount[gid];
			if(parseInt(onlineCount[gid]) > 0 && parseInt(onlinenumber) > 0){
			    console.log(onlineCount[gid])
			    onlineCount_bin = parseInt(onlineCount_bin)+parseInt(onlinenumber);
			}
			$('#total').html(onlineCount_bin);
		},

		//第一个界面用户提交用户名
		usernameSubmit:function(uid,nick,gid){
			if(nick != ""){
				this.init(uid,nick,gid);
			}
			return false;
		},

		init:function(uid,nick,gid){
			this.uid = uid;
			this.nick = nick;
			//连接websocket后端服务器
			var url = w.location.href;
			var ws_url = '';
			if(parseInt(url.indexOf('gonetest.com'))>=0){
				ws_url = 'ws://192.168.2.104:3040';
			}else{
				ws_url = 'ws://43.241.220.205:3040';
			}
			this.socket = io.connect(ws_url);

			//告诉服务器端有用户登录
			this.socket.emit('login', {uid:this.uid, nick:this.nick,gid:this.gid});

			//监听新用户登录
			this.socket.on('login'+this.gid, function(o){
				CHAT.updateSysMsg(o, 'login');
			});

			//监听用户退出
			this.socket.on('logout'+this.gid, function(o){
				CHAT.updateSysMsg(o, 'logout');
			});

			//监听消息发送
			this.socket.on('host_' +this.host+'message_'+gid, function(obj){
				g_html = obj.data;
				var pattern = /\[ems:([[1-9]+|hua)\]/g;
				var pattern1= /([1-9]+|hua)/g;
				var pat_arr =g_html.match(pattern);
				for(x in pat_arr){
					var temp_ar = pat_arr[x];
					var pat1    = temp_ar.match(pattern1);
					var rep = "<img data='' src='/Public/expression/"+pat1+".gif'>";
					g_html=g_html.replace(temp_ar,rep);
				}
				$('#g_msg_box').prepend(g_html);
				if(parseInt(obj.is_gift)>0){
					$('body').prepend(obj.gift_html);
				}
				//设置金额
				if(obj.is_gift){
					if (uid == obj.uid) {
						$('#free_money').html(obj.money);
					}
				}
			});

			//监听私聊消息发送
			this.socket.on('host_'+this.host+'gid_'+gid+'message_to'+uid, function(obj){
				g_html = obj.data;
				//==表情切换
				var pattern = /\[ems:([[1-9]+|hua)\]/g;
				var pattern1= /([1-9]+|hua)/g;
				var pat_arr =g_html.match(pattern);
				for(x in pat_arr){
					var temp_ar = pat_arr[x];
					var pat1    = temp_ar.match(pattern1);
					var rep = "<img data='' src='/Public/expression/"+pat1+".gif'>";
					g_html=g_html.replace(temp_ar,rep);
				}
				//==end
				$('#h_msg_box').prepend(g_html);
				var tab_li_n = $('#submit').attr('istype')
				if(tab_li_n != 2){
					var h_nu = $('#h_num').html() || 0;
					h_nu++;
					$('#tabs').show();
					$('#h_num').html(h_nu)
				}

				//设置金额
				if(obj.is_gift){
					if (uid == obj.uid) {
						$('#free_money').html(obj.money);
					}
				}
			});

			//金额不足消息提醒
			this.socket.on('host_'+this.host+'gid_'+gid+'money_to'+uid, function(obj){
				g_html = obj.data;
				$('#g_msg_box').prepend(g_html);
				if(parseInt(obj.is_gift)>0){
					$('body').prepend(obj.gift_html);
				}
				//设置金额
				if(obj.is_gift){
					if (uid == obj.uid) {
						$('#free_money').html(obj.money);
					}
				}
			});
		}
	};
})();
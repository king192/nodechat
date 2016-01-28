(function(){
	console.log('1')
	window.chat = {
		login:function(msg){
			console.log('login',msg);
		},
		logout:function(msg){
			console.log('logout',msg)
		},
		init:function(uid,nick,room){
			this.uid = uid;
			this.nick = nick;
			//连接websocket后端服务器
			var url = window.location.href;
			var ws_url = '';
			if(parseInt(url.indexOf('185.122.56.205'))>=0){
				ws_url = 'ws://185.122.56.205:3040';
			}else{
				ws_url = 'ws://127.0.0.1:3040'; 
			}
			this.socket = io.connect(ws_url);
console.log('hello')
			//告诉服务器端有用户登录 
			this.socket.emit('login', {uid:this.uid, nick:this.nick,room:this.room});

			//监听新用户登录
			this.socket.on('login'+this.room, function(o){  
				chat.login(o);
			}); 
 
			//监听用户退出
			this.socket.on('logout'+this.room, function(o){
				chat.logout(o);
			}); 

			//监听消息发送
			this.socket.on('host_' +this.host+'message_'+room, function(obj){
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
		}
	}
	chat.init(Math.random(),'kkkk',1)
})()
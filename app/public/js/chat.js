(function(){
	console.log('1')
	window.chat = {
		login:function(msg){
			console.log('login',msg);
		},
		logout:function(msg){
			console.log('logout',msg)
		},
		send:function(obj){
			this.socket.emit('message',obj)
		},
		init:function(obj){
			this.uid = obj.uid;
			this.nick = obj.nick; 
			this.room = obj.room;
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
			this.socket.on(this.room+'logout', function(o){
				chat.logout(o.uid+' exit');
			}); 

			//监听消息发送
			this.socket.on(this.room+'message', function(obj){
				console.log('message',obj);
			});
		}
	}
	chat.init(user)
})()
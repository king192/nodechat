var http = require('http').createServer();
var io = require('socket.io')(http)

//在线用户数量
var onlineCounts = {};
//在线用户
var onlineUsers = {};
//监听用户连接
io.on('connection',function(socket){
	console.log('a user connection!')
	socket.on('login',function(obj){
		console.log('login',obj);
		//用户唯一标示,添加到当前连接的socket
		socket.uid = obj.uid;
		//房间号
		socket.room = obj.room;
		console.log('socket',socket);
		//检查在线列表，如果不存在则加入
		var room_uid = obj.room+'_'+obj.uid;
		if(!onlineUsers.hasOwnProperty(room_uid)){
			onlineUsers[room_uid] = room_uid;
			//对应房间号在线人数统计
			if(!onlineCounts.hasOwnProperty(obj.room)){
				//不存在初始化为1 
				onlineCounts[obj.room] = 1;
			}else{ 
				onlineCounts[obj.room]++;
			}
		}
		console.log('onlineCounts',onlineCounts);
		//向同一房间的用户广播用户加入
		io.emit('login'+obj.room,{onlineCounts:onlineCounts,onlineUsers:onlineUsers})
	})
	socket.on('disconnect',function(){
		console.log('some disconnect'); 
		// if(onlineUsers.hasOwnProperty(socket.))
	})
	socket.on('message',function(obj){
		io.emit(obj.room+'message',socket.uid)
		console.log(obj.username+'说：'+obj.con);
	})
})

//监听用户断开连接

http.listen(3040,'0.0.0.0',function(){
	console.log('listening on :3040')
})
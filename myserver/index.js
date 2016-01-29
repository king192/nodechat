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
		var room_uid = obj.room+'_'+obj.uid;
		//用户唯一标示,添加到当前连接的socket
		socket.uid = obj.uid;
		// //房间号
		socket.room = obj.room;
		socket.flag = room_uid;
		// console.log('socket',socket);
		//检查在线列表，如果不存在则加入
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
		io.emit('login'+obj.room,
			{
				room:socket.room,
				room_num:onlineCounts[obj.room],
				uid:socket.uid,
				onlineCounts:onlineCounts,
				onlineUsers:onlineUsers
			})
	})
	socket.on('disconnect',function(){
		var info = socket;
		console.log('onlineCounts',onlineCounts)
		// console.log('=============================================================',info)
		// console.log('---------------------------------------------------------------')
		console.log('some disconnect',[info.flag,info.uid,info.room]); 
		if(onlineUsers.hasOwnProperty(socket.flag)){
			var userflag = socket.flag;
			//删除用户
			delete onlineUsers[socket.flag];
			//如果房间人数为0
			if(!(--onlineCounts[socket.room])){
				console.log('+++++++++++++++++++++++++++++++')
				delete onlineCounts[socket.room];
			}
			io.emit(socket.room+'logout',{uid:socket.uid});
			console.log(socket.uid+'exit room '+socket.room);
		}
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
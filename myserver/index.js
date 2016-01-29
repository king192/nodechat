var http = require('http').createServer();
var io = require('socket.io')(http)

//在线用户数量
var onlineCounts = {};
//在线用户
var onlineUsers = {};

io.on('connection',function(socket){
	console.log('a user connection')
	socket.on('login',function(obj){
		//用户唯一标示
		socket.uid = obj.uid;
		//房间号
		socket.room = obj.room;
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

	})
})

http.listen(3040,'0.0.0.0',function(){
	console.log('listening on :3040')
})
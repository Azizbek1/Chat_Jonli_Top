app.controller("indexController", ['$scope', 'indexFactory','configFactory', ($scope, indexFactory, configFactory) => {     // Eng asosiy qisimlar yoziladi: : Client qismi 


    $scope.messages = [];
    $scope.players = {};
    
    function scrollTop () {
        setTimeout(() => {
            const el = document.querySelector("#chat-aria");
            el.scrollTop = el.scrollHeight;
        })
    }

    $scope.init = () => {
        const username = prompt(`Iltimos Ismingizni yozing`); //aziz

        if(username){
            InitSocket(username)
        }
        else{
            return false
        }
    }
  async function InitSocket(username){
        const connectionOptions = {  // object 
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        }

        const socketUrl = await configFactory.getConfig()

        // console.log(socketUrl.data.socketUrl);

        indexFactory.connectSocket(socketUrl.data.socketUrl, connectionOptions)
        .then((socket) => {
            // console.log("Boglanish amalga oshirildi", socket);

            socket.emit("newUser",  { username }) 


            socket.on("initPlayers", (players) => {
                $scope.players = players
                // scrollTop()
                $scope.$apply();
            })

            socket.on("newUser", (data) => {
                // console.log(data);
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 1 // login or disconnect
                    }, 
                    username: data.username // aziz
                }
                $scope.messages.push(messageData);
                $scope.players[data.id] = data
                $scope.$apply();
                //clientIshlashi uchun
            })

            // Chiqib Ketganda 
            socket.on("disUser", (user) => {
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 0 // login or disconnect
                    }, 
                    username: user.username // aziz
                }
                $scope.messages.push(messageData)
                delete $scope.players[user.id]
                
                $scope.$apply();
            })


            socket.on("animate", data => {
                // console.log(data);
                $('#'+data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                    animate = false
                })
            })

            // Biz bekendan message qarshilavomiz

            socket.on("newMessage", message => {
                $scope.messages.push(message)
                $scope.$apply()
                scrollTop()
            })




            // Click jarayonini yozamiz 
            let animate = false
            $scope.onClickPlayer = ($event) => {
                // console.log($event.offsetX, $event.offsetY);
                if(!animate){
                    let x = $event.offsetX
                    let y = $event.offsetY


                    socket.emit("position", {x, y});


                    animate = true
                    $('#'+socket.id).animate({'left': x, 'top': y}, () => {
                        animate = false
                    })
                }
                //    console.log($event.offsetX, $event.offsetY);

            }

            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: {
                        code: 1, 
                    }, 
                    username: username, // aziz
                    text: message

                }
                $scope.messages.push(messageData);
                $scope.message = '';
                scrollTop()
                socket.emit("newMessage", messageData)

                


                // $scope.$apply();
            }    

        }).catch((err) => {
            console.log(err);
        })
    }
    
    
}])
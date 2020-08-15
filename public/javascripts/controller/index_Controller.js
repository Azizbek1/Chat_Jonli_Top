app.controller("indexController", ['$scope', 'indexFactory', ($scope, indexFactory) => {     // Eng asosiy qisimlar yoziladi: : Client qismi 


    $scope.messages = []
    
    $scope.init = () => {
        const username = prompt(`Iltimos Ismingizni yozing`); //aziz

        if(username){
            InitSocket(username)
        }
        else{
            return false
        }
    }

    function InitSocket(username){
        const connectionOptions = {  // object 
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        }

        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) => {
            // console.log("Boglanish amalga oshirildi", socket);

            socket.emit("newUser",  { username }) 


            socket.on("initPlayers", (players) => {
                $scope.players = players
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
                $scope.messages.push(messageData)
                $scope.$apply();
                //clientIshlashi uchun
            })


            socket.on("disUser", (user) => {
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 0 // login or disconnect
                    }, 
                    username: user.username // aziz
                }
                $scope.messages.push(messageData)
                $scope.$apply();
            })

            // Click jarayonini yozamiz 
            let animate = false
            $scope.onClickPlayer = ($event) => {
                // console.log($event.offsetX, $event.offsetY);
                if(!animate){
                    animate = true
                    $('#'+socket.id).animate({'left': $event.offsetX, 'top': $event.offsetY}, () => {
                        animate = false
                    })
                }
                //    console.log($event.offsetX, $event.offsetY);

            }



        }).catch((err) => {
            console.log(err);
        })
    }
    
    
}])
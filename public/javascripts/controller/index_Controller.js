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

            socket.on("newUser", (data) => {
                // console.log(data);
                const messageData = {
                    type: 0, 
                    username: data.username // aziz
                }
                $scope.messages.push(messageData)
                $scope.$apply();
                //clientIshlashi uchun
            })

        }).catch((err) => {
            console.log(err);
        })
    }
    
    
}])
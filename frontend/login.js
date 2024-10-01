$(document).ready(() => {
    var users = []
    
    $.ajax({
        url: 'http://mydb.getenjoyment.net/api/users.php',
        method: 'GET',
        dataType: 'json',
        success: (response) => {
            users = JSON.parse(response.data)
            console.log(users)
        },
        error: (xhr, status, error) => {
          console.log('Error getting tasks', error)
        }
    })

    $("#login-form").on('submit', (e) => {
        e.preventDefault()
        const currentUSer = users.find(user => user.username == $("#username").val() && user.password == $("#password").val())
        console.log(currentUSer)
        if(currentUSer){

            sessionStorage.setItem('id', currentUSer.id)
            sessionStorage.setItem('username', currentUSer.username)
            sessionStorage.setItem('loggedIn', true);

            Toastify({
                text: 'Welcome back '+ $("#username").val(),
                duration: 3000,
            }).showToast();

            setTimeout(() => {
                window.location.href = 'index.html'
            }, 2000)
        }else{
            Toastify({
                text: 'Incorrect data',
                duration: 5000,
                style: {
                    background: "#dc3545",
                },
            }).showToast();
        }
        
    })


})

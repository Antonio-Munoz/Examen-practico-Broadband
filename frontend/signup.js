$(document).ready(() => {

    $("#signup-form").on('submit', (e) => {
        e.preventDefault()
        
        const newUser = {
            name: $("#name").val(),
            username: $("#username").val(),
            password: $("#password").val()
        }

        $.ajax({
            url: 'http://mydb.getenjoyment.net/api/users.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(newUser),
            success: (response) => {
                $("#name").val('')
                $("#username").val('')
                $("#password").val('')

                Toastify({
                    text: 'Congrats, you are logged',
                    duration: 2500
                }).showToast();

                setTimeout(()=>{
                    window.location.href = 'login.html'
                }, 3000)
            },
            error: (xhr, status, error) => {
                console.log('Something wring happened', error)
            }
        })
    })

})
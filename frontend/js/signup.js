$(document).ready(() => {

    $("#signup-form").on('submit', (e) => {
        e.preventDefault()
        
        if(!validateForm()){
            return
        }
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

const validateForm = () => {
    const inputName = $("#name")
    const inputUsername = $("#username")
    const inputPassword = $("#password")

    if(!inputName.val() || !inputUsername.val() || !inputPassword.val()){
        $("#name").addClass('is-invalid')
        $("#username").addClass('is-invalid')
        $("#password").addClass('is-invalid')
        Toastify({
            text: 'You are missing something...',
            duration: 5000,
            style: {
              background: "#dc3545"
            }
          }).showToast();
        return false
    }else{
        $("#name").removeClass('is-invalid').addClass('is-valid')
        $("#username").removeClass('is-invalid').addClass('is-valid')
        $("#password").removeClass('is-invalid').addClass('is-valid')
    }
    
    return true
}
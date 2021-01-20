// app que sirve para setear el modo dark o light


//variables 
let getDark            = document.getElementById('btn-dark') ;
let btnLight           = document.getElementById('btn-light');
let body               = document.body;



// FUNCIONES

//#1 modoNocturno le agrega la clase dark a el body
const modoNocturno = ()=>{
    body.classList.toggle('dark');
   
 }
 //#2 setBodyDark verifica si en el local storage registro un click en light mode o dark mode y lo deja fijo en la pagina
 const setBodyDark = ()=>{
    if(localStorage.getItem('dark-mode') == 'true'){
        body.classList.add('dark')
        getDark.style.display = 'none'
        btnLight.style.display = 'flex'
    }else{
        body.classList.remove('dark')

    }
}


// eventos


 getDark.addEventListener('click',()=>{
     modoNocturno()
 
     getDark.style.display = 'none'
     btnLight.style.display = 'flex'
 
     if(body.classList.contains('dark')){
         localStorage.setItem('dark-mode',true)
         
     }else{
         localStorage.setItem('dark-mode',false)
 
     }
  
  })
  ///evento para cambiar a modo diurno
  btnLight.addEventListener('click',()=>{
      modoNocturno()
      btnLight.style.display = 'none'
      getDark.style.display = 'flex'
      if(body.classList.contains('dark')){
         localStorage.setItem('dark-mode','true')
         
 
     }else{
         localStorage.setItem('dark-mode','false')
     }
 
  
     
  })
    



setBodyDark()
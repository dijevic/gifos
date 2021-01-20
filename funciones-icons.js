let iconModalFav           = document.querySelector('.icon-favorito-modal');

//funcion que me permite disponer en display block o none de mi caja modal para mostrar mi gif en modo mobile
const maximinizarMobile = (event)=>{
    let user                = event.target.previousElementSibling.lastElementChild.firstElementChild.textContent
    let descripcion         = event.target.previousElementSibling.lastElementChild.firstElementChild.nextElementSibling.textContent
    let id                  = event.target.id
    modal.style.display     = "block";
    modalContent.src        = event.target.src;
    modalContent.alt        = descripcion;
    modalContent.id         = id
    userModal.textContent   = user;
    tituloModal.textContent = descripcion;
    modal.classList.add('actived')

    if(favoritos.length > 0){
        favoritos.forEach(favorito=>{
            if(favorito.id == id){
                iconModalFav.classList.add('actived')

            }
        })
    }

}
//funcion que me permite disponer en display block o none de mi caja modal para mostrar mi gif en modo 968px+
const maximizar = (event)=>{
    let user              = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.textContent;
    let descripcion       = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.nextSibling.nextSibling.textContent;
    let pictureUrl        = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild.src;
    let img               = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild
    let id                = img.id
    modal.style.display = "block";
    modalContent.src = pictureUrl;
    modalContent.id  = id
    modalContent.alt = descripcion
    userModal.textContent = user;
    tituloModal.textContent = descripcion;
    modal.classList.add('actived')

//    con la siguiente funcion le agrego o quito a la clase "actived" al modal si ya estaba agg a favoritos en vista normal

    let imagen         = iconModalFav.parentNode.parentNode.previousElementSibling.firstElementChild;
    let idIconModalFav = imagen.id;
    if(favoritos.length > 0){
        favoritos.forEach(gifo=>{
            let idFavorito = gifo.id;
            if(idFavorito == idIconModalFav){
              
                iconModalFav.classList.add('actived')
            }
        })
    }
   
    
   
   
}

//funcion para disponer de mi modal en display block y ver el gif en pantalla completa
const maxMinPicture = ()=>{
    
    let img = document.querySelectorAll('.imagen');
    let icon = document.querySelectorAll('.icon-escalar')    
    img.forEach((imagen)=>{
        imagen.addEventListener('click',maximinizarMobile)
    })
    
    icon.forEach((icon)=>{
        icon.addEventListener('click',maximizar)
    })
    
    closeModal.addEventListener('click',(event)=>{
        modal.style.display = "none";
        modal.classList.remove('actived')
        modalContent.src = ''
        iconModalFav.classList.remove('actived')
        if(favoritos.length > 0){

            let iconFavorito = document.querySelectorAll('.icon-favorito') ;

            (localStorage.getItem('favoritos')) ? favoritos = JSON.parse(localStorage.getItem('favoritos')) 
                                                :favoritos = []
            iconFavorito.forEach(icon=>{
                let idFavorito = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id
                for(let i = 0; i < favoritos.length;i++){
                    if( idFavorito == favoritos[i].id){
                        icon.classList.add('actived')
                        break
                    }else{
                        icon.classList.remove('actived')

                    }
                }
            })
        }
      
    })

}


// esta es la funcion que le doy a mi evento de la variable 'icon' ;
// con el evento agrego mi gif al localstorage o lo saco del local storage y doy o quito clases de ser necesario
const crearFavorito = (event)=>{
    class GIF {

        constructor(user,descripcion,gif,id){
            this.user = user
             this.descripcion = descripcion
            this.gif = gif;
            this.id  = id
        }
    }

    event.target.classList.toggle('actived')
    
     let user         =  event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.textContent;
     let imagen       =  event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild
     let descripcion  =  imagen.attributes[3].value;
     let pictureUrl   =  imagen.attributes[2].value;
     let id           = imagen.id
 
    
   
    if( event.target.classList.contains('actived')){
        let favorito = new GIF(user,descripcion,pictureUrl,id)
        favoritos.push(favorito)
        localStorage.setItem('favoritos',JSON.stringify(favoritos))



    }else if(!event.target.classList.contains('actived')){
          let nuevoFavoritos = favoritos.filter((i) => i.id != id )
          favoritos = nuevoFavoritos
          localStorage.setItem('favoritos',JSON.stringify(favoritos))
    }

    
}
// con esta funcion agrego mi favorito.
// tambien si en el modal tiene marcado como favorito tambien se marca afuera en mi tarjeta con el mismo gif y de viceverza
const aggFavorito =()=>{
 
    let iconFavorito = document.querySelectorAll('.icon-favorito') ;

    (localStorage.getItem('favoritos')) ? favoritos = JSON.parse(localStorage.getItem('favoritos')) 
                                        :favoritos = []
  iconFavorito.forEach((icon)=>{
      let idFavorito = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id
    if(favoritos.length > 0){
        for(let i = 0; i < favoritos.length;i++){
            if( idFavorito == favoritos[i].id){
                icon.classList.add('actived')
                break
            }else{
                continue
            }
        }
    }


icon.addEventListener('click',crearFavorito)
 




})



}
const descargarGifoSeleccionado = (event)=>{
    let nombre ;
    let urlIcon;
    // aca si mi modal tiene la clase actived es porque esta en full screen es decir no esta oculto
    // esta funcion me permite descargar los gifs tanto en las targ=jetas como en mi modal
    if(!modal.classList.contains('actived')){
     nombre = event.target.parentElement.parentElement.nextElementSibling.firstChild.nextSibling.nextSibling.nextSibling.textContent;
    urlIcon = event.target.parentElement.parentElement.parentElement.parentElement.lastElementChild.src;}
    else if(modal.classList.contains('actived')){
        nombre = event.target.parentElement.parentElement.firstElementChild.lastElementChild.textContent;
        urlIcon = event.target.parentElement.parentElement.previousElementSibling.firstElementChild.src;
    }
    let xhr = new XMLHttpRequest();

    xhr.open("GET", urlIcon, true);
    xhr.responseType = "blob";
    
    xhr.onload = function(){
    
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(this.response);
        let tag = document.createElement('a');
        tag.href = imageUrl;
        tag.download = nombre;
        document.body.appendChild(tag);
        tag.click();
        document.body.removeChild(tag);
    
    }
    
    xhr.send();
}

// esta funcion esta hecha con el fin de agregar a favorito los gif cuando el la ventana modal este abierta
const aggFavoritoModalActived = ()=>{
    
    iconModalFav.addEventListener('click',(event)=>{
        class GIF {
    
            constructor(user,descripcion,gif,id){
                this.user = user
                 this.descripcion = descripcion
                this.gif = gif;
                this.id  = id
            }
        }
        event.target.classList.toggle('actived');

        let imagen      = event.target.parentNode.parentNode.previousElementSibling.firstElementChild
        let pictureUrl  = imagen.src;
        let id          = imagen.id;
        let descripcion = imagen.alt;
        let user        = event.target.parentNode.previousElementSibling.firstElementChild.textContent;
    
        if( event.target.classList.contains('actived')){
            let favorito = new GIF(user,descripcion,pictureUrl,id)
            favoritos.push(favorito)
            localStorage.setItem('favoritos',JSON.stringify(favoritos))
           
    
    
        }else if(!event.target.classList.contains('actived')){
              let nuevoFavoritos = favoritos.filter((i) => i.id != id )
              favoritos = nuevoFavoritos
              localStorage.setItem('favoritos',JSON.stringify(favoritos))
        }

    })
}

// con esta funcion descargo los gifs
const descargarGifos = ()=>{
    let iconDescarga = document.querySelectorAll('.icon-descargar')
    iconDescarga.forEach((icon)=>{
        icon.addEventListener('click',descargarGifoSeleccionado)
    })
}
aggFavoritoModalActived()



let contenedorResultados    = document.querySelector('.contenedor-resultados');
let contenedorSinResultados = document.querySelector('.sin-resultados');
let contenedorTrending      = document.getElementById('contenedor-trending');
let BotonverMas             = document.querySelector('.ver-mas')
let apikey                  = 'UIu9Y60JBJMJggRmYEbpqjWDiVcXoTTv';
let closeModal              = document.querySelector('.close-modal');
let modal                   = document.getElementById('my-modal')
let modalContent            = document.querySelector('.modal-content');
let userModal               = document.querySelector('.user-modal');
let tituloModal             = document.querySelector('.titulo-modal');
let favoritos;
let suma                    = 12;
let index                   = 0;



/////funcion en la cual dejo la estructura para crear un nuevo favorito
const dibujarFavoritos = (user,descripcion,gif)=>{
    const html = `
     <div class="gift"> 
    <div class="contenedor-info-tools">
        <div class="tools">
           <div class="icon-tools">
               <div class="icon-eliminar"></div>
                <div class="icon-descargar"></div>
                <div class="icon-escalar"></div>
            </div>
        </div>
        <div class="informacion">
            <h2 class="user">${user}</h2>
            <p class="gift-titulo">${descripcion}</p>
        </div>
    </div>
       <img  class="imagen" id="my-img" src="${gif}" alt="${descripcion}">
    
   

</div>`

let div = document.createElement('div');
div.classList.add('contenedor');
div.innerHTML = html;
contenedorResultados.appendChild(div)
}
  //funcion que dibuja cada uno de mis gifos en el body del html
  const dibujarTrending = (url,usuario,decripcion, alt,id)=>{
    const html = ` 
     <div class="gift"> 
    <div class="contenedor-info-tools">
        <div class="tools">
           <div class="icon-tools">
            <div class="icon-favorito"></div>
            <div class="icon-descargar"></div>
            <div class="icon-escalar "></div>
            </div>
        </div>
        <div class="informacion">
            <h2 class="user">${usuario}</h2>
            <p class="gift-titulo">${decripcion}</p>
        </div>
    </div>
       <img  class="imagen "  id="${id}" src="${url}" alt="${alt}" >
    
   

</div>`
let div = document.createElement('div')
div.classList.add('contenedor-gifos');
div.innerHTML = html
contenedorTrending.append(div)

}
///verifico si en el storage existen elementos favoriteados y si es asi los introduzco al html
const llamarFavoritos = ()=>{
    if( localStorage.getItem('favoritos')){
        favoritos = JSON.parse(localStorage.getItem('favoritos'));
      if(favoritos.length > 0 && favoritos.length < 12){
        for(let i = 0; i < favoritos.length ; i++){
        let user         = favoritos[i].user;
        let descripcion  = favoritos[i].descripcion;
        let gifo         = favoritos[i].gif;
        dibujarFavoritos(user,descripcion,gifo)            
       
       }
       eliminarFavorito()
      }else if(favoritos.length> 12){
        for(let i = 0; i < 12 ; i++){
            let user         = favoritos[i].user;
            let descripcion  = favoritos[i].descripcion;
            let gifo         = favoritos[i].gif;
            dibujarFavoritos(user,descripcion,gifo)            
           
           }

       eliminarFavorito()
       maxMinPicture()
       descargarGifos()
       aggFavorito()
 
      }
        

        
        
    }
verMas()

}


// funcion que me permite traer mas gif 
//no tiene retorno
const verMas = ()=>{
    if(favoritos.length > 12 ){
        BotonverMas.style.display = 'block'
        BotonverMas.addEventListener('click',()=>{
            suma+=12
            index += 12;
            if(suma <= favoritos.length ){
                for(let i = index;i < suma;i++){
                    let user         = favoritos[i].user;
                    let descripcion  = favoritos[i].descripcion;
                    let gifo         = favoritos[i].gif;
                    dibujarFavoritos(user,descripcion,gifo)    
                }
                eliminarFavorito()
            }else if(suma >= favoritos.length ){
                for(let i = index;i < favoritos.length;i++){
                    let user         = favoritos[i].user;
                    let descripcion  = favoritos[i].descripcion;
                    let gifo         = favoritos[i].gif;
                    dibujarFavoritos(user,descripcion,gifo)    
                }
                BotonverMas.style.display = 'none'
                suma = 12;
                index = 0;
                eliminarFavorito()
                maxMinPicture()
                descargarGifos()
                aggFavorito()
          

            }
        })
    }else {
        BotonverMas.style.display = 'none'

    }
    
}

//funcion que me permite borrar del local storage un elemento y tambien borrar del contenedor padre el elemento al que se le hace click
const eliminarFavorito = ()=>{
    let iconEliminar = document.querySelectorAll('.icon-eliminar');
    iconEliminar.forEach((icon)=>{
        icon.addEventListener('click',()=>{
            const hijo = icon.parentElement.parentElement.parentElement.parentElement.parentElement;
            const padre = hijo.parentNode
            let url = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.src
            let nuevoFavoritos = favoritos.filter((i) => i.gif != url)
            favoritos = nuevoFavoritos;
            localStorage.setItem('favoritos',JSON.stringify(favoritos));
            padre.removeChild(hijo)

            if(contenedorResultados.children.length == 0 && favoritos.length > 0){
                BotonverMas.style.display = 'block';
                if(favoritos.length> 12){
                    for(let i = 0; i < 12 ; i++){
                        let user         = favoritos[i].user;
                        let descripcion  = favoritos[i].descripcion;
                        let gifo         = favoritos[i].gif;
                        dibujarFavoritos(user,descripcion,gifo)            
                       
                       }
            
                   eliminarFavorito()
                   maxMinPicture()
                   descargarGifos()
                   aggFavorito()
             
                }else{
                    for(let i = 0; i < favoritos.length ; i++){
                        let user         = favoritos[i].user;
                        let descripcion  = favoritos[i].descripcion;
                        let gifo         = favoritos[i].gif;
                        dibujarFavoritos(user,descripcion,gifo)            
                       
                       }
                       eliminarFavorito()
                       maxMinPicture()
                       descargarGifos()
                       aggFavorito()
                 
                }
               
            }else if(contenedorResultados.children.length == 0 ){
                BotonverMas.style.display = 'none'

            }
        })
    })  
}


//funcion que me permite ocultar mi display de cuando no hay gifs guardados como favoritos
const ocultarDivs = ()=>{
    if(contenedorResultados.children.length > 0){
        contenedorSinResultados.style.display = 'none';
        
     
    }else{
        contenedorSinResultados.style.display = 'block';
        BotonverMas.style.display = 'none'
    
    }
}

//  funcion que llama a mi endpoint de trending gifos
//  retorna la data
const trendingGifos = async(limite)=>{
    try{
      let url = `https://api.giphy.com/v1/gifs/trending?api_key=${apikey}&limit=${limite}`
      let resp = await  fetch(url);
      let data = await resp.json()
      if(data.meta.status == 200){
          return data
      }else{
          throw new Error(`error en el estatus numero :${data.meta.status}`)
      }
    }catch(err){
        console.log(err)
    }
  
  }
  trendingGifos(3).then((resp)=>{
      let data = resp.data ;
      data.forEach((gif)=>{
          let imgUrl = gif.images.downsized.url;
          let usuario = gif.username;
          let titulo = gif.title;
          let id     = gif.id;
          if( usuario == ''){
              usuario = 'unknown user'
          }else if(gif.title == ''){
              titulo = ''
          }
          dibujarTrending(imgUrl,usuario,titulo,titulo,id)
      })
          maxMinPicture()
          descargarGifos()
          aggFavorito()
          
          
  })

llamarFavoritos();
ocultarDivs()

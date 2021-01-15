let contenedorResultados    = document.querySelector('.contenedor-resultados');
let contenedorSinResultados = document.querySelector('.sin-resultados');
let BotonverMas             = document.querySelector('.ver-mas');
let contenedorTrending      = document.getElementById('contenedor-trending');
let closeModal              = document.querySelector('.close-modal');
let modal                   = document.getElementById('my-modal')
let modalContent            = document.querySelector('.modal-content');
let userModal               = document.querySelector('.user-modal');
let tituloModal             = document.querySelector('.titulo-modal');
let apikey                  = 'UIu9Y60JBJMJggRmYEbpqjWDiVcXoTTv';
let ids                     = '';
let index                   = 0;
let suma                    = 12;
let misGifos ;



// ### PETICIONES #######
// con esta funcion hago la peticion para traer mis gifs por id en caso de que existan ids en el local storage
// retorna la data que trae el los gifs con todos sus componentes
const getGifsById = async (id)=>{
    try{
        let url = `https://api.giphy.com/v1/gifs?api_key=UIu9Y60JBJMJggRmYEbpqjWDiVcXoTTv&ids=${id}`;
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

// esta funcion me permite introducir al body nuevos elemntos html con sus clases css predefinidas
const dibujarMisGifos = (user,gif,id)=>{
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
            <p class="gift-titulo">mi gif!</p>

        </div>
    </div>
       <img  class="imagen" id="${id}" src="${gif}" alt="gif animado">
    
   

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


// con esta funcion verifico si en mi localStorage hay ids de gif previamente grabados para obtener ese mismo id y luego llamar a mi api en otra funcion
const getLocalStoragesIds = ()=>{
    if(localStorage.getItem('mis gifos')){
        misGifos =JSON.parse( localStorage.getItem('mis gifos') );
      for(let i = 0; i < misGifos.length;i++){
          if(i < misGifos.length -1){
              ids+= `${misGifos[i]},`
          }else{
            ids+= `${misGifos[i]}`

          }
      }
      
    }else{
        misGifos = [];
    }
}

// con esta funcion traigo mas gifs en caso de que existan mas de 12 gifs en la data de getGifsById()
const verMas = (data)=>{
    if(data.length > 12 ){
        BotonverMas.style.display = 'block'
        BotonverMas.addEventListener('click',()=>{
            suma+=12
            index += 12;
            console.log(suma)
            console.log(index)
            if(suma <= data.length ){
            
                for(let i = index;i < suma;i++){
                    let user         = data[i].username;
                    let gifo         = data[i].images.downsized.url;
                    let id           = data[i].id;
                    dibujarMisGifos(user,gifo,id)     
                }
                eliminarFavorito()
                maxMinPicture()
                descargarGifos()
                aggFavorito()
          
            }else if(suma >= data.length ){
                for(let i = index;i < data.length;i++){
                    let user         = data[i].username;
                    let gifo         = data[i].images.downsized.url;
                    let id           = data[i].id;
                    dibujarMisGifos(user,gifo,id)  
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

// funcion que me permite borrar del local storage un elemento y tambien borrar del contenedor padre el elemento al que se le hace click
const eliminarFavorito = ()=>{
    let iconEliminar = document.querySelectorAll('.icon-eliminar');
    iconEliminar.forEach((icon)=>{
        icon.addEventListener('click',()=>{
            const hijo = icon.parentElement.parentElement.parentElement.parentElement.parentElement;
            const padre = hijo.parentNode
            let miId = icon.parentElement.parentElement.parentElement.parentElement.lastElementChild.id;
            console.log(miId)
            let nuevoMisGifos = misGifos.filter((i) => i != miId)
            misGifos = nuevoMisGifos;
            localStorage.setItem('mis gifos',JSON.stringify(misGifos));
            padre.removeChild(hijo)

            if(contenedorResultados.children.length == 0 && misGifos.length > 0){
                BotonverMas.style.display = 'block';
                getLocalStoragesIds()
                getGifsById(ids).then(resp=>{
                    let data = resp.data;
                    if(misGifos.length> 12){
                        for(let i = 0; i < 12 ; i++){
                            let user         = data[i].username;
                            let gifo         = data[i].images.downsized.url;
                            let id           = data[i].id;
                            dibujarMisGifos(user,gifo,id)            
                           
                           }
                
                       eliminarFavorito()
                    } else{
                        for(let i = 0; i < misGifos.length ; i++){
                            let user         = data[i].username;
                            let gifo         = data[i].images.downsized.url;
                            let id           = data[i].id;
                            dibujarMisGifos(user,gifo,id)           
                           
                           }
                           eliminarFavorito()
                    }
                })
               
                  
               
            }else if(contenedorResultados.children.length == 0 ){
                BotonverMas.style.display = 'none'

            }
        })
    })  
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
  
  

getLocalStoragesIds();


getGifsById(ids).then(resp=>{
   let data = resp.data;
   if(data.length > 0 && data.length < 12){
    for(let i = 0; i < data.length ; i++){
        let user         = data[i].username;
        let gifo         = data[i].images.downsized.url;
        let id           = data[i].id;
       
        dibujarMisGifos(user,gifo,id)            
       
       }
       eliminarFavorito()
   }else if(data.length>= 12){
    for(let i = 0; i < 12 ; i++){
        let user         = data[i].username;
        let gifo         = data[i].images.downsized.url;
        let id           = data[i].id;
        dibujarMisGifos(user,gifo,id)            
       
       }
       eliminarFavorito()
   }
   if(contenedorResultados.children.length>0){
       contenedorSinResultados.style.display = 'none';
   }else{
    contenedorSinResultados.style.display = 'block';

   }
   verMas(data)
   aggFavorito()
   maxMinPicture()
   descargarGifos()
})




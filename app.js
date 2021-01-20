// ### variables ### ///
let inputBuscador          = document.querySelector('.input-buscador')
let modal                  = document.getElementById('my-modal')
let modalContent           = document.querySelector('.modal-content')
let closeModal             = document.querySelector('.close-modal');
let buscador               = document.getElementById('buscador');
let crear                  = document.getElementById('crear-gifo');
let menu                   = document.getElementById('menu')
let contenedorTrending     = document.getElementById('contenedor-trending');
let left                   = document.getElementById('left')
let right                  = document.getElementById('right')
let informacionModal       = document.querySelector('.informacion')
let contenedorResultados   = document.querySelector('.contenedor-resultados')
let lupa                   = document.querySelector('.icon-serch-right')
let verMas                 = document.querySelector('.ver-mas');
let btnCancel              = document.querySelector('.btn-cancel');
let iconSearchLeft         = document.querySelector('.icon-serch-left');
let tituloBuqueda          = document.querySelector('.titulo-busqueda');
let iconSinResultado       = document.querySelector('.sin-resultado');
let txtSinResultado        = document.getElementById('txt-sin-resultado')
let trendingTitle          = document.querySelector('.trending-titulo');
let trendingTxt            = document.querySelector('.contenedor-texto-trending');
let bordeResultados        = document.querySelector('.borde');
let contenedorSugerencias  = document.querySelector('.contenedor-sugerencias');
let userModal              = document.querySelector('.user-modal');
let tituloModal            = document.querySelector('.titulo-modal');
let trendContainer         =document.querySelector('.trendContainer')
let apikey                 = 'UIu9Y60JBJMJggRmYEbpqjWDiVcXoTTv';
let favoritos              = [];
let suma                   = 12;
let index                  = 0;
let y;

// funcion que me permite introducir al html las sugerencias de busqueda
const dibujarSugerencias = (sugerencia)=>{
    const html = `
    <div class="sugerencia-img">
     <div></div>
   </div>
  <div class="sugerencia-descripcion">
   <p class="descripcion">${sugerencia}</p> 
  </div>
 `
   let div = document.createElement('div');
   div.classList.add('sugerencia') ;
   div.innerHTML = html;
   contenedorSugerencias.append(div)
}

// con esta funcion busco los terminos trending 
const trendingTerm = async()=>{
    try{
        let url = `https://api.giphy.com/v1/trending/searches?api_key=${apikey}`;
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

// con esta funcion introduzco al html mis terminos de sugerencia
const dibujarTrendingTerms = (termino)=>{
    const html = `<p class = "texto-trending trendingItem">${termino}</p>`;
    let div = document.createElement('div')
    div.classList.add('trendContainer')
    div.innerHTML = html;
    trendingTxt.append(div)

}
// con esta funcion busco los terminos trending 
const llamarTrendingTerm = ()=>{
    trendingTerm().then(resp =>{
        let data = resp.data;
        for(let i =0; i < 5;i++){
           dibujarTrendingTerms(`  ${data[i]}`)
    
        }

        let trendingTerm = document.querySelectorAll('.trendingItem')
        trendingTerm.forEach((term)=>{
            term.addEventListener('click',()=>{
                llamarBusqueda(term.textContent)
                inputBuscador.value = term.textContent;
            })
        })
    })
}

// con esta funcion hago una peticion para uscar los terminos de autocompletado para mi busqueda
const autoCompletar = async(word)=>{
    try{
        let url = `https://api.giphy.com/v1/gifs/search/tags?api_key=${apikey}&q=${word}`;
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


// con esta funcion llamo a mi peticion de autocompletar y le doy los estilos necesarios
const llamarAutoCompletar = (palabra)=>{
    if(inputBuscador.value == ''){
        eliminarSugerencias();
      contenedorSugerencias.style.display = 'none'

    }
   if(inputBuscador.value.length > 0){
    autoCompletar(palabra).then((resp)=>{
        let data = resp.data;
        eliminarSugerencias()
        contenedorSugerencias.style.display = 'none'
      if(data.length > 0){
        for(let i = 0 ; i < data.length; i++){
            dibujarSugerencias(data[i].name)
        }
        contenedorSugerencias.style.display = 'block'; 
        let sugerencia = document.querySelectorAll('.sugerencia-descripcion');
        sugerencia.forEach((sug)=>{
           sug.addEventListener('click',()=>{

            eliminarSugerencias()
            inputBuscador.value =sug.firstElementChild.textContent
             contenedorSugerencias.style.display = 'none';
             resolveSerachPeticion(sug.firstElementChild.textContent)
             verMas.disabled= false;

           })
        })
      }
    }).catch(err=>{console.log(err)})
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
contenedorTrending.insertBefore(div,right)


}





// /funcion que me permite acomodar dinamicamente la posicion de mi buscador en el tope de la pagina cuando llega a cierta altura
const menuSticky = ()=>{
    window.onscroll = function() {
        y = window.scrollY;
        let ejeY = Math.round(y)
        let pantalla = window.screen.width;
        if(ejeY>450 && pantalla >968 && pantalla < 1200){
                buscador.style.position = 'fixed';
                buscador.style.top = '0';
                buscador.style.left = '0';
                buscador.style.maxWidth = '200px'
                buscador.style.transform = 'translate(150px,25px)';
                buscador.style.transition = '0.5s ease all';
                contenedorSugerencias.style.display = 'none'

              
            
             
        }else if(ejeY > 400 && pantalla >= 1200){
            buscador.style.maxWidth = '350px'
            buscador.style.transform = 'translate(250px,25px)'
            buscador.style.position = 'fixed';
            buscador.style.top = '0';
            buscador.style.left = '0';
            buscador.style.transition = '0.5s ease all';
            contenedorSugerencias.style.display = 'none'

    
        }else if(ejeY < 400 ){
            buscador.style.position = 'static'
            buscador.style.maxWidth = '600px'
            buscador.style.transform = 'translate(0)';
            buscador.style.transition = '0.5s ease all';
         

      };
    
    }
}

//en esta funcion compilo todos mis eventos para tener mayor control y orden
const eventos = ()=>{

    ///evento para cambiar a modo nocturno
   
     //evento para buscar gifs cuando hago click en la lupa
     lupa.addEventListener('click',()=>{
        eliminarSugerencias()
        contenedorSugerencias.style.display = 'none'
        resolveSerachPeticion(inputBuscador.value)
    })
     //evento para buscar gifs cuando hago enter
    inputBuscador.addEventListener('keyup',(event)=>{
        llamarAutoCompletar(inputBuscador.value)
        if(event.keyCode === 13){
          resolveSerachPeticion(inputBuscador.value)
        }
        if(inputBuscador.value == ''){
        tituloBuqueda.textContent      = inputBuscador.value;
        iconSinResultado.style.display = 'none';
        txtSinResultado.style.display  = 'none';
        bordeResultados.style.display  = 'none';

        }
    })

    //evento para cancelar una busqueda , limpiar mi inut,borrar sugerencias y gifd buscados de mi contenedor
    btnCancel.addEventListener('click',()=>{  
        cancelarBuqueda()
    })

    //evento que agrega mas gifs a mi busqueda actual
    verMas.addEventListener('click',()=>{ 
        aggMasGifs()
    })
    
}
//funcion que permite setear el modo dark o quitarlo


// con esta peticion luego de hacer una busqueda me devuelve terminos de sugerencia para el usuario
const sugerencias = async(sugerencia)=>{
    try{
        let url = `https://api.giphy.com/v1/tags/related/{${sugerencia}}?api_key=${apikey}`;
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




// con esta funcion llamo a mi peticion "sugerencias" y le doy los estilos necesarios
const llamarSugerencias = (palabra)=>{
        eliminarSugerencias()
        sugerencias(palabra).then((resp)=>{
            let data = resp.data;
            if(data.length > 0 ){
                for(let i = 0; i < data.length;i++){
                    let sug = data[i].name
                    dibujarSugerencias(sug)
                }
                contenedorSugerencias.style.display = 'block'
                
                let sugerencia = document.querySelectorAll('.sugerencia-descripcion');
                sugerencia.forEach((sug)=>{
                   sug.addEventListener('click',()=>{
                    eliminarSugerencias()
                    eliminarDivs()
                    inputBuscador.value =sug.firstElementChild.textContent
                     contenedorSugerencias.style.display = 'none';
                     
                     resolveSerachPeticion(sug.firstElementChild.textContent)
                     verMas.disabled= false;
                   })
                })
            }
        }).catch(err=>{console.log(err)})
    
}


//  #######################       busqueda      ######################################
// con esta peticion busco los gif por palabra 
const BuscarGifs = async (word)=>{

    try{
        let url = `https://api.giphy.com/v1/gifs/search?api_key=${apikey}&q=${word}`;
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

// con esta funcion llamo a mi peticion de buscar gif y le doy los estilos necesario
const llamarBusqueda = (palabra)=>{
    BuscarGifs(palabra).then((resp)=>{
        let data = resp.data;
       if(data.length > 0 && data.length > 12){
        btnCancel.style.display = 'block';
        lupa.style.display = 'none'
        verMas.style.display = 'block';
        iconSearchLeft.style.display = 'block'
        tituloBuqueda.style.display = 'block'
        tituloBuqueda.textContent =inputBuscador.value;
        iconSinResultado.style.display = 'none';
        txtSinResultado.style.display = 'none';
        bordeResultados.style.display = 'block';
        trendingTxt.style.display = 'none';
        trendingTitle.style.display = 'none'
        inputBuscador.disabled = true;
        contenedorSugerencias.style.display = 'none';
        for(let i = 0; i < 12; i++){
         let imgUrl = data[i].images.downsized.url;
        let imagenes = data[i].images
    
        
         let usuario = data[i].username;
         let titulo = data[i].title;
         let id  = data[i].id;
         if( usuario == ''){
             usuario = 'unknown user'
         }else if(data[i].title == ''){
             titulo = ''
         }
         dibujarBusqueda(imgUrl,usuario,titulo,id)
        }
        maxMinPicture()
        descargarGifos()
        eliminarSugerencias()
        llamarSugerencias(palabra)
        aggFavorito()

       }else if(data.length < 12 && data.length >0){
        btnCancel.style.display = 'block';
        lupa.style.display = 'none'
        verMas.style.display = 'block';
        iconSearchLeft.style.display = 'block'
        tituloBuqueda.style.display = 'block'
        tituloBuqueda.textContent =inputBuscador.value;
        iconSinResultado.style.display = 'none';
        txtSinResultado.style.display = 'none';
        bordeResultados.style.display = 'block';
        trendingTxt.style.display = 'none';
        trendingTitle.style.display = 'none'
        inputBuscador.disabled = true;
        contenedorSugerencias.style.display = 'none';


        for(let i = 0; i < data.length; i++){
         let imgUrl = data[i].images.downsized.url;
         let usuario = data[i].username;
         let titulo = data[i].title;
         if( usuario == ''){
             usuario = 'unknown user'
         }else if(data[i].title == ''){
             titulo = ''
         }
         dibujarBusqueda(imgUrl,usuario,titulo)
        }

         maxMinPicture()
         descargarGifos()
         eliminarSugerencias()
         sugerencias(palabra)
         aggFavorito()

       }else{
        tituloBuqueda.style.display = 'block';
        tituloBuqueda.textContent =inputBuscador.value;
        iconSinResultado.style.display = 'block';
        txtSinResultado.style.display = 'block';
        bordeResultados.style.display = 'block';
       }
    
    }).catch(err=>{
        console.log(err)
    })
}

// en esta funcion llamo a mi funcion  llamarBusqueda()
const resolveSerachPeticion = (palabra)=>{
   if(inputBuscador.value != ''){
   llamarBusqueda(palabra)
   }
} 


// con esta funcion introduzco al html las busquedas exitosas
const dibujarBusqueda = (gif,usuario,titulo,id)=>{
    const html = `  
    <div class="gift"> 
        <div class="contenedor-info-tools">
            <div class="tools">
               <div class="icon-tools">
                    <div class="icon-favorito "></div>
                    <div class="icon-descargar"></div>
                    <div class="icon-escalar"></div>
                </div>
            </div>
            <div class="informacion">
                <h2 class="user">${usuario}</h2>
                <p class="gift-titulo">${titulo}</p>
            </div>
        </div>
           <img  class="imagen" id="${id}" src="${gif}" alt="${titulo}">
        
       

    </div>

    `
let div = document.createElement('div')
div.classList.add('contenedor');
div.innerHTML = html
contenedorResultados.append(div)
}





//  #################### ELIMINAR BUSQUEDA         ########################################3
// con esta funcion cancelo la busqueda, le doy los estilos necesarios y elimino la busqueda actual(elimino los elemtos ya buscados del dom)
const cancelarBuqueda = ()=>{
    inputBuscador.value = ''
    trendingTxt.textContent = ''
    eliminarDivs()
    eliminarSugerencias()
    llamarTrendingTerm()

    lupa.style.display = 'block'
    btnCancel.style.display = 'none';
    inputBuscador.disabled = false;
    verMas.disabled= false;
    verMas.style.display = 'none'
    iconSearchLeft.style.display = 'none';
    tituloBuqueda.style.display = 'none';
    bordeResultados.style.display = 'none';
    trendingTxt.style.display = 'flex';
    trendingTitle.style.display = 'block';
    contenedorSugerencias.style.display = 'none';
}

// con esta funcion elimino las cartas que contien los gifs ya buscados
const eliminarDivs = ()=>{
        for(let i = contenedorResultados.children.length - 1  ; i >= 0;i-- ){
          let hijo = contenedorResultados.children[i];
          contenedorResultados.removeChild(hijo);
        }
}


// con esta funcion elimino las sugerencias 
const eliminarSugerencias = ()=>{
    for(let i = contenedorSugerencias.children.length - 1  ; i >= 0;i-- ){
        let hijo = contenedorSugerencias.children[i];
        contenedorSugerencias.removeChild(hijo);
      }
}


// funcion para el boton .ver-mas , me trae 12 gifos mas de mi busqueda actual
//en caso de que no pueda traer 12 gifs, me trae los gifos restantes que queden en el arreglo
const aggMasGifs = ()=>{
    if(inputBuscador.value != ''){
        BuscarGifs(inputBuscador.value).then((resp)=>{    
            let data = resp.data;
            suma += 12
            index += 12
            if(suma < data.length || data.length >50){
                for(let i = index; i < suma ; i++){
                        let imgUrl = data[i].images.downsized.url;
                        let usuario = data[i].username;
                        let titulo = data[i].title;
                        let id     = data[i].id
                        if( usuario == ''){
                            usuario = 'unknown user'
                        }else if(data[i].title == ''){
                            titulo = ''
                        }
                        dibujarBusqueda(imgUrl,usuario,titulo,id)
                   
                   }
                 aggFavorito()
                 maxMinPicture()
                 descargarGifos()


            }else if(suma > data.length){
                verMas.disabled = true
                suma = data.length 
                for(let i = index; i < suma ; i++){
                    let imgUrl = data[i].images.downsized.url;
                    let usuario = data[i].username;
                    let titulo = data[i].title;
                    let id     = data[i].id
                    if( usuario == ''){
                        usuario = 'unknown user'
                    }else if(data[i].title == ''){
                        titulo = ''
                    }
                    dibujarBusqueda(imgUrl,usuario,titulo,id)
               
               }
               aggFavorito()
               maxMinPicture()
               descargarGifos()
               verMas.style.display = 'none'
               suma = 12;
               index = 0
              


            }
            
            
          
        })
        
       
        
       
    }
}


const init = ()=>{
    eventos()
    llamarTrendingTerm()
    menuSticky()
    inputBuscador.value = ''
    
}
init()












const contenedorPreview = document.querySelector('.contenedor-preview');
const video             = document.querySelector('video');
const btnComenzar       = document.querySelector('.comenzar')
const steps             = document.querySelectorAll('.step')
const contenidoUno      = document.querySelector('.contenido');
const contenidoDos      = document.querySelector('.contenido2');
const divGrabar         = document.querySelector('.boton-grabar');
const btnGrabar         = document.querySelector('.grabar')
const divFinalizar      = document.querySelector('.boton-finalizar');
const btnFinalizar      = document.querySelector('.finalizar');
const divUpload         = document.querySelector('.boton-upload')
const btnUpload         = document.querySelector('.upload')
const preview           = document.querySelector('.preview');
const repeat            = document.querySelector('.repeat');
const divTempo          = document.querySelector('.tiempo')
const segundos          = document.querySelector('.segundos');
const minutos           = document.querySelector('.minutos');
const horas             = document.querySelector('.horas');
const fondo             = document.querySelector('.background');
const descargar         = document.querySelector('.download');
const iconLink          = document.querySelector('.link');
const iconLoading       = document.querySelector('.loading');
const texto             = document.querySelector('.text');
const APIKEY            = 'UIu9Y60JBJMJggRmYEbpqjWDiVcXoTTv';
let   arregloIds        = [];
let tiempo              = new Date().getSeconds();
let segundo             = 0;
let blob ;
let timing;
let minuto              = 0;
let hora                = 0;
let recorder ;
let stream ;

/// ######## FUNCIONES############

// esta funcion me permite subir el gif a gipphy, me devuelve la data que tare el id del elemento seleccionado
const uploadGif =async(gif)=>{

    try{
        let url  = `https://upload.giphy.com/v1/gifs?api_key=${APIKEY}`
        let resp = await fetch(url, {
            method: 'POST',
		    body: gif,
        })
        let data =  await resp.json()
        if(data.meta.status == 200){
            return data
        }else{
            throw new Error(`${data.meta.status}`)
        }
    }catch(err){
        console.log(err)
    }
}

// esta funcion me permite obtener el el link mi el gif que subimos con la funcion anterior
// me retorna la data que trae el url
const getUrl = async(id)=>{
    try{
        let url = `https://api.giphy.com/v1/gifs/${id}?api_key=${APIKEY}`;
        let resp = await fetch(url);
        let data = await resp.json();
        if(data.meta.status == 200){
            return data
        }else{
            throw new Error(`${data.meta.status}`)
        }
    }catch(err){
        console.log(err)
    }
    
}


//esta funcion me permite luego de subir el gif obtener el id del elemento subido a giphy y luego lo guardo en el localStorage
const guardarGifo=(id)=>{
    if(localStorage.getItem('mis gifos')){
        arregloIds = JSON.parse(localStorage.getItem('mis gifos'));
    }else{
        arregloIds =[];
    }
    arregloIds.push(id)
    localStorage.setItem('mis gifos',JSON.stringify(arregloIds))
}


//esta funcion me permite determinar el tiempo que trancurre desde que inicia la grabacion
const recordingTime = ()=>{
    segundo++
    if(segundo < 60){
        if(segundo < 10){
            segundos.textContent = `0${segundo}`;
        }else{
            segundos.textContent = segundo
        }
    } else{
        segundos.textContent = `00`
        segundo=0;
        minuto++
    if(minuto < 60){
        if(minuto < 10){
            minutos.textContent = `0${minuto}:`
           }else{
            minutos.textContent = `${minuto}:`
           }
    }else{
        minutos.textContent = `00:`
        minuto = 0;
        hora++
        if(hora < 10){
            horas.textContent = `0${hora}:`
        }else{
            horas.textContent = `${hora}:`

        }
    }

    }  
}


// con esta funcion le pido al usuario que permita el acceso a la camara y lanzo mi funcion para GetMediaRecord
const permisoCamara = ()=>{
    contenidoUno.style.display = 'none';
    contenidoDos.style.display = 'block';
      steps[0].classList.remove('step');
      steps[0].classList.add('step-actived')
        getMediaRecord()
}
  

// getMediaRecor es la funcion con la cual le pido al usuario le de permiso al navegador para usar la camara
//si la promesa se cumple comienzo el proceso de grbacion, caso contrario no comienzo
const getMediaRecord = ()=>{
    let constraints = { video: {  height: 370 } };
    navigator.mediaDevices.getUserMedia(constraints)
    .then((mediaStream)=> {
        stream = mediaStream;
        video.srcObject = mediaStream;
        video.play();
        recorder = RecordRTC(mediaStream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted:()=> {
             console.log('started')
             divTempo.style.display = 'flex'
             divFinalizar.style.display = 'flex';
             timing = setInterval(() => {
                recordingTime()
            }, 1000);
           },
          });


        video.style.display = 'block'
        btnComenzar.style.display = 'none';
        contenidoDos.style.display = 'none';
        divGrabar.style.display = 'flex';
        steps[0].classList.remove('step-actived')
        steps[0].classList.add('step')
        steps[1].classList.remove('step')
        steps[1].classList.add('step-actived')  
    })
    .catch((err)=> { 
        console.log(err ); 
        steps[0].classList.remove('step-actived')
        steps[0].classList.add('step')
        contenidoDos.style.display = 'none';
        contenidoUno.style.display = 'block';
        

})
}
//esta funcion la utilizo para mi evento en el boton ' btnFinalizar que me finaliza la brabacion y da los estilos necesarios
const finalizarGrabacion = ()=>{
    recorder.stopRecording(()=> {
        blob = recorder.getBlob();
        let track = stream.getTracks()[0].stop();
        let blobUrl = URL.createObjectURL(blob);
        preview.src = blobUrl;
        video.style.display = 'none';
        contenedorPreview.style.display ='flex'
        clearInterval(timing)
    });
    divFinalizar.style.display = 'none' ;
    divTempo.style.display     = 'none' ;
    divUpload.style.display    = 'flex' ;
    repeat.style.display       = 'block';
   
}

//  #################  EVENTOS  ########################### 


// con este evento comienzo mi grabacion
btnComenzar.addEventListener('click',permisoCamara );


// con este evento comienzo la grabacion
btnGrabar.addEventListener('click',()=>{
    recorder.startRecording()
    btnGrabar.style.display    = 'none';
    
})


// con este evento finalizo mi grabacion y doy los estilo necesarios, y llamo a mi funcion de subir gif , tambien limpio el intervalo
//no tiene retorno
btnFinalizar.addEventListener('click',finalizarGrabacion)


/// con este evento doy los estilos necesarios e intento subir el gif grabado a giphy
btnUpload.addEventListener('click',()=>{
    divUpload.style.display ='none';
    steps[2].classList.remove('step');
    steps[2].classList.add('step-actived')
    steps[1].classList.remove('step-actived');
    steps[1].classList.add('step');
    repeat.style.display = 'none';
    fondo.style.display = 'flex';
    let form = new FormData();
    form.append("file", recorder.getBlob(), 'creado.gif');
    uploadGif(form).then(resp=>{
        let gifoId = resp.data.id;
        iconLoading.classList.add('ok')
        texto.classList.add('ok')
        texto.textContent = 'GIFO subido con éxito';
        descargar.style.display = 'block';
        iconLink.style.display = 'block';
        setTimeout(() => {
        descargar.classList.add('ok');
        iconLink.classList.add('ok')
        }, 500);
        repeat.style.display = 'block';
        repeat.textContent = 'NUEVA GRABACION';
        guardarGifo(gifoId)
        getUrl(gifoId).then(respuesta=>{
            let urlGif = respuesta.data.url;
            iconLink.id = urlGif;
        })
       
    })
})


//evento para repetir grabacion
repeat.addEventListener('click',()=>{
    repeat.textContent ='REPETIR CAPTURA'
    window.location.reload();
})



//////#copiar al porta papels
// con este evento copio el url de mi gif
//el id contiene la direccion url, este se lo doy en el evento upload, en la funcion getUrl()
iconLink.addEventListener('click',(event)=>{
    let aux = document.createElement("input");
    aux.value = iconLink.id;
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert("Link del Gif Copiado al Portapapeles");
    console.log
})




/// evento para descargar el gifo 
descargar.addEventListener('click',()=>{
    invokeSaveAsDialog(blob)
})
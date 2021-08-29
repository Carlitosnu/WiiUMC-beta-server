let files,container,error,message;

(async()=>{
    files = document.querySelector("#files-ubication");
    container = document.querySelector("#fileContainer");
    error = document.querySelector("#error")
    let f = await fetch("/api/media");
    f = await f.json()
    files.innerHTML = `<b>${f.files.length} files on route</b> - ${f.ubication}`
    renderP(f);
    console.log(f)
})()

async function deleteVideo(videoId) {
    const request = {
        fileID: videoId
    }
    console.log(request);
    let f = await fetch("/api/admin/video",{
        body: JSON.stringify(request),
        headers:{
            "Content-Type": "application/json"
        },
        method: "DELETE",
    })
    f = await f.json();
    location.reload()
}

function renderP(f) {
    container.innerHTML = f.files.map(e=>`
    <div class="videoCard">
        <a href="${e.ubication}">
            <i class="bi bi-camera-video"></i>
            <p>${e.name}</p>
        </a>
        <spam class="btn btn-sm" onclick="deleteVideo('${e.id}')"><i class="bi bi-trash-fill"></i></spam>
    </div>`
    ).join("")
}


const form = document.forms[0]
form.onsubmit = async(e) => {
    e.preventDefault();
    error.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert"><div class="spinner-border text-success flex-shrink-0 me-2" aria-label="Warning:"><span class="visually-hidden">Loading...</span></div><div>Uploading ...</div></div>`
    const send = form[0].files[0]
    const formulario = new FormData();
    formulario.append("file", send);

    let f = await fetch("/api/admin/video",{
        method: "POST",
        body: formulario,
    })
    if(f.ok){
        location.reload()
    }
    else{
        f = await f.text();
        error.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <div>
          ${f}
        </div>
      </div>`
    }
}
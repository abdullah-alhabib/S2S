document.querySelectorAll('.citem').forEach(citem => citem.addEventListener('click',el => {
    document.querySelector('dialog').showModal()
}))

function closeAd(){
    document.querySelector('dialog').close();
}
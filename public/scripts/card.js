function diaWork() {
    document.querySelectorAll('.citem').forEach(citem => citem.addEventListener('click',el => {
        creatDialog(citem);
    }))
}

function closeAd(){
    document.querySelector('dialog').close();
}


async function creatDialog(elemnt) {
    let id = elemnt.id;
    const data = await fetch(`/api/items/${id}`);
    const item = await data.json();
    const dialog = document.querySelector('dialog');


    let leftBar = document.querySelector('.leftInfo');
    leftBar.innerHTML = `
        name: ${item.name} <br>
        price: ${item.price} SR <br>
        bulding: ${item.building}
    `;

    let rightBar = document.querySelector('.rightInfo');
    rightBar.innerHTML = `
        Category: ${item.category} <br>
        Date posted: 2023 <br>
        seller : badr mohammed
    `;
    dialog.showModal()
    
}
diaWork()